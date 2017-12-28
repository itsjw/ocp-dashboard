import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { ElectronService } from './providers/electron.service';

import 'buffer';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.scss']
// })
@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  constructor(public electronService: ElectronService, private analytics: AnalyticsService) {

    if (electronService.isElectron()) {
      console.log('Mode electron');
      let b = Buffer.from('1234', 'hex')
      console.log(b)
      console.log(Buffer)
      console.log(new Buffer('1'))
      console.log(b instanceof Buffer)
      // Check if electron is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.ipcRenderer);
      // Check if nodeJs childProcess is correctly injected (see externals in webpack.config.js)
      console.log('c', electronService.childProcess);
      console.log('c', electronService.electronDebug);
    } else {
      console.log('Mode web');
    }
  }
  ngOnInit(): void {
    this.analytics.trackPageViews();
  }
}
