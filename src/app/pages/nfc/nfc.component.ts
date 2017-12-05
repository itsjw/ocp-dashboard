import { ToasterConfigService } from './../../providers/toaster.service';
import { NfcService } from './../../providers/nfc/nfc.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import 'style-loader!angular2-toaster/toaster.css';

@Component({
  selector: 'ngx-nfc',
  styleUrls: ['./nfc.component.scss'],
  templateUrl: './nfc.component.html',
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

  nfcManager(globalNfcObject) {
    this.nfc = globalNfcObject;
    console.log(globalNfcObject)
    // something wrong happened
    if (globalNfcObject.error) {
      this.showToast('error', 'Erreur', globalNfcObject.error.type + ' - ' + globalNfcObject.error.error);
      this.nfc.error = null;
    }
  }

  // @TODO: put this in a toast component class
  private showToast(type: string, title: string, body: string) {
    this.toasterConfig = this.toasterConfigService.getConfig();
    const toast: Toast = this.toasterConfigService.getToast(title, body)
    this.toasterService.popAsync(toast);
  }


}
