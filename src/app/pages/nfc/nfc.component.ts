import { ToasterConfigService } from './../../providers/toaster.service';
import { NfcService } from './../../providers/nfc/nfc.service';
import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

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

export class NfcComponent implements OnInit {

  toasterConfig: ToasterConfig;
  nfcThread: Subscription;
  currentAction: string;
  nfcStatusLoading: boolean;
  nfc: any; // global obj
  writtenCardsCount: number;

  clients: any[];
  selectedClient: { id: number; name: string; };

  readOrWriteStatus = 'write';

  @Input()
  public alerts: Array<IAlert> = [];

  private backup: Array<IAlert>;

  constructor(public nfcS: NfcService, private toasterService: ToasterService, public toasterConfigService: ToasterConfigService) {
    console.log('NFC page loaded.');

  }

  ngOnInit() {
  }


  ngAfterViewInit () {

    this.nfcS.init();

    /**
     * Init:
     * 0- Get client list
     * 1- Init NFC, check status
     */
    // @TODO: tcp request here
    setTimeout(() => {
      this.clients = [
        {id: 1, name: 'a'},
        {id: 2, name: 'b'},
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
     * Main NFC Thread
     */
    this.nfcThread = this.nfcS.data.subscribe(
      globalNfcObject =>
        this.nfcManager(globalNfcObject),
        // console.log('v', value),
      error => console.log('e', error),
      () => console.log('nfc end.')
    );

  }


  /**
   * @method ncfManager
   * @description manages values received from the main observable *nfcThread*
   *
   * @param {any} globalNfcObject 'nfc global object'
   * @memberof NfcComponent
   */
  nfcManager(globalNfcObject) {
    this.nfc = globalNfcObject;
    console.log(globalNfcObject)
    // something wrong happened
    if (globalNfcObject.error) {
      this.showToast('error', 'Erreur', globalNfcObject.error.type + ' - ' + globalNfcObject.error.error);
      this.nfc.error = null;
    }
  }


  /**
   * @method showToast
   * @description show a toast on the top-right corner
   *
   * @private
   * @param {string} type 'error, success, info, warning...'
   * @param {string} title 'a title'
   * @param {string} body 'body of the message to be shown'
   * @memberof NfcComponent
   */
  private showToast(type: string, title: string, body: string) {
    this.toasterConfig = this.toasterConfigService.getConfig();
    const toast: Toast = this.toasterConfigService.getToast(title, body)
    this.toasterService.popAsync(toast);
  }

  closeAlert(alert: IAlert) {
    const index: number = this.alerts.indexOf(alert);
    this.alerts.splice(index, 1);
  }

  reset() {
    let als = [{
      id: 1,
      type: 'success',
      message: 'Reader found a card',
    }, {
      id: 2,
      type: 'info',
      message: 'This is an info alert',
    }, {
      id: 3,
      type: 'warning',
      message: 'This is a warning alert',
    }, {
      id: 4,
      type: 'danger',
      message: 'Something went wrong while read the card: You probably pulled the card off too soon.',
    }, {
      id: 5,
      type: 'primary',
      message: 'This is a primary alert',
    }, {
      id: 6,
      type: 'secondary',
      message: 'This is a secondary alert',
    }, {
      id: 7,
      type: 'light',
      message: 'This is a light alert',
    }, {
      id: 8,
      type: 'dark',
      message: 'This is a dark alert',
    }]
    als.forEach((al, i) => {
      setTimeout(() => {
        this.alerts.push(al);
      }, 1000 * i);
    })


      this.backup = this.alerts.map((alert: IAlert) => Object.assign({}, alert));

  }

}


export interface IAlert {
  id: number;
  type: string;
  message: string;
}
