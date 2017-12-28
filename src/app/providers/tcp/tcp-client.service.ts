import { Injectable } from '@angular/core';

@Injectable()
export class TcpClientService {

  constructor() { }

  getPinCode() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const fakePin = (Math.floor(1000 + Math.random() * 9000)).toString();
        resolve(fakePin);
      }, 1000);
    });
  }
  getClientList() {
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
