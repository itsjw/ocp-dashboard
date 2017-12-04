import { NfcService } from './../../providers/nfc/nfc.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'ngx-nfc',
  styleUrls: ['./nfc.component.scss'],
  templateUrl: './nfc.component.html',
})

export class NfcComponent implements OnInit {
  subscription: Subscription;
  currentAction: string;
  nfcStatusLoading: boolean;
  nfc: any;
  nfcStatus: any;
  writtenCardsCount: number;

  clients: any[];
  selectedClient: { id: number; name: string; };

  constructor(public nfcS: NfcService) {
    console.log('NFC page loaded.')
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



    this.subscription = this.nfcS.data.subscribe(
      value => 
      this.nfc = value,
      // console.log('v', value),
      error => console.log('e', error),
      () => console.log('nfc end.')
    );

  }
}
