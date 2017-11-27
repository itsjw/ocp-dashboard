import { Component, OnInit } from '@angular/core';
import { NFC } from 'nfc-pcsc';

@Component({
  selector: 'app-nfc',
  templateUrl: './nfc.component.html',
  styleUrls: ['./nfc.component.scss']
})
export class NfcComponent implements OnInit {
  nfcStatus: string;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit () {
    console.log('test');
    console.log(NFC)
    this.nfcStatus =  'Loading nfc tools...'
    typeof NFC !== 'undefined' ? this.nfcStatus = 'nfc works!' : this.nfcStatus = 'There waz an issue loading nfc... :(';

    // const nfc = new NFC();
    // nfc.on('reader', async reader => {
    //   console.log('Reader Found :', reader.name);

    //   reader.aid = 'F222222222';
    //   reader.on('card', async card => {
    //     console.log('got card')
    //   });
    //   reader.on('error', async error => {
    //     console.log('Reader Error Occured :', error);
    //   });
    // });
}
}
