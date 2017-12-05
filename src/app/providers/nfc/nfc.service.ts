import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NFC } from 'nfc-pcsc';
import { OnInit } from '@angular/core';
import { NfcParserService } from './nfcparser.service';

@Injectable()
export class NfcService {
  nfc: any;
  data: Observable<{}>;

  constructor(public NfcParser: NfcParserService) {
    console.log('NfcService loaded');
  }

  init() {
  /**
    {
      pin: "U2FsdGVkX19Buxk/sTWmdXFrfCgNsfmxJOqTvoJxW4kHS7+phRSqIegFb//zXmREjZLsaEK2RqIpBMyihlUuA48V6FQGvLyCPz948b5zv3Y=",
      securityTransportCompany: "Masdria",
      bankName: "The Saudi British Bank",
      appVersion: "1.0.0"
    }
{pin: "U2FsdGVkX19Buxk/sTWmdXFrfCgNsfmxJOqTvoJxW4kHS7+phRSqIegFb//zXmREjZLsaEK2RqIpBMyihlUuA48V6FQGvLyCPz948b5zv3Y=",securityTransportCompany: "Masdria",bankName: "The Saudi British Bank",appVersion: "1.0.0"}
  */
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
      try {
        
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
          console.log('card', card);

            // reader.read(4, 48).then(data => {
            //   console.log('cardData', data)            
            //   let cardData = this.NfcParser.parseNdef(data);
            //   console.log('parsedCardData', cardData)
            // })
            try {
              const data = await reader.read(4, 48); // await reader.read(4, 16, 16); for Mifare Classic cards
              console.log('cardData', data)            
              const cardData = this.NfcParser.parseNdef(data);
              console.log('parsedCardData', cardData)
            } catch (error) {
              console.error(`error when reading data`, { reader: reader.name, error });
              // card reading error
              this.nfc.error = { type: 'card reading', error: error }
            }
              
          observer.next(this.nfc);
        });

        reader.on('end', () => {
          // reader status OFF
          this.nfc.status = 'off'
          observer.next(this.nfc);
        });

        reader.on('error', async error => {
          console.error('Something wrong happened:', error)
          // reader error
          this.nfc.reader.status = 'err';
          this.nfc.reader.error = error;
          this.nfc.error = { type: 'reader', error: error }
          observer.next(this.nfc);
        });

    });
  } catch (e) {
    console.log('eeeeeeeeee', e);         
 }

    // return function () {
    //   console.log('disposed');
    // }

    });
  }
  
}
