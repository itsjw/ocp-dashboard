import { Pipe, PipeTransform } from '@angular/core';
import { CryptoService } from './../providers/crypto/crypto.service';

@Pipe({
  name: 'decryptPin'
})
export class DecryptPinPipe implements PipeTransform {

  constructor(private crypto: CryptoService) {
  }

  // transform(encryptedString: any, args?: any): any {
  transform(encryptedString) {
    if (encryptedString) {
      return this.crypto.decrypt(encryptedString, 'MasdriaDemoKey');
    } else {
      return '';
    }
  }
}
