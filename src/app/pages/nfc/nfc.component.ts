import { Component, OnInit } from '@angular/core';
import { NFC } from 'nfc-pcsc';

@Component({
  selector: 'ngx-nfc',
  styleUrls: ['./nfc.component.scss'],
  templateUrl: './nfc.component.html',
})

export class NfcComponent implements OnInit {
  clients: string[];
  nfcStatus: any;
  writtenCardsCount: number;

  selectedValue: any;
  countries: any;

  constructor() {
    console.log('NFC page loaded.')
  }

  ngOnInit() {
  }


  ngAfterViewInit () {
    this.countries = [
      {id: 1, name: "United States"},
      {id: 2, name: "Australia"},
      {id: 3, name: "Canada"},
      {id: 4, name: "Brazil"},
      {id: 5, name: "England"}
    ];
    this.selectedValue = null;

    console.log(NFC);
    this.writtenCardsCount = 0;
    this.nfcStatus =  'Loading nfc tools...'
    setTimeout(() => {
      this.clients = [ 'a', 'b', 'c', 'd', 'e'];
    }, 1000);
    typeof NFC !== 'undefined' ? this.nfcStatus = "green" : this.nfcStatus = false;

    const nfc = new NFC();
    nfc.on('reader', async reader => {
      console.log('Reader Found :', reader.name);

      reader.aid = 'F222222222';
      reader.on('card', async card => {
        console.log('got card')
      });
      reader.on('error', async error => {
        console.log('Reader Error Occured :', error);
      });
    });
}
}
