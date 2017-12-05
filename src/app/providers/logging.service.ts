import { Injectable } from '@angular/core';

@Injectable()
export class LoggingService {

  constructor() { }
  log(e) {
    console.error('err', e.message);
    console.info('stack', e.stack);
    console.log('url', e.url);

  }
}
