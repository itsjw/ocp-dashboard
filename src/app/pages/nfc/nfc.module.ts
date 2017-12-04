import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { NfcComponent } from './nfc.component';

import { from } from 'rxjs/observable/from';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    NfcComponent
  ],
  providers: []
})
export class NfcModule { }
