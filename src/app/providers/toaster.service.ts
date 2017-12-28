import { Injectable } from '@angular/core';
import { ToasterConfig, ToasterService, BodyOutputType, Toast } from 'angular2-toaster';

@Injectable()
export class ToasterConfigService {
  toasterConfig: ToasterConfig;
  position = 'toast-top-right';
  animationType = 'fade';
  timeout = 7000;
  toastsLimit = 5;
  type = 'default';

  constructor(public toasterService: ToasterService) {
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

  /**
   * @method show
   * @description show a toast on the top-right corner
   *
   * @private
   * @param {string} type 'error, success, info, warning...'
   * @param {string} title 'a title'
   * @param {string} body 'body of the message to be shown'
   * @memberof NfcComponent
   */
  show(type: string, title: string, body: string) {
    this.toasterConfig = this.getConfig();
    const toast: Toast = this.getToast(title, body)
    this.toasterService.popAsync(toast);
  }

}
