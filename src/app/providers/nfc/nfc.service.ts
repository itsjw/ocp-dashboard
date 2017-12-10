import { Observable, ObservableInput } from 'rxjs/Observable';

import * as Rx from 'rxjs';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/operator/switchMap';
import { Injectable } from '@angular/core';
import { NFC } from 'nfc-pcsc';
import { OnInit } from '@angular/core';
import { NfcParserService } from './nfcparser.service';
import { NdefFormaterService } from './ndefformater.service'
import { EventEmitter } from 'events';
import { Subject } from 'rxjs';

@Injectable()
export class NfcService implements OnInit {
  valueToWrite: any;
  readOrWriteMode: any;
  reader: any;
  card: any;
  aCardHasBeenWritten: any;
  aCardHasBeenRead: any;
  readerEvent: any;

  // component vars
  DEBUG = true;
  currentAction = 'READ_CARD_MESSAGE';

  nfcLib = new NFC();


  nfc = {
    reader: {
      name: null,
      status: {
        ON: null,
        OFF: null,
        LOADING: null
      },
      // object: null // useless - map & pass only what we need ?
    },
    card: {
      uid: null,
      status: {
        ON: null,
        OFF: null,
        PROCESSING: null
      },
    },
    action: {
      CARD_READ: null,
      CARD_WRITE: null,
      // readerInit: false,
      // global: false
      status: {
        SUCCESS: null,
        ERROR: null,
        COMPLETE: null
      },
      READ_RESULT: {
          rawData: null,
          ndefMessage: null,
          utf8: null,
          hex: null
      },
      WRITE_RESULT: {
        valueWritten: null,
        valueWrittenAsBuffer: null,
        writeStatus: null
      },
    }
  }


  aCardHasBeenRead$ = new Subject();
  aCardHasBeenWritten$ = new Subject();


  /**
   * Source Observable
   * 'reader' event is our source
   * It's the base event we would nest childs events in if we were using .on eventEmitter syntax
   *
   * eg.
   *      nfc.on('reader', async reader => {
   *        reader.on('card', async card => {
   *          ...reader.write(blockNumber, length)...
   */
  onReader$ = Rx.Observable.fromEvent(this.nfcLib, 'reader')

  /**
   * Events as Observables
   * We grab all the childs event of reader here and switchMap them to observables
   */
  onCard$ = this.onReader$.switchMap(readerEvent => Observable.fromEvent(readerEvent, 'card'));
  onCardOff$ = this.onReader$.switchMap(readerEvent => Observable.fromEvent(readerEvent, 'card.off'));
  onReaderEnd$ = this.onReader$.switchMap(readerEvent => Observable.fromEvent(readerEvent, 'end'));
  onReaderStatus$ = this.onReader$.switchMap(readerEvent => Observable.fromEvent(readerEvent, 'status'));
  onError$ = this.onReader$.switchMap(readerEvent => Observable.fromEvent(readerEvent, 'error'));


  /**
   * Reader and card subs.
   * Used in-class for inner data processing
   */

  // Reader - when we find a new reader
  onReader = this.onReader$.subscribe(reader => {
    // Declare the reader object for our class
    this.reader = reader;
    this.onCard$ = Observable.fromEvent(this.reader, 'card')
  });

  // card - when we find a card
  onCard = this.onCard$.subscribe(async card => {
    if (this.DEBUG) { console.info(`Processing card (uid:`, card.uid + ')' ); }
    const action = this.actionManager.onCard();
    action.then(cardData => {
      console.log('cardData', cardData)
      // ADD PROCESS HERE ?
      this.aCardHasBeenRead$.next(cardData)
    });
  });


  /**
   * @namespace actionManager
   * @description a dispatcher used to know what we are supposed to do when we find a card
   *
   * @method onCard
   * @description What to do when we find a card ?
   *    - Check what's the current action and return the approriate method
   * @returns {function} according to the @param currentAction
   */
  actionManager = {
    onCard: () => {
      switch (this.currentAction) {
        case 'READ_CARD_MESSAGE':
          return this.readCard(4, 16);
          // break;
        case 'READ_CARD_CONFIG':
          return this.readCard(4, 16);
          // break;

        default:
          break;
      }
    }
  }

  constructor(public NfcParser: NfcParserService, public ndefFormater: NdefFormaterService) {
    console.log('NfcService loaded');
  }

  /**
   * @method readCard
   * @description read a card using legacy args
   *    - see: https://github.com/pokusew/nfc-pcsc/blob/master/src/Reader.js#L486
   *
   * @param {*} blockNumber
   * @param {*} length
   * @param {*} blockSize
   * @param {*} packetSize
   */
  async readCard(blockNumber, length, blockSize = 4, packetSize = 16) {
    // var data = await this.reader.read(blockNumber, length); // await reader.read(4, 16, 16); for Mifare Classic cards
    // if (this.DEBUG) { console.info(`data read - (`, currentAction, ')', { reader: this.reader.name, data }); }
    return await this.reader.read(blockNumber, length); // await reader.write(4, data, 16); for Mifare Classic cards
  }

  /**
   * @method writeCard
   * @description write a card using legacy args
   *    see: https://github.com/pokusew/nfc-pcsc/blob/master/src/Reader.js#L557
   *
   * @param {any} blockNumber
   * @param {any} data
   * @param {number} [blockSize=4]
   * @memberof NfcReaderService
   */
  async writeCard(blockNumber, data, blockSize = 4) {
    const writeData = await this.reader.write(blockNumber, length); // await reader.write(4, data, 16); for Mifare Classic cards
    if (this.DEBUG) { console.info(`data written`, { reader: this.reader.name, writeData }); }
  }

  setMode(mode) {
    this.readOrWriteMode = mode;
  }

  setValueToWrite(value) {
    this.valueToWrite = value;
  }
}


