import { Injectable } from '@angular/core';
import ndefTool from '@taptrack/ndef';
import isBuffer from 'is-buffer';

@Injectable()
export class NdefFormaterService {

  constructor() {
    console.log('NdefFormater loaded');
    console.log(ndefTool)
  }

  getBufferForText(payloadText, language, blockSize: number = 4) { // blockSize = 4 (ntag 21x)
    console.log('GETBUFFERFORTEXT', payloadText, language)
    let textRecord = ndefTool.Utils.createTextRecord(payloadText, language); 
    console.log(textRecord)
    
    let message = new ndefTool.Message([textRecord]);
    // console.log('MESSAGE:', message, Buffer.from(message), message.toString())

    let messageAsByteArray = message.toByteArray();
    console.log(message)
    console.log(messageAsByteArray)
    
    let hexaPayloadLength = '0x'+`${(messageAsByteArray.length).toString(16)}`
    
    console.log('NDEFUtil:', hexaPayloadLength)
    console.log('NDEFUtil:', this.toBuffer(messageAsByteArray))
    
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
    const header = Buffer.from([ // Header (Message Begin + PayloadLength)
      0x03, hexaPayloadLength
    ]);

    const ME = Buffer.from([ // Message End
    0xFE
    ]);
    
    const messageBuf = this.toBuffer(messageAsByteArray);

    console.log([header, messageBuf, ME])
    console.log(Buffer.isBuffer(header))
    console.log(Buffer.isBuffer(messageBuf))
    console.log(Buffer.isBuffer(ME))

    var totalLength = header.length + messageBuf.length + ME.length;
    console.log(totalLength)
    var concatBuffer = Buffer.concat([header, messageBuf, ME], totalLength);
    console.log(concatBuffer)
    console.log(concatBuffer.length)
    
    // const finalByteArray = this.fillBuffer(concatBuffer, 4) // 4 Bytes blockSize
    if (concatBuffer.length % blockSize !== 0) { // we need to writes blocks (eg. ntag21x = 4 Bytes) - we fill with 0x00
      while (concatBuffer.length % blockSize !== 0) {
        var filler = Buffer.from([
          0x00
        ]);
        var totalLength = concatBuffer.length + filler.length;
        var concatBuffer = Buffer.concat([concatBuffer, filler], totalLength);
      }
    }
    console.log('NDEFUtil:', concatBuffer, "(concat)");
    // console.log('NDEFUtil:', finalByteArray, '(concat)');
  
    const buffer = this.toBuffer(concatBuffer);
    
    // console.log('NDEFUtil:', buffer, '(buffer)');
  
  
    // let reversedBuffer = toggleEndianness(buffer, 32);
    
    // console.log('NDEFUtil:', reversedBuffer, '(reversedBuffer)');
  
    // return reversedBuffer;
    console.log('ISBUFFER', Buffer.isBuffer(buffer));
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
  toArrayBuffer(buffer) {
    const ab = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(ab);
    for (let i = 0; i < buffer.length; ++i) {
        view[i] = buffer[i];
    }
    return ab;
}
  // fillBuffer(byteArray, blockSize: number = 4) {
  //    // we need to writes 4 Bytes blocks (eg. ntag21x = 4 Bytes) - we fill our buffer with 0x00
  //    if (byteArray.length % blockSize !== 0) {
  //     while (byteArray.length % blockSize !== 0) {
  //       const filler = Buffer.from([
  //         0x00
  //       ]);
  //       const totalLength = byteArray.length + filler.length;
  //       var finalByteArray = Buffer.concat([byteArray, filler], totalLength);
  //     }
  //   }
  //   return finalByteArray;
  // }
  fillBuffer(byteArray, blockSize: number = 4) {
     // we need to writes 4 Bytes blocks (eg. ntag21x = 4 Bytes) - we fill our buffer with 0x00
     if (byteArray.length % blockSize !== 0) { // we need to writes blocks (eg. ntag21x = 4 Bytes) - we fill with 0x00
      while (byteArray.length % blockSize !== 0) {
        console.log(byteArray.length % blockSize, byteArray.length, blockSize )
        console.log(blockSize)
        const filler = Buffer.from([
          0x00
        ]);
        const totalLength = byteArray.length + filler.length;
        console.log(totalLength)
        var finalBuffer = Buffer.concat([this.toBuffer(byteArray), filler], totalLength);
        console.log(finalBuffer)
        
      }
    } else {
      return finalBuffer;
    }
  }

}
