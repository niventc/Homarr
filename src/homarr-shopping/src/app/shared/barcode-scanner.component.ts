import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import * as Quagga from 'quagga';

interface DetectionResult {
  angle: number;
  box: any[];
  boxes: any[];
  codeResult: CodeResult;
}

interface CodeResult {
  code: string;
  codeset: string;
  decodedCodes: any[];
  direction: number;
  end: number;
  format: string;
  start: number;
  startInfo: StartInfo;
}

interface StartInfo {
  code: number;
  end: number;
  error: number;
  start: number;
}

@Component({
  selector: 'barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  //styleUrls: ['./app.component.scss']
})
export class BarcodeScanner implements OnInit {

  @ViewChild("scanBtn") scanBtn: ElementRef;
  quaggaObservable: Subscription;
  isScanning: boolean;

  @ViewChild("barcode") barcodeInput: ElementRef;

  title = 'app works!';

  barcodes: Array<string>;

  constructor(
    private lifecycle: NgZone
  ) {
    this.barcodes = new Array<string>();

    this.handleDetection = this.handleDetection.bind(this);
    this.addItem = this.addItem.bind(this);
  }

  ngOnInit() {
    this.quaggaObservable = Observable
      .fromEvent(this.scanBtn.nativeElement, 'click')
      .startWith(false)
      .scan((acc, value, index) => acc = !acc)
      .subscribe((x: boolean) => {
        this.isScanning = x;
        if(x) {
          this.startScanning();
        } else {
          this.stopScanning();
        }
      });
  }

  private startScanning(): void {
    Quagga.init({
      inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#quagga')    // Or '#yourElement' (optional)
      },
      decoder : {
        readers : ["code_128_reader", "ean_reader"],
        multiple: false
      }
    }, function(err) {
        if (err) {
            console.log(err);
            return
        }
        console.log("Initialization finished. Ready to start");
        Quagga.start();
        console.log("Quagga started successfully");
    });

    Quagga.onDetected(this.handleDetection);
  }

  private stopScanning(): void {
    try {
      Quagga.stop();
      console.log("Quagga stopped successfully");    
    } catch (error) {
      console.log("Unable to stop Quagga, maybe it hasn't started yet.");
    }
  }

  handleDetection(data: DetectionResult) {
    this.lifecycle.run(() => {
      this.barcodes.push(data.codeResult.code);

      this.barcodeInput.nativeElement.value = data.codeResult.code;
    });
  }

  addItem(item: string) {
    this.barcodes.push(item);
  }

}