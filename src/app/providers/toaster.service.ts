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

  // https://github.com/Stabzs/Angular2-Toaster/blob/master/src/toaster-config.ts#L35
  getConfig() {
    return new ToasterConfig({
      positionClass: this.position,
      timeout: 2500,
      newestOnTop: true,
      tapToDismiss: true,
      preventDuplicates: true,
      animation: this.animationType,
      limit: this.toastsLimit,
      iconClasses: {
        error: 'fa fa-exclamation-triangle toaster-icon',
        info: 'fa fa-info-circle toaster-icon',
        wait: 'fa fa-pause toaster-icon',
        success: 'fa fa-check-circle toaster-icon',
        warning: 'fa fa-exclamation-circle toaster-icon'
      },
      typeClasses: {
        error: 'toast-danger',
        info: 'toast-info',
        wait: 'toast-wait',
        success: 'toast-success',
        warning: 'toast-warning'
      }
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
   */
  show(type: string, title: string, body: string) {
    this.toasterConfig = this.getConfig();
    const toast: Toast = this.getToast(title, body)
    this.toasterService.popAsync(toast);
  }

}
