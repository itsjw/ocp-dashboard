import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { NFC } from 'nfc-pcsc';
import { OnInit } from '@angular/core';
import { NfcParserService } from './nfcparser.service';
import { NdefFormaterService } from './ndefformater.service'

@Injectable()
export class NfcService {
  nfcStatusInit$: any;
  nfcStatus$: any;
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

    // Main observable init object
    this.nfcStatusInit$ = {
      description: 'action', // action, error, init
      action: {
        cardRead: false, // 
        cardWrite: false,
        readerInit: false,
        global: false
      },
      // cardUid: function() { if (typeof card !== 'undefined') { return card.uid }},
      // cardType:  function() { if (typeof card !== 'undefined') { return card.type }},
      success: false, //
      error: false, //
      errorType: null,
      errorDesc: null,
      readResult: {
        rawData: null,
        ndefMessage: null,
        utf8: null,
        hex: null
      },
      writeResult: null,
      globalStatus: {
        reader: {
          object: null, // full nfc-csc lib object
          status: 'loading', // on/off/err/loading(def)
          name: null // reader full name shorthand
        },
        card: {
          object: null, // full nfc-csc lib object
          status: null, // on/off/err
        }
      }
    }

    this.readSize = 700;
    const noReaderFoundTimeoutDuration = 10000; // 10 seconds


    this.data = new Observable(observer => {
      console.log('INFO:', 'nfc object observable initialized');

      // Push default nfcStatus obj to subscriber to avoid undefined props in any cases.
      observer.next(this.nfcStatusInit$);

      // this.noReaderFoundTimeout(observer, noReaderFoundTimeoutDuration);

      // try {

      /**
       * Reader async/await
       */
      nfc.on('reader', async reader => {

        this.initReader(reader, observer);

        /**
         * Card async/await
         */
        reader.on('card', async card => {
          
          // card object
          this.nfcStatus$.globalStatus.card.object = card        

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
                // console.log('INFO (serv): Found a new card and read it.');

                const parsedData = this.NfcParser.parseNdef(rawData);
                // console.log('parsedCardData', parsedData);
                
                this.nfcStatus$ = {
                  description: 'action', //
                  action: {
                    cardRead: true, // 
                    cardWrite: false,
                    readerInit: false,
                    global: false
                  },
                  // cardUid: function() { if (typeof card !== 'undefined') { return card.uid }},
                  // cardType:  function() { if (typeof card !== 'undefined') { return card.type }},
                  cardUid: card.uid,
                  cardType:  card.type,
                  success: true, //
                  error: false, //
                  errorType: null,
                  errorDesc: null,
                  readResult: {
                    rawData: parsedData.rawData,
                    ndefMessage: parsedData.ndefMessage,
                    utf8: parsedData.utf8,
                    hex: parsedData.hex
                  },
                  writeResult: null,
                  globalStatus: this.nfcStatusInit$.globalStatus
                }

                observer.next(this.nfcStatus$);

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
                  console.log(Buffer.concat)
                  console.log('this.valueToWrite', this.valueToWrite)

                  const valueToWrite = this.ndefFormater.getBufferForText('1234', 'en');
                  // const valueToWrite = this.ndefFormater.getBufferForText(JSON.stringify(this.valueToWrite), 'en');
                  console.log('valueToWrite', valueToWrite)
                  const writeStatus = await reader.write(4, valueToWrite); // starts writing in block 4, continues to 5 and 6 in order to write the whole record
                  console.log('writeStatus', writeStatus);

                } else {
                  throw new Error ('value to write is not defined!')
                }

              } catch (error) {
                // card writing error
                this.errorHandler('EReaderWrite', error, reader, card, observer);
              }
            }

          // observer.next(this.nfc);
        });

        reader.on('end', () => {
          // reader status OFF
          this.nfcStatus$.globalStatus.reader.status = 'off'
          observer.next(this.nfcStatus$);
        });

        reader.on('error', async error => {
          // reader error
          this.errorHandler('EReader', error, reader, null, observer);
        });

      });
  //   } catch (error) {
  //     // global error
  //     this.errorHandler('Eglobal', error, null, null, observer);
  // }

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


  /**
   * @method initReader
   * @description Feeds init obj with reader object and pass it to subscriber
   *    On the component side, it allows us to know a reader is available, and show the according template to the user
   * 
   * @param {any} reader obj
   * @param {any} observer obj
   * @memberof NfcService
   */
  initReader(reader, observer) {

    // describe obj as "init"
    this.nfcStatusInit$.description = 'init';
    
    // reader object
    this.nfcStatusInit$.globalStatus.reader.object = reader;

    // reader status ON/OFF/ERR
    reader.name !== null ? this.nfcStatusInit$.globalStatus.reader.status = 'on' : this.nfcStatusInit$.globalStatus.reader.status = 'off';

    // reader name
    this.nfcStatusInit$.globalStatus.reader.name = reader.name;

    observer.next(this.nfcStatusInit$);
    
    // init obj becomes our main obj as soon as init is done
    this.nfcStatus$ = this.nfcStatusInit$;
  }


  /**
   * @method errorHandler
   * @description Handles any error caught by reader.reader & reader.write
   * 
   * @param {any} errorType switch/case error list 'EReaderRead, EReaderWrite, EReader, EGlobal'
   * @param {any} error any error throwed by nfc-pcsc lib: 'eg. Not a WELL_KNOWN text record, Could not get uid...'
   * @param {any} reader reader obj
   * @param {any} card card obj
   * @param {any} observer observer obj
   * @memberof NfcService
   */
  errorHandler(errorType, error, reader, card, observer) {
    console.error('INFO (serv):  An error occurred (' + errorType + ')', error);

    // @TODO: Getter, Setter
    // const cardUid = function() { if (typeof card !== 'undefined') { return card.uid }};
    // const cardType = function() { if (typeof card !== 'undefined') { return card.type }};
    // const cardUid = () => typeof card !== 'undefined' ? card.uid : null;
    // const cardType = () => typeof card !== 'undefined' ? card.type : null;

     
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
      // @TODO: Getter, Setter
      // cardUid: card.uid,
      // cardType: card.type,
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
      writeResult: null,
      globalStatus: this.nfcStatusInit$.globalStatus
    }
    

    switch (errorType) {

      // it's a read card error
      case 'EReaderRead':
      console.log('EReaderRead exception handler')
        // We were trying to read the card while this error happened
        this.nfcStatus$.action.cardRead = true;

        // We try to read the card one more time
        reader.read(4, this.readSize).then(
          readResult => {
            if (error === 'Not a WELL_KNOWN text record') {
              this.nfcStatus$.readResult = {
                rawData: readResult,
                utf8: readResult.toString('utf8'),
                hex: readResult.toString('hex')
              };
              this.nfcStatus$.cardUid = card.uid;
              this.nfcStatus$.cardType = card.type;

            } else {
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
        console.log('INFO (serv):', 'Caught an unlisted error, transmitting it to event handler.' )
        observer.next(this.nfcStatus$);
      break;

    }

  }

  noReaderFoundTimeout(observer, noReaderFoundTimeoutDuration) {
    setTimeout(() => {
      this.nfcStatus$.globalStatus.reader.status = 'noReaderFound';
      observer.next(this.nfcStatus$);
    }, noReaderFoundTimeoutDuration)
  }
}
