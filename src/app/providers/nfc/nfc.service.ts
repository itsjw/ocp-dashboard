import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NFC } from 'nfc-pcsc';
import { OnInit } from '@angular/core';
import { NfcParserService } from './nfcparser.service';
import { NdefFormaterService } from './ndefformater.service'

@Injectable()
export class NfcService {
  nfcStatus$: { description: string; action: { cardRead: boolean; cardWrite: boolean; readerInit: boolean; global: boolean; }; cardUid: () => any; cardType: () => any; success: boolean; error: boolean; errorType: any; errorDesc: any; readResult: any; writeResult: any; };
  readSize: number;
  action: any;
  valueToWrite: any;
  readOrWriteMode: any;
  nfc: any;
  data: Observable<{}>;
  noReaderFoundTimeoutDuration: number;

  constructor(public NfcParser: NfcParserService, public ndefFormater: NdefFormaterService) {
    console.log('NfcService loaded');
  }

  init() {

    // NFC Library
    const nfc = new NFC();

    // observable object
    this.nfc = {
      description: 'nfcGlobalStatus',
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

    /**
     * Splitted object
     */
    this.action = {
      cardHasBeenRead: false,
      cardHasBeenWritten: false,
      success: null,
      error: null,
      cardUid: null,
      cardType: null,
      readResult: {
        rawData: null,
        ndefMessage: null,
        utf8: null,
        hex: null
      },
      writeResult: {}
    }

    this.readSize = 700;
    const noReaderFoundTimeoutDuration = 10000; // 10 seconds

    this.data = new Observable(observer => {
      console.log('INFO:', 'nfc object observable initialized');

      this.noReaderFoundTimeout(observer, noReaderFoundTimeoutDuration);

      try {

      /**
       * Reader async/await
       */
      nfc.on('reader', async reader => {

        this.initReader(reader, observer);

        /**
         * Card async/await
         */
        reader.on('card', async card => {
        // console.log('READORWRITE', this.readOrWriteMode)

          // card object
          this.nfc.card.object = card
          // console.log('card', card);

            /**
             * Read Mode
             */
            if (this.readOrWriteMode === 'read') {


              try {
                /**
                 *  @TODO:
                 *  - Check the record length by reading block 4
                 *  - Once we know the length, set the reader method to read only what we need
                 */

                const rawData = await reader.read(4, this.readSize); // BlockSize, length to read
                console.log('cardData', rawData);

                const parsedData = this.NfcParser.parseNdef(rawData);
                // console.log('parsedCardData', parsedData);

                this.action = {
                  description: 'action',
                  cardHasBeenRead: true,
                  cardHasBeenWritten: false,
                  cardUid: card.uid,
                  cardType: card.type,
                  success: true,
                  error: false,
                  readResult: {
                    rawData: parsedData.rawData,
                    ndefMessage: parsedData.ndefMessage,
                    utf8: parsedData.utf8,
                    hex: parsedData.hex
                  },
                  writeResult: null
                }
                observer.next(this.action);

              } catch (error) {
                // card reading error
                this.errorHandler('EReaderRead', error, reader, card, observer);
              }
            }

            /**
             * Write Mode
             */
            if (this.readOrWriteMode === 'write') {
              try {
                if (this.valueToWrite) {
                  const valueToWrite = this.ndefFormater.getBufferForText(JSON.stringify(this.valueToWrite), 'en');
                  const writeStatus = await reader.write(4, valueToWrite); // starts writing in block 4, continues to 5 and 6 in order to write the whole record
                  console.log('writeStatus', writeStatus);

                  this.nfc.card.status = 'written';
                } else {
                  throw new Error ('value to write is not defined!')
                }

              } catch (error) {
                // card writing error
                this.errorHandler('EReaderWrite', error, reader, card, observer);
              }
            }

          observer.next(this.nfc);
        });

        reader.on('end', () => {
          // reader status OFF
          this.nfc.status = 'off'
          observer.next(this.nfc);
        });

        reader.on('error', async error => {
          // reader error
          this.errorHandler('EReader', error, reader, null, observer);
        });

    });
  } catch (error) {
    // global error
    this.errorHandler('Eglobal', error, null, null, observer);
 }

    // return function () {
    //   console.log('disposed');
    // }

    });
  }

  setMode(mode) {
    this.readOrWriteMode = mode;
  }
  setValueToWrite(value) {
    this.valueToWrite = value;
  }

  initReader(reader, observer) {
    // reader object
    this.nfc.reader.object = reader;

    // reader status ON/OFF/ERR
    reader.name !== null ? this.nfc.reader.status = 'on' : this.nfc.reader.status = 'off';

    // reader name
    this.nfc.reader.name = reader.name;

    observer.next(this.nfc);
  }
  errorHandler(errorType, error, reader, card, observer) {
    console.error('(' + errorType + ') Something wrong happened in nfc.service:', error);

    // Default object for any error
    // We need to add:
    //    - action: read, write, init...
    //    - readResult in case it's a EReaderRead Error
    this.nfcStatus$ = {
      description: 'error',
      action: {
        cardRead: false,
        cardWrite: false,
        readerInit: false,
        global: false
      },
      cardUid: function() { if (typeof card !== 'undefined') { return card.uid }},
      cardType:  function() { if (typeof card !== 'undefined') { return card.type }},
      success: false,
      error: true,
      errorType: errorType,
      errorDesc: error,
      readResult: {
        rawData: null,
        ndefMessage: null,
        utf8: null,
        hex: null
      },
      writeResult: null
    }

    switch (errorType) {

      // it's a read card error
      case 'EReaderRead':
        // We were trying to read the card while this error happened
        this.nfcStatus$.action.cardRead = true;

        // We try to read the card one more time
        reader.read(4, this.readSize).then(
          readResult => {

            this.nfcStatus$.readResult = {
              rawData: readResult,
              utf8: readResult.toString('utf8'),
              hex: readResult.toString('hex')
            };

            if (error !== 'Not a WELL_KNOWN text record') {
              // parse result to get data as raw, ndef, utf8 & hex.
              const parsedData = this.NfcParser.parseNdef(readResult);
              this.nfcStatus$.readResult.ndefMessage = parsedData.ndefMessage;
            }

            // if we succeed we pass the action obj to the observer containing the readResult
            observer.next(this.nfcStatus$);
        },
          err => {
            // if it fails, we pass the status without readResult
            observer.next(this.nfcStatus$);
        })
      break;

      // It's a write card error
      case 'EReaderWrite':
        this.nfcStatus$.action.cardWrite = true;
        observer.next(this.nfcStatus$);
      break;

      // It's a reader error
      case 'EReader':
        this.nfcStatus$.action.readerInit = true;
        observer.next(this.nfcStatus$);
      break;

      // It's a reader error
      case 'Eglobal':
        this.nfcStatus$.action.global = true;
        observer.next(this.nfcStatus$);
      break;


      default:
        // observer.next(this.nfcStatus$);
      break;

    }

  }

  noReaderFoundTimeout(observer, noReaderFoundTimeoutDuration) {
    setTimeout(() => {
      this.nfc.status = 'noReaderFound';
      observer.next(this.nfc);
    }, noReaderFoundTimeoutDuration)
  }
}
