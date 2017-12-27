import { ToasterConfigService } from './../../providers/toaster.service';
import { NfcService } from './../../providers/nfc/nfc.service';
import { PrinterService } from 'app/providers/printer.service';

import { Component, OnInit, Input, NgZone, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

import { environment } from '../../../environments';

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
  cardContentModel = {
    pin: '',
    securityTransportCompany: '',
    bankName: '',
    appVersion: ''
  }
  cardContent = this.cardContentModel;
  cardMessageUnknowFormatArray: any;

  toasterConfig: ToasterConfig;
  currentAction: string;
  nfcStatusLoading: boolean;
  writtenCardsCount: number;

  clients: any[];
  selectedClient: { id: number; name: string; };

  readOrWriteMode = 'read'; // 'read' or 'write'
  action: 'READ_CARD_MESSAGE';

  DEBUG = environment.debug;
  loading = false;

  @Input()
  public alerts: Array<IAlert> = [];

  nfc = {
    reader: {
      name: null,
      status: 'LOADING', // ON, OFF, ERROR, LOADING - default as 'LOADING'
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
    private toasterService: ToasterService, public toasterConfigService: ToasterConfigService,
    public ngZone: NgZone, private ref: ChangeDetectorRef,
    public printer: PrinterService
  ) {
      console.log('NFC page loaded.');
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
    // @TODO: tcp request here
    setTimeout(() => {
      this.clients = [
        {id: 1, name: 'Masdria'},
        {id: 2, name: 'Loomis'},
        {id: 3, name: 'c'},
        {id: 4, name: 'd'},
        {id: 5, name: 'e'}
      ];
      this.selectedClient =  this.clients[0];
    }, 1000);

    this.writtenCardsCount = 0;
    this.nfcStatusLoading =  true;


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
      this.loading = true;

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
      this.loading = false;

      // update view object

    });

    // aCardCouldntBeRead - when a card read or process failed
    this.nfcS.aCardCouldntBeRead$.subscribe(error => {
      console.log('A card could not be read and processed', error)

      // A card has been processed: hide spinner
      this.loading = false;

      // update view object

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
    // const valueToWrite = {pin: 'U2FsdGVkX19Buxk/sTWmdXFrfCgNsfmxJOqTvoJxW4kHS7+phRSqIegFb//zXmREjZLsaEK2RqIpBMyihlUuA48V6FQGvLyCPz948b5zv3Y=', securityTransportCompany: 'Masdria', bankName: 'The Saudi British Bank', appVersion: '1.0.0'};
    const fakePin = (Math.floor(1000 + Math.random() * 9000)).toString();
    const valueToWrite = {
      // pin: this.cardContent.pin || this.cardContentModel.pin,
      // pin: fakePin,
      // @TODO: request the pin through tcp server, it's async.
      pin: setTimeout(() => {
        return fakePin;
      }, 1000),
      // securityTransportCompany: this.cardContent.securityTransportCompany || this.cardContentModel.securityTransportCompany,
      securityTransportCompany: this.selectedClient.name,
      bankName: this.cardContent.bankName || this.cardContentModel.bankName,
      // appVersion: this.cardContent.appVersion || this.cardContentModel.appVersion,
      appVersion: environment.version,
    }
    return valueToWrite;
  }



  modelChanged(ev) {
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
    this.cardMessageUnknowFormatArray = [];
  }

}

export interface IAlert {
  type: string;
  message: string;
}
