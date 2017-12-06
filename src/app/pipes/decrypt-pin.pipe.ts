import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'decryptPin'
})
export class DecryptPinPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return 1234;
  }

}
