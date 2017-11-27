import { Component, OnInit } from '@angular/core';
import { NFC } from 'nfc-pcsc';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = `App xxxrks !`;

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit () {
    console.log('test');
    console.log(NFC)
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
