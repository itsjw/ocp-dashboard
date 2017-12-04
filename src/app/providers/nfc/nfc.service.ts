import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NFC } from 'nfc-pcsc';
import { OnInit } from '@angular/core';
import { NfcParserService } from './nfc.read';

@Injectable()
export class NfcService {
  nfc: any;
  data: Observable<{}>;

  constructor(public NfcParser: NfcParserService) {
    console.log('NfcService loaded');
  }

  init() {
    
    const nfc = new NFC();
    
    
    // observable object
    this.nfc = {
      reader: {
        object: null, // full nfc-csc lib object
        status: 'loading', // on/off/err/loading(def)
        name: null // reader full name
      },
      card: {
        object: null, // full nfc-csc lib object
        status: null, // on/off/err
      },
      error: null,
      end : null
    };

    this.data = new Observable(observer => {
      observer.next("this.nfc");

      console.log('NfcParserService', NfcParserService)
      nfc.on('reader', async reader => {
        
        // reader object
        this.nfc.reader.object = reader;

        // reader status ON
        reader.name !== null ? this.nfc.reader.status = 'on' : this.nfc.reader.status = 'off';
        // reader name
        this.nfc.reader.name = reader.name;

        console.log('reader', reader)
        observer.next(this.nfc);

        reader.on('card', async card => {
          // card object
          this.nfc.card.object = card
          console.log('card', card)
          reader.read(4, 48).then(data => {
            console.log('cardData', data)            
            let cardData = this.NfcParser.parseNdef(data);
            console.log('parsedCardData', cardData)
          })

          observer.next(this.nfc);
        });

        reader.on('end', () => {
          // reader status OFF
          this.nfc.status = 'off'
          observer.next(this.nfc);
        });

        reader.on('error', async error => {
          // reader error
          this.nfc.reader.status = 'err';
          this.nfc.reader.error = error;
          observer.next(this.nfc);
        });

    });

    // return function () {
    //   console.log('disposed');
    // }

    });
  }
  
}
