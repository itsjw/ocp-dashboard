import { environment } from './../../../environments/index';
import { NFC, TAG_ISO_14443_3, TAG_ISO_14443_4, KEY_TYPE_A, KEY_TYPE_B } from 'nfc-pcsc';

import ndefParser from 'ndef-parser';

import { NfcService } from 'app/providers/nfc/nfc.service';
// import { endianness } from 'endianness'; // MSB first converter
import { Injectable } from '@angular/core';

@Injectable()
export class NfcParserService {

  parseNdef(data) {
    const DEBUG = environment.debug;

    if (DEBUG) { console.log('Parsing data:', data) }
  }


}
