import { environment } from './../../../environments/index';
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
import ndefParser from 'ndef-parser';
import nfcCard from 'nfccard-tool';
import { NgSwitchCase } from '@angular/common/src/directives/ng_switch';

// import { nfcCardService } from 'app/providers/nfc/nfccard-tool.service';

@Injectable()
export class NfcService {
  NDEFMessageToWrite: any;
  readOrWriteMode: any;
  reader: any;
  card: any;
  aCardHasBeenWritten: any;
  aCardHasBeenRead: any;
  readerEvent: any;

  // component vars
  DEBUG = environment.debug;
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
  aCardCouldntBeRead$ = new Subject();

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
    if (this.DEBUG) { console.log(`(nfcS) - Processing card (uid:`, card.uid + ')' ); }

    console.log(this.readOrWriteMode)
    switch (this.readOrWriteMode) {
      case 'read':
        this.readAction();
        break;
      case 'write':
        this.writeAction(this.NDEFMessageToWrite);
        break;

      default:
        throw new Error('No mode set: Not sure if I\'m suppose to read or write here')
    }

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
    onCard: (action, blockStart?, length?, data?) => {
      switch (action) {
        case 'READ_CARD_MESSAGE':
          return this.readCard(4, length);

        case 'READ_CARD_HEADER':
          return this.readCard(0, 20);

        case 'WRITE_CARD_MESSAGE':
          return this.writeCard(blockStart, data);

        default:
          break;
      }
    }
  }

  readAction() {

    // 1 -Read the header
    this.actionManager.onCard('READ_CARD_HEADER').then(rawCardHeader => {
      console.log('(nfcS) -', 'rawHeader', rawCardHeader);

      const tag = nfcCard.parseInfo(rawCardHeader);
      console.log('(nfcS) - tag info:', tag);

      // There might be a NDEF message and we are able to read the tag
      if (nfcCard.isFormatedAsNDEF() && nfcCard.hasReadPermissions() && nfcCard.hasNDEFMessage()) {

        const messageLength = nfcCard.getNDEFMessageLengthToRead();

        // Read the ndef message (from block 4, and pass the appropriate length to read)
        this.actionManager.onCard('READ_CARD_MESSAGE', 4, messageLength).then(NDEFRawMessage => {

          try {
            // Parse the buffer as a NDEF raw message
            const NDEFMessage = nfcCard.parseNDEF(NDEFRawMessage);

            // Next the result to the component
            this.aCardHasBeenRead$.next(NDEFMessage);
          } catch (e) {
            // Next the Error to the component
            this.aCardCouldntBeRead$.next(e);
          }

        });

      } else {
        this.aCardCouldntBeRead$.next('No ndef message found.');
        console.log('Could not parse anything from this tag: \n The tag is either empty, locked, has a wrong NDEF format or is unreadable.')
      }
    });

  }

  writeAction(NDEFMessage) {

    // 1 -Read the header
    this.actionManager.onCard('READ_CARD_HEADER').then(rawCardHeader => {
    console.log('(nfcS) -', 'rawHeader', rawCardHeader);

    // instanciate the lib by parsing the header (allows us to use lazy methods hasWritePermissions & hasReadPermissions)
    const tag = nfcCard.parseInfo(rawCardHeader);

    // We can read and write data area
    if (nfcCard.hasWritePermissions() && nfcCard.hasReadPermissions()) {

      // Prepare the buffer to write on the card
      const rawDataToWrite = nfcCard.prepareBytesToWrite(NDEFMessage);

      // Read the ndef message (from block 4, and pass the appropriate length to read)
      this.actionManager.onCard('WRITE_CARD_MESSAGE', 4, null, rawDataToWrite.preparedData).then(result => {

// Success !
if (result) {
  console.log('Data have been written successfully.')
}

        // try {
        //   // Parse the buffer as a NDEF raw message
        //   const NDEFMessage = nfcCard.parseNDEF(NDEFRawMessage);

        //   // Next the result to the component
        //   this.aCardHasBeenRead$.next(NDEFMessage);
        // } catch (e) {
        //   // Next the Error to the component
        //   this.aCardCouldntBeRead$.next(e);
        // }

      });

    } else {
      this.aCardCouldntBeRead$.next('No ndef message found.');
      console.log('Could not parse anything from this tag: \n The tag is either empty, locked, has a wrong NDEF format or is unreadable.')
    }
  });
  }
  constructor(
    public NfcParser: NfcParserService,
    public ndefFormater: NdefFormaterService,
    // public nfcCard: nfcCardService
  ) {
    console.log('(nfcS) - NfcService loaded');
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
    // if (this.DEBUG) { console.log(`data read - (`, currentAction, ')', { reader: this.reader.name, data }); }
    return await this.reader.read(blockNumber, length); // await reader.write(4, data, 16); for Mifare Classic cards
  }

  /**
   * @method writeCard
   * @description write a card using legacy args
   *    see: https://github.com/pokusew/nfc-pcsc/blob/master/src/Reader.js#L557
   *
   * @param {any} blockNumber
   * @param {any} data
   * @param {number} [blockSize = 4]
   * @memberof NfcReaderService
   */
  async writeCard(blockNumber, data, blockSize = 4) {
    // // const a = Buffer.from('03569101155402656e49276d20612074657874206d65737361676511011055046769746875622e636f6d2f736f6d71540f17616e64726f69642e636f6d3a706b6768747470733a2f2f6769746875622e636f6d2f736f6d71fe000000', 'hex')
    // const a = Buffer.from('0000', 'hex')

    // const writeData = await this.reader.write(blockNumber, a); // await reader.write(4, data, 16); for Mifare Classic cards
    // if (this.DEBUG) { console.log(`(nfcS) - data written`, { reader: this.reader.name, writeData }); }
    // const a = Buffer.from('03569101155402656e49276d20612074657874206d65737361676511011055046769746875622e636f6d2f736f6d71540f17616e64726f69642e636f6d3a706b6768747470733a2f2f6769746875622e636f6d2f736f6d71fe000000', 'hex')
    const a = new Buffer(4)
    console.log(a)
    console.log(Buffer.isBuffer(new Buffer(4)))


    // Write the buffer on the card starting at block 4
    const preparationWrite = await this.reader.write(4, a);
  }

  setMode(mode) {
    this.readOrWriteMode = mode;
  }

  setNDEFMessageToWrite(NDEFMessage) {
    this.NDEFMessageToWrite = NDEFMessage;
  }
}


