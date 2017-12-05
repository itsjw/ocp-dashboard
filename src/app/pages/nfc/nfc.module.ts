import { ToasterModule } from 'angular2-toaster';
import { ToasterConfigService } from './../../providers/toaster.service';

import { ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from './../../providers/errorHandler.service';

import { ThemeModule } from '../../@theme/theme.module';
import { NfcComponent } from './nfc.component';
import { from } from 'rxjs/observable/from';
import { LoggingService } from 'app/providers/logging.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule,
    NgbModule
  ],
  declarations: [
    NfcComponent
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandler
    },
    LoggingService,
    ToasterConfigService
]
})
export class NfcModule { }
