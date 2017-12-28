import { ToasterConfigService } from './../../providers/toaster.service';
import { NfcService } from './../../providers/nfc/nfc.service';
import { PrinterService } from 'app/providers/printer.service';

import { Component, OnInit, Input, NgZone, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

import { environment } from '../../../environments';
import { TcpClientService } from 'app/providers/tcp/tcp-client.service';

@Component({
  selector: 'ngx-nfc',
  styleUrls: ['./nfc.component.scss'],
  templateUrl: './nfc.component.html',
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: '0' }),
        animate('.5s ease-out', style({ opacity: '1' })),
      ]),
      transition(':leave', [
        style({ opacity: '1' }),
        animate('.5s ease-in', style({ opacity: '0' })),
      ]),
    ]),
  ]
})

export class NfcComponent implements AfterContentInit {
  cardContent: { pin: any; securityTransportCompany: string; bankName: any; appVersion: string; };
  cardContentModel = {
    pin: '',
    securityTransportCompany: '',
    bankName: '',
    appVersion: ''
  }
  cardMessageUnknowFormatArray: any;

  toasterConfig: ToasterConfig;
  currentAction: string;
  nfcStatusisLoading: boolean;
  writtenCardsCount: number;

  clients: any;
  selectedClient: { id: number; name: string; };

  readOrWriteMode = 'read'; // 'read' or 'write'
  action: 'READ_CARD_MESSAGE';

  DEBUG = environment.debug;
  isLoading = false;

  @Input()
  public alerts: Array<IAlert> = [];

  nfc = {
    reader: {
      name: null,
      status: 'isLoading', // ON, OFF, ERROR, isLoading - default as 'isLoading'
      // object: null // useless - map & pass only what we need ?
    },
    card: {
      uid: null,
      status: 'OFF', // ON, OFF, PROCESSING - default as 'OFF'
    },
    action: {
      type: null, // CARD_READ, CARD_READ - default as null
      status: null, // SUCCESS, ERROR, COMPLETE - default as null
      READ_RESULT: {
          rawData: null,
          ndefMessage: null,
          utf8: null,
          hex: null
      },
      WRITE_RESULT: {
        valueWritten: null,
        valueWrittenAsBuffer: null,
        writeStatus: null
      },
    }
  }

  constructor(
    public nfcS: NfcService,
    public toast: ToasterConfigService,
    public ngZone: NgZone, private ref: ChangeDetectorRef,
    public printer: PrinterService,
    public tcp: TcpClientService
  ) {
      console.log('NFC page loaded.');
      this.cardContent = this.cardContentModel;
  }

  ngAfterContentInit () {

    // this.printer.printText('12345678910');

    // if (this.readOrWriteMode === 'write') { this.writeCard() }

    // this.nfcS.setMode(this.readOrWriteMode); // set read/write mode to default @init

    /**
     * Init:
     * 0- Get client list
     * 1- Init NFC, check status
     */
    this.tcp.getClientList().then(clients => {
      console.log(clients);
      this.clients = clients;
      this.selectedClient =  clients[0]
    })


    this.writtenCardsCount = 0;
    this.nfcStatusisLoading =  true;


    this.currentAction = '-';

    /**
     * Subscribes
     * We subscribe to all our observables here
     */

    // Reader - when we find a new reader
    this.nfcS.onReader$.subscribe(reader => {
      if (this.DEBUG) { console.info(`device attached`, reader.name ); }

      // update view object
      this.nfc.reader.name = reader.name;
      this.nfc.reader.status = 'ON';

    });

    // Reader end - when we lose a reader
    this.nfcS.onReaderEnd$.subscribe(readerEnd => {
      if (this.DEBUG) { console.info(`device removed`); }

      // We've lost the reader
      this.nfc.reader.status = 'OFF';
      this.nfc.reader.name = '';

    });

    // card - when we find a card
    this.nfcS.onCard$.subscribe(async card => {
      if (this.DEBUG) { console.info(`Found a card`, card ); }

      // A card has just been swiped but not processed yet: show spinner
      this.nfc.card.status = 'ON';
      this.isLoading = true;

    });

    // card.off - when we lose a card
    this.nfcS.onCardOff$.subscribe(cardOff => {
      if (this.DEBUG) { console.info(`The card has been removed`, cardOff ); }

        // A card has been removed
        this.nfc.card.status = 'OFF';

    });

    // error - any error is thrown here, either reader or card
    this.nfcS.onError$.subscribe(error => {
      if (this.DEBUG) { console.error(`an error occurred`, { error }); }
    });


    // aCardHasBeenRead - when a card has been read and processed
    this.nfcS.aCardHasBeenRead$.subscribe(data => {
      console.log('A card has been read and processed', data)

      // A card has been processed: hide spinner
      this.isLoading = false;

      // update view object
      // this.alerts.push({ type: 'success', message: 'Read a card successfully'});
      this.toast.show('success', 'Read a card successfully', 'A card has been read and processed');
    });

    // aCardCouldntBeRead - when a card read or process failed
    this.nfcS.aCardCouldntBeRead$.subscribe(error => {
      console.log('A card could not be read and processed', error)

      // A card has been processed: hide spinner
      this.isLoading = false;

      // update view object
      this.alerts.push({ type: 'danger', message: 'An error occurred while reading the card: \n' + error });

    });

    // aCardHasBeenWritten - when a card has been written and processed
    this.nfcS.aCardHasBeenWritten$.subscribe(data => {
      console.log('A card has been written and processed', data)
      console.log(JSON.parse(data))
    });

  }


  /**
   * @method getValueToWrite
   * @description Build a serialized JSON object containing all the values to write on the card
   * @example       let data = {pin: "U2FsdGVkX19Buxk/sTWmdXFrfCgNsfmxJOqTvoJxW4kHS7+phRSqIegFb//zXmREjZLsaEK2RqIpBMyihlUuA48V6FQGvLyCPz948b5zv3Y=", securityTransportCompany: "Masdria", bankName: "The Saudi British Bank", appVersion: "1.0.0"};
   *
   * @memberof NfcComponent
   */
  getValueToWrite() {

    // A pin code has already been generated, update only other fields
    if (this.cardContent.pin) {
      this.cardContent.securityTransportCompany = this.selectedClient.name;
      this.cardContent.bankName = this.cardContent.bankName;
      return;
    }

    this.isLoading = true;

    this.tcp.getPinCode().then(pinCode => {
      console.log('p', pinCode)
      this.cardContent.pin = pinCode;
      this.cardContent.securityTransportCompany = this.selectedClient.name;
      this.cardContent.bankName = this.cardContent.bankName;
      this.cardContent.appVersion = environment.version

      this.isLoading = false;

    }).catch(error => {
      this.isLoading = false;
      this.toast.show('error', 'An error occured', 'Something went wrong while trying to get the pin code through the TCP server.');

      console.log('errrrrr', error)
    })

    return this.cardContent;
  }



  modelChanged(ev) {
    console.log(ev)
    // set the value to write using appriopriate getter
    this.nfcS.setValueToWrite(this.getValueToWrite());
  }
  readCard() {
    // reset the view at any switch read/write
    this.resetViewObjects();

    // switch mode to 'read'
    this.readOrWriteMode = 'read';
    this.nfcS.setMode(this.readOrWriteMode);
  }
  writeCard() {
    // reset the view at any switch read/write
    this.resetViewObjects();

    // switch mode to 'write'
    this.readOrWriteMode = 'write';
    this.nfcS.setMode(this.readOrWriteMode);

    // set the value to write using appriopriate getter
    this.nfcS.setValueToWrite(this.getValueToWrite());
  }

  /**
   * @method resetViewObject
   * @description resets the view (empty it) by settings object bound to view to default
   *      - message array
   *      - cardContent object
   *
   * @memberof NfcComponent
   */
  resetViewObjects() {
    this.alerts = [];
    this.cardContent = this.cardContentModel;
    this.cardContent = this.cardContentModel;
    this.cardMessageUnknowFormatArray = [];
  }
  // /**
  //  * @method showToast
  //  * @description show a toast on the top-right corner
  //  *
  //  * @private
  //  * @param {string} type 'error, success, info, warning...'
  //  * @param {string} title 'a title'
  //  * @param {string} body 'body of the message to be shown'
  //  * @memberof NfcComponent
  //  */
  // private showToast(type: string, title: string, body: string) {
  //   this.toasterConfig = this.toasterConfigService.getConfig();
  //   const toast: Toast = this.toasterConfigService.getToast(title, body)
  //   this.toasterService.popAsync(toast);
  // }
}

export interface IAlert {
  type: string;
  message: string;
}
