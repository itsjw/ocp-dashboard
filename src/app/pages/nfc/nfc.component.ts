import { NfcService } from './../../providers/nfc/nfc.service';
import { PrinterService } from 'app/providers/printer.service';

import { Component, OnInit, Input, NgZone, ChangeDetectorRef, AfterContentInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ToasterConfigService } from './../../providers/toaster.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

import { environment } from '../../../environments';
import { TcpClientService } from 'app/providers/tcp/tcp-client.service';
import { concat } from 'rxjs/operator/concat';
import { Buffer } from 'buffer';

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
  config: ToasterConfig;
  cardContent: { pin: any; securityTransportCompany: string; bankName: any; appVersion: string; };
  cardContentModel = {
    pin: '',
    securityTransportCompany: '',
    bankName: '',
    appVersion: ''
  }
  cardMessageUnknowFormatArray: any;

  currentAction: string;
  nfcStatusisLoading: boolean;
  writtenCardsCount: number;

  clients: any;
  selectedClient: { id: number; name: string; };

  // readOrWriteMode = 'read'; // 'read' or 'write'
  readOrWriteMode = 'write'; // 'read' or 'write'
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
    public ngZone: NgZone, private ref: ChangeDetectorRef,
    public printer: PrinterService,
    public tcp: TcpClientService,
    public toast: ToasterConfigService,
    private toasterService: ToasterService
  ) {
      console.log('NFC page loaded.');

      this.nfcS.setMode(this.readOrWriteMode); // set read/write mode to default @init

      this.cardContent = Object.assign({}, this.cardContentModel);

  }

  ngAfterContentInit () {

    // this.printer.printText('12345678910');

    // Get client list @init
    // this.tcp.getClientList().then(clients => {
    //   console.log(clients);
    //   this.clients = clients;
    //   this.selectedClient =  clients[0]

    //   // Debug => starts in write mode
    //   this.writeCard();
    //   this.nfcS.setNDEFMessageToWrite(this.getValuesToWrite());
      
    // })
    this.tcp.getClientList().on('clients', clients => {
      this.clients = clients;
      this.selectedClient = clients[0]
    });


    this.writtenCardsCount = 0;
    this.nfcStatusisLoading =  true;


    this.currentAction = '-';

    /**
     * Subscribes
     * We subscribe to all our observables here
     */

    // Reader - when we find a new reader
    this.nfcS.onReader$.subscribe(reader => {
      if (this.DEBUG) { console.log(`device attached`, reader.name ); }

      // update view object
      this.nfc.reader.name = reader.name;
      this.nfc.reader.status = 'ON';

    });

    // Reader end - when we lose a reader
    this.nfcS.onReaderEnd$.subscribe(readerEnd => {
      if (this.DEBUG) { console.log(`device removed`); }

      // We've lost the reader
      this.nfc.reader.status = 'OFF';
      this.nfc.reader.name = '';

    });

    // card - when we find a card
    this.nfcS.onCard$.subscribe(async card => {
      if (this.DEBUG) { console.log(`Found a card`, card ); }

      // Reset the view
      // this.resetViewObjects();

      // A card has just been swiped but not processed yet: show spinner
      this.nfc.card.status = 'ON';
      this.isLoading = true;

    });

    // card.off - when we lose a card
    this.nfcS.onCardOff$.subscribe(cardOff => {
      if (this.DEBUG) { console.log(`The card has been removed`, cardOff ); }

        // A card has been removed
        this.nfc.card.status = 'OFF';

    });

    // aCardHasBeenRead - when a card has been read and processed
    this.nfcS.aCardHasBeenRead$.subscribe(parsedMessage => {
      console.log('A card has been read and processed', parsedMessage)

      // Process ended: hide spinner
      this.isLoading = false;

      // Tell the user a card has been read
      this.showToast('success', 'Success', 'A card has been read and processed');

      // Verify if record 0 of the parsed NDEF message contains our props
      const recordAsJSON = this.isAValidCard(parsedMessage);

      if (!recordAsJSON) {
        this.alerts.push({ type: 'danger', message: 'The card does not contain the expected data'});

        // Card does not contains our JSON object, update 'Unknown format' view object
        this.cardMessageUnknowFormatArray = parsedMessage;

      } else {
      // Card contains our JSON object, update 'standard' view object
        this.cardContent = recordAsJSON;
      }

    });

    // aCardCouldntBeRead - when a card read or process failed
    this.nfcS.aCardCouldntBeRead$.subscribe(error => {

      // Process ended: hide spinner
      this.isLoading = false;

      // Tell the user a card has could not be read
      this.showToast('error', 'Error', 'An error occurred while reading the card: <br /> <strong>' + error + '</strong>');

    });

    // aCardHasBeenWritten - when a card has been written
    this.nfcS.aCardHasBeenWritten$.subscribe(data => {
      console.log('A card has been written', data);

      // Tell the user a card has been written
      this.showToast('success', 'Success', 'A card has been successfully written');
      this.writtenCardsCount++;

      this.init();
    });

    // aCardHasBeenWritten - when a card could not be written
    this.nfcS.aCardCouldNotBeWritten$.subscribe(error => {
      console.log('CNW')
      
      // Process ended: hide spinner
      this.isLoading = false;

      this.showToast('error', 'Error', 'An error occurred while writing the card: <br /> <strong>' + error + '</strong>');
    });

    
    // error - nfc-pcsc emitted errors are thrown here (either reader or card)
    this.nfcS.onError$.subscribe(error => {
      console.log('OERR');
      
      // Process ended: hide spinner
      this.isLoading = false;

      this.showToast('error', 'Error', 'An error occurred: <br /> <strong>' + error + '</strong>');
    });
    // error - any other (global) error are thrown here
    this.nfcS.globalError$.subscribe(error => {
      console.log('GERR');
      
      // Process ended: hide spinner
      this.isLoading = false;

      this.showToast('error', 'Error', 'An error occurred: <br /> <strong>' + error + '</strong>');
    });
    
  }


  /**
   * @method getValuesToWrite
   * @description Build a serialized JSON object containing all the values to write on the card
   * @example       let data = {pin: "U2FsdGVkX19Buxk/sTWmdXFrfCgNsfmxJOqTvoJxW4kHS7+phRSqIegFb//zXmREjZLsaEK2RqIpBMyihlUuA48V6FQGvLyCPz948b5zv3Y=", securityTransportCompany: "Masdria", bankName: "The Saudi British Bank", appVersion: "1.0.0"};
   *
   * @memberof NfcComponent
   */
  getValuesToWrite() {
    // A pin code has already been generated, update only other fields
    if (this.cardContent.pin) {
      this.cardContent.securityTransportCompany = this.selectedClient.name;
      this.cardContent.bankName = this.cardContent.bankName;
      return [{ type: 'text', text: JSON.stringify(this.cardContent), language: 'en'}];
    }

    this.isLoading = true;
    // @TODO: replace by tcp server ?
    
    // args: uuId, clientId
    this.tcp.createTag('123456789', '49').addListener('tagCreated', parsedResult => {
      console.log('parsedResult', parsedResult)
    })
    // this.tcp.createTag('123456789', '49').addListener('data', () => console.log('adadad')).then(response => {

    // })
    this.tcp.createTag('123456789', '49').on('tagCreated', parsedResult => {
      this.cardContent.pin = parsedResult.pinCode;
      this.cardContent.securityTransportCompany = this.selectedClient.name;
      this.cardContent.bankName = this.cardContent.bankName;
      this.cardContent.appVersion = environment.version

      this.isLoading = false;

      this.nfcS.setNDEFMessageToWrite(this.getValuesToWrite());

      // @TODO:
      // if (parsedResult.error) {
      //   this.isLoading = false;
      //   this.showToast('error', 'Error', 'Something went wrong while trying to get the pin code through the TCP server.');
  
      //   console.log('TCP server error')
      // }

    })

    // this.tcp.getPinCode().then(pinCode => {
    //   this.cardContent.pin = pinCode;
    //   this.cardContent.securityTransportCompany = this.selectedClient.name;
    //   this.cardContent.bankName = this.cardContent.bankName;
    //   this.cardContent.appVersion = environment.version

    //   this.isLoading = false;

    //   this.nfcS.setNDEFMessageToWrite(this.getValuesToWrite());

    // }).catch(error => {
    //   this.isLoading = false;
    //   this.showToast('error', 'Error', 'Something went wrong while trying to get the pin code through the TCP server.');

    //   console.log('TCP server error', error)
    // })

    return [{ type: 'text', text: JSON.stringify(this.cardContent), language: 'en'}];
  }



  modelChanged(ev) {
    console.log(ev)
    // set the value to write using appriopriate getter
    this.nfcS.setNDEFMessageToWrite(this.getValuesToWrite());
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
    this.nfcS.setNDEFMessageToWrite(this.getValuesToWrite());
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
    this.cardContent = Object.assign({}, this.cardContentModel);
    this.cardMessageUnknowFormatArray = [];
  }
  /**
   * @method init
   * @description reinit read or write mode: 
   *      - write mode => trigger the tcp pin request
   *      - read mode => tbd ?
   * @memberof NfcComponent
   */
  init() {
    this.nfcS.setMode(this.readOrWriteMode); // set read/write mode to default @init

    if (this.readOrWriteMode === 'write') {
      // Reinit in write mode
      this.writeCard();
      this.nfcS.setNDEFMessageToWrite(this.getValuesToWrite());
    }
    if (this.readOrWriteMode === 'read') {
      // Reinit in write mode
      this.readCard();
    }
  }

  isAValidCard(parsedMessage) {
    try {
      const recordAsJSON = JSON.parse(parsedMessage[0].text);
      for (const property in this.cardContentModel) {

        if (!recordAsJSON.hasOwnProperty(property)) {
          console.log('INFO comp): Did not found property: "' + property + '" in object:', recordAsJSON);
          // ERROR: missing property
          return false;
        }
      }
      return recordAsJSON;
    } catch (error) {
      console.log(error);
      return false;
    }

  }
  showToast(type: string, title: string, body: string) {
    this.config = new ToasterConfig({
      positionClass: 'toast-top-right',
      timeout: 10000,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: true,
      animation: 'flyRight',
      limit: 25,
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: 10000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };

    console.log(toast)
    this.toasterService.popAsync(toast);
  }
}

export interface IAlert {
  type: string;
  message: string;
}
