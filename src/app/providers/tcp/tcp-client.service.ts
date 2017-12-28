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
}
