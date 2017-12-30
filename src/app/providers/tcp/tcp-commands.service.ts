import { Injectable } from '@angular/core';
import { TCPParserService } from 'app/providers/tcp/tcp-parser.service';
import { Buffer } from 'buffer';

@Injectable()
export class TCPCommandsService {

  cc: { getClientList: { command: number[]; getCommand: () => Buffer; }; };
  nfc: { createTag: { header: number[]; end: number[]; getCommand: (args: any) => Buffer; }; confirmTag: { command: number[]; header: number[]; end: number[]; getCommand: (args: any) => Buffer; }; getTagsList: { header: number[]; end: number[]; getCommand: (args: any) => Buffer; }; getTagInfo: { header: number[]; end: number[]; getCommand: (args: any) => Buffer; }; };

  constructor(public TCPParser: TCPParserService) {

  }

  get(type) {

    // shitty structure handle
    const that = this;

    this.cc = {
      getClientList : { // transaction 60 (ascii: 6 0 hexa:0x36 0x30)
        command: [
          0x36, 0x30, // command - transaction
          0x01, 0x00, // short id (num banc)
          0x00, 0x00, 0x00, 0x00, 0x00 // long (datalength)
        ],
        getCommand: function() {
          return Buffer.from(this.command)
        }
      },

    }

    this.nfc = {

      /**
       * @name createTag
       * @description Creates a tag
       * @transaction 74
       * @param header - {any} Buffer
       *    command 74
       *    bench number - 1
       *    dataLength - datalength
       * @param payload
       *    uid 1-16
       *    /r/n
       *    cl_id 1-10
       *    /r/n
       * @returns uid, cl_id, nfc_id, pin
       */
      createTag: {
        // command: [
        //   0x37, 0x34, // command - transaction 74
        //   0x01, 0x00, // short id (num banc)
        //   0x07, 0x00, 0x00, 0x00, // long (datalength)

        //   0x31, 0x32, // uid = '12'
        //   0x0D, 0x0A,
        //   0x32,        // clid= '2'
        //   0x0D, 0x0A,
        // ],
        header: [
          0x37, 0x34, // command - transaction 74
          0x01, 0x00, // short id (num banc)
        ],
        end: [
          0x0D,
          0x0A,
        ],
        getCommand: function(args) {
          // 0= command + bench id
          // 1= length (clid length)
          // 2- args.uuId
            // 2.1 /r/n
          // 3- clid
            // 3.1 /r/n

          console.log('** transaction 74 (createTag) **')
          const clientIdHexa = that.TCPParser.utils.asciiToHexa(args.clientId); // @HACK: that=this => ugly as fuck
          const uuIdHexa = that.TCPParser.utils.asciiToHexa(args.uuId);

          // 0 - cmd + benchid
          const command = Buffer.from(this.header); // raw command

          // 1 - length
          const len = Buffer.from(['0x' + (clientIdHexa.length + 2 + uuIdHexa.length + 2).toString(16), 0x00, 0x00, 0x00]) // +2 = \r\n (0x0D, 0x0A)

          // 2 - args.uuId
          const uuId = Buffer.from(uuIdHexa);

          // 3 - clid
          const clid = Buffer.from(clientIdHexa);

          // 2.1, 3.1 /r/n
          const end = Buffer.from(this.end)

          const concatBuffer = Buffer.concat([command, len, uuId, end, clid, end], command.length + len.length + uuId.length + end.length + clid.length + end.length);


          console.log('concatBuffer', concatBuffer)

          console.log('payload length', (clientIdHexa.length + 2 + args.uuId.length + 2))
          console.log('original command', command)
          console.log('clientIdHexa to add', clientIdHexa)
          console.log('original command', Buffer.from(command))
          console.log('clientIdHexa to add', Buffer.from(clientIdHexa))

          return concatBuffer;
        }
      },


      /**
       * @name confirmTag
       * @description Confirms to server the tag write success status on the client side
       * @transaction 75
       * @param header - {any} Buffer
       *    command 75
       *    bench number - 1
       *    dataLength - datalength
       * @param payload
       *    nfc_id 1-10
       *    /r/n
       * @returns -
       */
      confirmTag: {
        command: [
          0x37, 0x35, // command - transaction 75
          0x01, 0x00, // bench id
          0x07, 0x00, 0x00, 0x00, // long (datalength)

          0x31, 0x32, // uid = '12'
          0x0D, 0x0A,
          0x32,        // clid= '2'
          0x0D, 0x0A,
        ],
        header: [
          0x37, 0x35, // command - transaction 74
          0x01, 0x00, // short id (num banc)
        ],
        end: [
          0x0D,
          0x0A,
        ],
        getCommand: function(args) {
          console.log('** transaction 75 (confirmTag) **')
          const uuIdHexa = that.TCPParser.utils.asciiToHexa(args.uuId);

          // 0 - cmd + benchid
          const command = Buffer.from(this.header); // raw command

          // 1 - length
          const len = Buffer.from(['0x' + (uuIdHexa.length + 2).toString(16), 0x00, 0x00, 0x00]) // +2 = \r\n (0x0D, 0x0A)

          // 2 - uuId
          const uuId = Buffer.from(uuIdHexa);

          // 2.1 /r/n
          const end = Buffer.from(this.end);

          const concatBuffer = Buffer.concat([command, len, uuId, end], command.length + len.length + uuId.length + end.length);


          return concatBuffer;
        }

      },


        /**
       * @name getTagList
       * @description Get the full tags list (tag wich has not been confirmed yet are excluded)
       * @transaction 76
       * @param header - {any} Buffer
       *    command 76
       *    bench number - 1
       *    dataLength - datalength
       * @param payload
       *    cl_id 1-10
       *    /r/n
       * @returns nfc_id, pin
       */
      getTagsList: {
        // command: [
        //   0x37, 0x36, // command - transaction 76
        //   0x01, 0x00, // bench id
        //   0x01, 0x00, 0x00, 0x00, // long ( clid datalength)
        //   0x32,       // clid= '2'
        // ],
        header: [
          0x37, 0x36, // command - transaction 76
          0x01, 0x00, // bench id
        ],
        end: [
          0x0D,
          0x0A,
        ],
        getCommand: function(args) {
          // 0= command + bench id
          // 1= length (clid length)
          // 2- clid

          console.log('** transaction 76 (getTagList) **')
          const clientIdHexa = that.TCPParser.utils.asciiToHexa(args.clientId);
          const position = 3; // position of the args.clientId data in payload

          // 0 - cmd + benchid
          const command = Buffer.from(this.header); // raw command

          // 1 - length
          const len = Buffer.from(['0x' + (clientIdHexa.length + 2).toString(16), 0x00, 0x00, 0x00]) // 2 = \r\n (0x0D, 0x0A)

          // 2 - clid
          const clid = Buffer.from(clientIdHexa);

          const end = Buffer.from(this.end)
          console.log(end);

          const concatBuffer = Buffer.concat([command, len, clid, end], command.length + len.length + clid.length + end.length);

          console.log('concatBuffer', concatBuffer)

          console.log('original command', command)
          console.log('clientIdHexa to add', clientIdHexa)
          console.log('original command', Buffer.from(command))
          console.log('clientIdHexa to add', Buffer.from(clientIdHexa))

          return concatBuffer;
        }
      },


        /**
       * @name getTagInfo
       * @description Get the full tags list (tag wich has not been confirmed yet are excluded)
       * @transaction 77
       * @param header - {any} Buffer
       *    command 77
       *    bench number - 1
       *    dataLength - datalength
       * @param payload
       *    nfc_id 1-10
       *    /r/n
       * @returns nfc_id, uid, pin, date_prog, cl_nom
       */
      getTagInfo: {
        // command: [
        //   0x37, 0x37, // command - transaction 77
        //   0x01, 0x00, // clid
        // ],
        header: [
          0x37, 0x36, // command - transaction 76
          0x01, 0x00, // bench id
        ],
        end: [
          0x0D,
          0x0A,
        ],
        getCommand: function(args) {
          // 0= command + bench id
          // 1= length (clid length)
          // 2- clid

          console.log('** transaction 77 (getTagInfo) **')
          const nfcIdHexa = that.TCPParser.utils.asciiToHexa(args.nfcId);
          const position = 3; // position of the args.nfcId data in payload

          // 0 - cmd + benchid
          const command = Buffer.from(this.header); // raw command

          // 1 - length
          const len = Buffer.from(['0x' + (nfcIdHexa.length + 2).toString(16), 0x00, 0x00, 0x00]) // 2 = \r\n (0x0D, 0x0A)

          // 2 - clid
          const clid = Buffer.from(nfcIdHexa);

          const end = Buffer.from(this.end)
          console.log(end);

          const concatBuffer = Buffer.concat([command, len, clid, end], command.length + len.length + clid.length + end.length);

          console.log('concatBuffer', concatBuffer)

          console.log('original command', command)
          console.log('nfcIdHexa to add', nfcIdHexa)
          console.log('original command', Buffer.from(command))
          console.log('nfcIdHexa to add', Buffer.from(nfcIdHexa))

          return concatBuffer;
        }
      }
    }
    return this[type] || null;
  }
}
