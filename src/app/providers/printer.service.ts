import { Injectable } from '@angular/core';
import printer from 'printer';

/**
 * @DOCS: https://github.com/tojocky/node-printer
 * @EXAMPLES: https://github.com/tojocky/node-printer/tree/master/examples
 */

@Injectable()
export class PrinterService {

  constructor() {
    
  }

  printText(textToPrint: string) {

  printer.printDirect({
    data: textToPrint,
    // printer:'Foxit Reader PDF Printer' // printer name, if missing then will print to default printer
    type: 'TEXT', // type: RAW, TEXT, PDF, JPEG, .. depends on platform
      // SUCCESS callback
      success: function(jobID) {
        console.log('sent to printer with ID: ' + jobID);
      },
      // ERROR callback    
      error: function(err) {
        console.log(err);
      }
  });
  }
}
