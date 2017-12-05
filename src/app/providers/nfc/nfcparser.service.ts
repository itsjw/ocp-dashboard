import { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc';

import ndef from '@taptrack/ndef'; // ndef formater
import { NfcService } from 'app/providers/nfc/nfc.service';
// import { endianness } from 'endianness'; // MSB first converter
import { Injectable } from '@angular/core';

@Injectable()
export class NfcParserService {
  
  parseNdef(data) {
    console.log('Parsing data:', data)
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
    
    console.log('Swapped Data:', data)
    // bufferTOWRITE: <Buffer d1 01 1b 54 02 66 72 32 34 63 68 61 72 73 30 31 32 33 34 35 36 37 38 39 30 31 32 33 34 35 36>
    // bufferWASREAD: <Buffer 03 1f d1 01 1b 54 02 66 72 32 34 63 68 61 72 73 30 31 32 33 34 35 36 37 38 39 30 31 32 33 34 35 36 fe 00 00 00 00 00 00 00 00 00 00 00 00 00 00>
    // recordContents { language: 'fr', content: '24chars01234567890123456' }
    let message = ndef.Message.fromBytes(data);
    console.log(message.toByteArray());
    console.log(message.toByteArray().length);
    let parsedRecords = message.getRecords();
    console.log("records", parsedRecords)

    parsedRecords.forEach(parsedRecord => {
      let recordContents = ndef.Utils.resolveTextRecord(parsedRecord);
      console.log('recordContents', recordContents)
    });
    

    return payload;
  }
}
