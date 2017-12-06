import { Injectable } from '@angular/core';
import { ndefTool } from '@taptrack/ndef';

@Injectable()
export class NdefFormaterService {

  constructor() {
    console.log('NdefFormater loaded');
  }

  getBufferForText(payloadText, language, blockSize: number = 4) { // blockSize = 4 (ntag 21x)
    let textRecord = ndefTool.Utils.createTextRecord(payloadText, language); 
    let message = new ndefTool.Message([textRecord]);
    let bytes = message.toByteArray();
  
    let hexaPayloadLength = '0x'+`${(bytes.length).toString(16)}`
  
    console.log('NDEFUtil:', hexaPayloadLength)
    console.log('NDEFUtil:', this.toBuffer(bytes))
    
  /** ???Doc
      04:04         0xD1   This byte is the **NDEF Record Header**, and indicates that this is
                          an NFC Forum Well Known Record (0x01 in the first 3 bits), 
                          and that this is the first and last record (MB=1, ME=1),
                          and that this is a short record (SR = 1) meaning the payload
                          length is less than or equal to 255 chars (len=one byte).
                          TNF = 0x01 (NFC Forum Well Known Type)
                          IL  = 0    (No ID present, meaning there is no ID Length or ID Field either)
                          SR  = 1    (Short Record)
                          CF  = 0    (Record is not 'chunked')
                          ME  = 1    (End of message)
                          MB  = 1    (Beginning of message)
      04:05         0x01   This byte is the **Type Length** for the Record Type Indicator
                          (see above for more information), which is 1 byte (0x55/'U' below)

      04:06         0x0D   This is the payload length (13 bytes)
      04:07         0x55   Record Type Indicator (0x55 or 'U' = URI Record) - T= Text
  */
    const header = Buffer.from([ // Header (Message Begin+ PayloadLength)
      0x03, hexaPayloadLength
    ]);

    const ME = Buffer.from([ // Message End
    0xFE
    ]);
  
    const totalLength = header.length + bytes.length + ME.length;
    const concatBuffer = Buffer.concat([header, bytes, ME], totalLength);
  
    const finalByteArray = this.fillBuffer(concatBuffer, 4) // 4 Bytes blockSize
  
    console.log('NDEFUtil:', finalByteArray, '(concat)');
  
    const buffer = this.toBuffer(finalByteArray);
    
    console.log('NDEFUtil:', buffer, '(buffer)');
  
  
    // let reversedBuffer = toggleEndianness(buffer, 32);
    
    // console.log('NDEFUtil:', reversedBuffer, '(reversedBuffer)');
  
    // return reversedBuffer;
    return buffer;
  }
  
  toBuffer(ArrayBuffer) {
    const buf = new Buffer(ArrayBuffer.byteLength);
    const view = new Uint8Array(ArrayBuffer);
    for (let i = 0; i < buf.length; ++i) {
        buf[i] = view[i];
    }
    return buf;
  }
  fillBuffer(byteArray, blockSize: number = 4) {
     // we need to writes 4 Bytes blocks (eg. ntag21x = 4 Bytes) - we fill our buffer with 0x00
     if (byteArray.length % blockSize !== 0) {
      while (byteArray.length % blockSize !== 0) {
        const filler = Buffer.from([
          0x00
        ]);
        const totalLength = byteArray.length + filler.length;
        var finalByteArray = Buffer.concat([byteArray, filler], totalLength);
      }
    }
    return finalByteArray;
  }

}
