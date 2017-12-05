import { Injectable } from '@angular/core';
import { ToasterConfig, BodyOutputType } from 'angular2-toaster';

@Injectable()
export class ToasterConfigService {
  position = 'toast-top-right';
  animationType = 'fade';
  timeout = 5000;
  toastsLimit = 5;
  type = 'default';

  constructor() {
  }

  getConfig() {
    return new ToasterConfig({
      positionClass: this.position,
      timeout: 2500,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: true,
      animation: this.animationType,
      limit: this.toastsLimit,
    });
  }

 getToast(title, body) {
  return {  
    type: this.type,
    title: title,
    body: body,
    timeout: this.timeout,
    showCloseButton: true,
    bodyOutputType: BodyOutputType.TrustedHtml
  }
 }

}
