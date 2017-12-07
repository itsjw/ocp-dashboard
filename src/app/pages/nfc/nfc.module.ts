
import { ToasterModule } from 'angular2-toaster';
import { ToasterConfigService } from './../../providers/toaster.service';

import { ErrorHandler, NgModule } from '@angular/core';
import { GlobalErrorHandler } from './../../providers/errorHandler.service';

import { ThemeModule } from '../../@theme/theme.module';
import { NfcComponent } from './nfc.component';
import { from } from 'rxjs/observable/from';
import { LoggingService } from 'app/providers/logging.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DecryptPinPipe } from 'app/pipes/decrypt-pin.pipe';
import { GetKeysPipe } from 'app/pipes/get-keys.pipe';
import { ReverseArrPipe } from 'app/pipes/reverse-arr.pipe';

@NgModule({
  imports: [
    ThemeModule,
    ToasterModule,
    NgbModule,
    Ng2SmartTableModule
  ],
  declarations: [
    NfcComponent,
    DecryptPinPipe,
    GetKeysPipe,
    ReverseArrPipe
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
