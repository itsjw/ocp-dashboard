import { Injectable } from '@angular/core';
import { Socket, createConnection } from 'net';
import { Buffer } from 'buffer';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { TCPParserService } from 'app/providers/tcp/tcp-parser.service';
import { TCPCommandsService } from 'app/providers/tcp/tcp-commands.service';

@Injectable()
export class TcpClientService {

  cc: { getClientList: { command: number[]; getCommand: () => Buffer; }; };
  nfc: { createTag: { header: number[]; end: number[]; getCommand: (args: any) => Buffer; }; confirmTag: { command: number[]; header: number[]; end: number[]; getCommand: (args: any) => Buffer; }; getTagsList: { header: number[]; end: number[]; getCommand: (args: any) => Buffer; }; getTagInfo: { header: number[]; end: number[]; getCommand: (args: any) => Buffer; }; };
  responses: any[];
  client: Socket;

  onTCPClientData$: Observable<{}>;
  onTCPClientClose$: Observable<{}>;
  onTCPClientEnd$: Observable<{}>;
  onTCPClientTimeout$: Observable<{}>;
  onTCPClientConnect$: Observable<{}>;
  onTCPClientError$: Observable<{}>;

  constructor(public TCPParser: TCPParserService, public TCPCommands: TCPCommandsService) {

    this.responses = [];

    this.cc = this.TCPCommands.get('cc')
    this.nfc = this.TCPCommands.get('nfc')

  }

  testConnection() {
    const client = new Socket();
    client.connect(1337, '127.0.0.1', null);
  }

  TCPClient(boxType, action, args?) {
    const client = new Socket();

    // client.on('timeout', () => {
    //   console.log('socket timeout');
    //   client.end();
    // });
    // client.on('end', () => {
    //   console.log('disconnected from server');
    // });
    // client.on('error', error => {
    //   console.log('An error occured:', error);
    // });

    this.onTCPClientConnect$ = Observable.fromEvent(client, 'connect')
    this.onTCPClientClose$ = Observable.fromEvent(client, 'close')
    this.onTCPClientEnd$ = Observable.fromEvent(client, 'end')
    this.onTCPClientData$ = Observable.fromEvent(client, 'data')
    this.onTCPClientTimeout$ = Observable.fromEvent(client, 'timeout')
    this.onTCPClientError$ = Observable.fromEvent(client, 'error')

    client.connect(1337, '127.0.0.1', () => {
    // client.connect(5150, '192.168.169.193', () => {

      // const rawData = Buffer.from('373501000400000034300d0a', 'hex'); // nfc.confirmTag.getCommand(40, 999) confirm (75)
      const rawData = this[boxType][action].getCommand(args);
      console.log('SENT: rawData:', rawData);
      typeof rawData !== 'undefined' ? client.write(rawData) : console.log('Something went wrong while converting data!')

    });

    return client;
  }

  createTag(uuId, clientId) {
    const client = this.TCPClient('nfc', 'createTag', { uuId: uuId, clientId: clientId });

     return client.on('data', data => {
      client.end(); // end client after server's response

      console.log('~~~~~');

      this.responses.push(data);

      console.log('RECEIVED: rawdata', data);
      console.log('RECEIVED: ascii',  Buffer.from(data).toString());

      const resArr = data.toString().replace( /\r\n/g, ' ' ).split(' ');
      resArr.splice(-1, 1);
      const finalResArr = resArr.length > 0 ? resArr : Buffer.from(data).toString();
      console.log('RECEIVED: resArr', resArr);

      const parsedRes = this.TCPParser.getParsedRes(Buffer.from(data), resArr, this.responses);
      console.log('PARSED RES: ', parsedRes);
      client.emit('tagCreated', parsedRes);
    });
  }


  getClientList() {
    console.log('getClientList')
    const TCPClient = this.TCPClient('cc', 'getClientList')

    return TCPClient.on('data', function(data) {
      TCPClient.end(); // end client after server's response

      // const clientsList = data.toString().replace( /\r\n/g, ' ' ).split(Buffer.from([0x0a]).toString())
      const clientsList = data.toString().replace( /\r\n/g, '@@@@@@' ).split('@@@@@@')

      const clients = [];

      for (const client of clientsList) {
        const clientSplitted = client.split(';')

        if (clientSplitted[0].length > 0 || typeof clientSplitted[1] !== 'undefined') {
          clients.push({ id: clientSplitted[0], name: clientSplitted[1] })
        }

      }
      console.log('RECEIVED and PARSED:', clients)

      TCPClient.emit('clients', clients)
    });
  }

  getTagsList() {
    console.log('getTagsList')
    const TCPClient = this.TCPClient('nfc', 'getTagsList')
  }

  getTagInfo() {
    console.log('getTagInfo')
    const TCPClient = this.TCPClient('nfc', 'getTagInfo')
  }







  getPinCode() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const fakePin = (Math.floor(1000 + Math.random() * 9000)).toString();
        resolve(fakePin);
      }, 1000);
    });
  }
  getClientListx() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const clients = [
          {id: 1, name: 'Masdria'},
          {id: 2, name: 'Loomis'},
          {id: 3, name: 'c'},
          {id: 4, name: 'd'},
          {id: 5, name: 'e'}
        ];
        resolve(clients);
      }, 1000);
    });
  }


}
