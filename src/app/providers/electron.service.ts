import { Injectable } from '@angular/core';

// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer } from 'electron';
import * as childProcess from 'child_process';
import { electronDebug } from 'electron-debug';

@Injectable()
export class ElectronService {

  electronDebug: any;
  ipcRenderer: typeof ipcRenderer;
  childProcess: typeof childProcess;

  constructor() {
    // Conditional imports
    if (this.isElectron()) {
      // this.electronDebug = window.require('electron-debug')({showDevTools: true});
      this.ipcRenderer = window.require('electron').ipcRenderer;
      this.childProcess = window.require('child_process');
    }
  }

  isElectron = () => {
    return window && window.process && window.process.type;
  }

}
