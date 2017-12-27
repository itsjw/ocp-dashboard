import { Injectable } from '@angular/core';
import { nfcardTool } from 'nfccard-tool';

@Injectable()
export class NfccardToolService {

  constructor() {
    console.log('nfcCardTool service loaded.')
  }

}
