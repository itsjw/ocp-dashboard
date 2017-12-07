import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'reverseArr',
  pure: false
})
export class ReverseArrPipe implements PipeTransform {

  transform (values) {
    if (values) {
      return values.reverse();
    }
  }

}
