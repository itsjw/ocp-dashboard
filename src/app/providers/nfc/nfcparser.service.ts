import { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc';

import ndef from '@taptrack/ndef'; // ndef formater
import { NfcService } from 'app/providers/nfc/nfc.service';
// import { endianness } from 'endianness'; // MSB first converter
import { Injectable } from '@angular/core';

@Injectable()
export class NfcParserService {
  
  parseNdef(data) {
    const DEBUG = false;

    if (DEBUG) { console.log('Parsing data:', data) }
    const isLittleEndian = ((new Uint32Array((new Uint8Array([1, 2, 3, 4])).buffer))[0] === 0x04030201);
  

    const payload = data.readInt16BE();
    
    /**
     * @description
     * if our system is LSB first, we swap each Bytes every 4 Bytes
     * 
     * @example
     * -Before swapping
     * <Buffer 01 91 1b 03 66 02 54 08 6f 62 61 72 01 51 65 76 66 02 54 0b 63 6e 61 72 72 74 73 65 00 00 fe 79 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
     * 
     * -After swapping
     * <Buffer 03 1b 91 01 08 54 02 66 72 61 62 6f 76 65 51 01 0b 54 02 66 72 61 6e 63 65 73 74 72 79 fe 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
     * recordContents { language: 'fr', content: 'above' }
     * recordContents { language: 'fr', content: 'ancestry' }
     * 
     */
    // no need to swap ?
    // if(isLittleEndian) {
    //   var data = endianness(data, 4); // Our block is 4 Bytes
    // }
    // console.log('Swapped Data:', data)

    // bufferTOWRITE: <Buffer d1 01 1b 54 02 66 72 32 34 63 68 61 72 73 30 31 32 33 34 35 36 37 38 39 30 31 32 33 34 35 36>
    // bufferWASREAD: <Buffer 03 1f d1 01 1b 54 02 66 72 32 34 63 68 61 72 73 30 31 32 33 34 35 36 37 38 39 30 31 32 33 34 35 36 fe 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
    // recordContents { language: 'fr', content: '24chars01234567890123456' }


    // let message = ndef.Message.fromBytes(data);
    // console.log(message.toByteArray());
    // console.log(message.toByteArray().length);
    // let parsedRecords = message.getRecords();
    // console.log("records", parsedRecords)


      if (DEBUG) { console.log(`data read hex`, data.toString('hex')); }
			if (DEBUG) { console.log(`data read utf8`, data.toString('utf8')); }
      // var b = new Buffer("03dbd101d75402656e7b2270696e223a22553246736447566b5831394275786b2f7354576d645846726643674e73666d784a4f7154766f4a7857346b4853372b706852537149656746622f2f7a586d52456a5a4c7361454b3252714970424d7969686c55754134385636465147764c7943507a39343862357a7633593d222c2273656375726974795472616e73706f7274436f6d70616e79223a224d617364726961222c2262616e6b4e616d65223a2254686520536175646920427269746973682042616e6b222c2261707056657273696f6e223a22312e302e30227dfe", "hex")
      // var b = new Buffer("030bd101075402656e61626364fe", "hex")
      
      // var message = ndef.Message.fromBytes(b);
      const message = ndef.Message.fromBytes(data); // get message
      const records = message.getRecords(); // get records
      // const recordContent = ndef.Utils.resolveTextRecord(records[0]); // parse records pretending it's 'Well-Known Text' records

      const ndefMessage = [];
      records.forEach(record => {
        const recordContent = ndef.Utils.resolveTextRecord(record);
        ndefMessage.push(recordContent)
        if (DEBUG) { console.log('recordContent:', recordContent) }
      });
      
      const ndefParsedMessage = {
        rawData : data,
        ndefMessage: ndefMessage,
        utf8: data.toString('utf8'),
        hex: data.toString('hex')
      }
    
    return ndefParsedMessage;
  }
}
