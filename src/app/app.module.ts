
import 'zone.js/dist/zone-mix';
import 'reflect-metadata';
import 'polyfills';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, ErrorHandler } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { APP_BASE_HREF } from '@angular/common';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { AppRoutingModule } from './app-routing.module';
import { NbThemeModule } from '@nebular/theme';
import { HomeModule } from './pages/home/home.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';

import { ElectronService } from './providers/electron.service';
import { NfcService } from './providers/nfc/nfc.service';
import { GlobalErrorHandler } from 'app/providers/errorHandler.service';
import { NdefFormaterService } from 'app/providers/nfc/ndefformater.service';
import { NfcParserService } from 'app/providers/nfc/nfcparser.service';
import { PrinterService } from './providers/printer.service';
import { LoggingService } from './providers/logging.service';
import { NfccardToolService } from 'app/providers/nfc/nfccard-tool.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    // NgbModule.forRoot(), // @TODO: forRoot?
    // CoreModule.forRoot(),
    // // this will enable the default theme, you can change this to `cosmic` to enable the dark theme
    // NbThemeModule.forRoot({ name: 'default' }),cosmic
    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    ElectronService,
    { provide: APP_BASE_HREF, useValue: '/' },
    NfcService,
    NfcParserService,
    NdefFormaterService,
    PrinterService,
    NfccardToolService
    // disable error handler for now
    // @TODO: to clean.
    // {
    //   provide: ErrorHandler,
    //   useClass: GlobalErrorHandler
    // },
    // LoggingService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
