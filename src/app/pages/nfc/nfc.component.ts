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
import { CryptoService } from 'app/providers/crypto/crypto.service';

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
  getClientListReq: boolean;
  createTagReq: boolean;
  config: ToasterConfig;
  cardContent: { uid: string; pin: any; securityTransportCompany: string; bankName: any; appVersion: string; };
  cardContentModel = {
    uid: '',
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
    TCPServer: {
      status: 'LOADING'
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
    private toasterService: ToasterService,
    private crypto: CryptoService
  ) {
      console.log('NFC page loaded.');

      this.nfcS.setMode(this.readOrWriteMode); // set read/write mode to default @init

      this.cardContent = Object.assign({}, this.cardContentModel);

  }

  ngAfterContentInit () {

    const TCPServerTest = this.tcp.testConnection();

    // this.printer.printText('12345678910');

    // MOCKER
    // this.tcp.getClientListx().then(clients => {
    //   console.log(clients);
    //   this.clients = clients;
    //   this.selectedClient =  clients[0]

    //   // Debug => starts in write mode
    //   this.writeCard();
    //   this.nfcS.setNDEFMessageToWrite(this.getValuesToWrite());

    // })

    // Simple flag to avoid multiple requests to get the pin code
    this.getClientListReq = true;

    this.tcp.getClientList().on('clients', clients => {

      if (!clients) {
        this.showToast('error', 'Error', 'Something went wrong while trying to get the pin code through the TCP server.');
        this.getClientListReq = false;
        return;
      }

      this.clients = clients;
      this.selectedClient = clients[0];

      // We got the client list (and therefore a selected client), we can get the pin code and app version
      this.init();
      
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

      // reset the view at any switch read/write
      // this.resetViewObjects();

      // A card has just been swiped but not processed yet: show spinner
      this.nfc.card.status = 'ON';
      this.nfc.card.uid = card.uid;
      this.isLoading = true;

      if (this.readOrWriteMode === 'read') {
        this.nfcS.triggerAction();
      }
      
      if (this.readOrWriteMode === 'write') {
        // set the value to write using appriopriate getter
        this.getValuesToWrite().then(NDEFMessage => {
          console.log('Found a card and re-set NDEFMessage as:', NDEFMessage);
          this.nfcS.setNDEFMessageToWrite(NDEFMessage);
          this.nfcS.triggerAction();
        }, err => {
          console.log(err)
        })
      }

    });

    // card.off - when we lose a card
    this.nfcS.onCardOff$.subscribe(cardOff => {
      if (this.DEBUG) { console.log(`The card has been removed`, cardOff ); }

        // A card has been removed
        this.nfc.card.status = 'OFF';
        this.nfc.card.uid = '';

        this.isLoading = false;
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
        console.log(this.cardContent)
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

      const cardUid = JSON.parse(data[0].text).uid;

      // No parsing nor confirming, we assume it worked and we passed the confirm cmd successfully.
      this.tcp.confirmTag(cardUid);

      // Tell the user a card has been written
      this.showToast('success', 'Success', 'A card has been successfully written (#' + cardUid + ')' );

      // Card count
      this.writtenCardsCount++;


      // reinit to regenerate the pin for next card
      this.init();
    });

    // aCardHasBeenWritten - when a card could not be written
    this.nfcS.aCardCouldNotBeWritten$.subscribe(error => {
      console.log('A card could not be written', error);

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


   /**
   * TCP Client
   */

    this.tcp.onTCPClientConnect$.subscribe(connect => {
      console.log('Connected to the TCP server.');
      this.nfc.TCPServer.status = 'ON';
    })
    this.tcp.onTCPClientError$.subscribe(error => {
      console.log('An error occured on the TCP server link:', error)
      this.nfc.TCPServer.status = 'OFF';

    })
    // @TODO: implement the rest of the events if needed ?
  }


  /**
   * @method getValuesToWrite
   * @description Build a serialized JSON object containing all the values to write on the card
   * @example       let data = {pin: "U2FsdGVkX19Buxk/sTWmdXFrfCgNsfmxJOqTvoJxW4kHS7+phRSqIegFb//zXmREjZLsaEK2RqIpBMyihlUuA48V6FQGvLyCPz948b5zv3Y=", securityTransportCompany: "Masdria", bankName: "The Saudi British Bank", appVersion: "1.0.0"};
   *
   * @memberof NfcComponent
   */
  getValuesToWrite() {
    return new Promise((resolve, reject) => {

      console.log('getValuesToWrite this.cardContent', this.cardContent, this.cardContent.bankName)

      // A pin code has already been generated, update only other fields
      if (this.cardContent.pin || this.createTagReq) {
        console.log('A PIN code has already been generated.')
        this.cardContent.securityTransportCompany = this.selectedClient.name;
        this.cardContent.bankName = this.cardContent.bankName;
        resolve([{ type: 'text', text: JSON.stringify(this.cardContent), language: 'en'}]);
        return;
      }

      // Do not get the pin code through the TCP server if we don't have a card on the reader
      // We need a card uid to get the pin code
      if (this.nfc.card.status !== 'ON') {
        reject('Not card found, did not try to get the pin code through the tcp server');
        return;
      }

      this.isLoading = true;

      // Simple flag to avoid multiple requests to get the pin code
      this.createTagReq = true;

      // We need to get a pin code from the TCP server
      // args: uuId, clientId
      this.tcp.createTag(this.nfc.card.uid, this.selectedClient.id).on('tagCreated', parsedResult => {
        console.log('Requesting a PIN on the TCP server')
        
        this.isLoading = false;
        this.createTagReq = false;

        console.log('TCP server returned:', parsedResult);

        if (!parsedResult) {
          const err = 'Something went wrong while trying to get the pin code through the TCP server.';
          this.showToast('error', 'Error', err);
          reject(err);
          return;
        }

        this.cardContent.pin = this.crypto.encrypt(parsedResult.pin, 'MasdriaDemoKey');
        this.cardContent.securityTransportCompany = this.selectedClient.name;
        this.cardContent.bankName = this.cardContent.bankName;
        this.cardContent.uid = parsedResult.nfc_id;
        this.cardContent.appVersion = environment.version

        console.log('TCP request ended successfully, cardContent has been set to:', this.cardContent)
        console.log('TCP request ended successfully, NDEFMessage has been set to:', [{ type: 'text', text: JSON.stringify(this.cardContent), language: 'en'}])
        resolve([{ type: 'text', text: JSON.stringify(this.cardContent), language: 'en'}]);
        
      })

      // MOCKER
      // this.tcp.getPinCode().then(pinCode => {
      //   this.cardContent.pin = pinCode;
      //   this.cardContent.securityTransportCompany = this.selectedClient.name;
      //   this.cardContent.bankName = this.cardContent.bankName;
      //   this.cardContent.appVersion = environment.version

      //   this.isLoading = false;

      //   this.nfcS.setNDEFMessageToWrite(this.getValuesToWrite());

      // })
    });
  }



  onUserInput(ev) {
    // set the value to write using appriopriate getter
    this.getValuesToWrite().then(NDEFMessage => {
      console.log('onUserInput: set NDEFMessage as:', NDEFMessage);
      this.nfcS.setNDEFMessageToWrite(NDEFMessage);
    }, err => {
      console.log(err)
    })
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
    // this.getValuesToWrite().then(NDEFMessage => {
    //   console.log('Change to Write mode detected: set NDEFMessage as:', NDEFMessage);
    //   this.nfcS.setNDEFMessageToWrite(NDEFMessage);
    // }, err => {
    //   console.log(err)
    // })
  }
  setNDEFMessageToWrite(cardContent) {

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
      timeout: 7000,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: false,
      animation: 'flyRight',
      limit: 25,
      iconClasses: {
        error: 'fa fa-exclamation-triangle toaster-icon',
        info: 'fa fa-info-circle toaster-icon',
        wait: 'fa fa-pause toaster-icon',
        success: 'fa fa-check-circle toaster-icon',
        warning: 'fa fa-exclamation-circle toaster-icon'
      },
      typeClasses: {
        error: 'toast-danger',
        info: 'toast-info',
        wait: 'toast-wait',
        success: 'toast-success',
        warning: 'toast-warning'
      }
    });
    const toast: Toast = {
      type: type,
      title: title,
      body: body,
      timeout: 10000,
      showCloseButton: true,
      bodyOutputType: BodyOutputType.TrustedHtml,
    };

    this.toasterService.popAsync(toast);
  }
}

export interface IAlert {
  type: string;
  message: string;
}
