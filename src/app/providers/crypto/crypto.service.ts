import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable()
export class CryptoService {
  MasdriaDemoKey: string;

  constructor() {
    this.MasdriaDemoKey = '6QauYkMSy0Jjk1Pmhhw2pJV7fZ9xqqEO'; // demo key (sent to masdria)
  }

  /**
   * Use: this.cryptoS.decrypt('DecodeMe', 'MasdriaDemoKey');
   */
  encrypt(stringToEncrypt, secretKeyName) {
    const encryptedString = CryptoJS.AES.encrypt(stringToEncrypt, this[secretKeyName]).toString();
    return encryptedString; // (cyphered)
  }

  /**
   * Use: this.cryptoS.decrypt('EncodeMe', 'MasdriaDemoKey');
   */
  decrypt(encryptedString, secretKeyName) {
    const decryptedString = CryptoJS.AES.decrypt(encryptedString, this[secretKeyName]).toString(CryptoJS.enc.Utf8);
    return decryptedString;
  }
}
