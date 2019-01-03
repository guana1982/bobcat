import { BrowserQRCodeReader } from "@zxing/library";

const DEBUG = false;

export default class QRCodeScanner {

  _video; any;
  _imageBuffer: any;
  _frameCount: number;
  _active: boolean;
  _scanTimeoutId: any;
  _canvas: HTMLCanvasElement;
  __scannedQrCurrent: string;
  __scannedQrFramesCount: number;
  __scannedQrTimes: any[];
  __log: HTMLDivElement;
  _canvasContext: any;
  _lastScanned: any;
  _videoPlayable: Promise<{}>;
  submitScan: any;
  codeReader: any; // BrowserQRCodeReader;
  _width: any;
  _height: any;
  cancelLastTimeout: any;
  __avgReadTime: any;

  constructor(video, submitScan) {
    this._video = video;
    this._imageBuffer = false;
    this._frameCount = 0;
    this._active = false;
    this._scanTimeoutId = null;
    this._video.style.display = "none";
    if (process.env.INTELLITOWER_VENDOR === "pepsi") {
      this._canvas = document.createElement("canvas");
      this._canvas.style.position = "absolute";
      this._canvas.style.bottom = "440px";
      this._canvas.style.left = "162px";
      this._canvas.style.width = "400px";
    } else {
      this._canvas = document.createElement("canvas");
      this._canvas.style.position = "absolute";
      this._canvas.style.bottom = "0";
      this._canvas.style.right = "0";
      this._canvas.style.width = "400px";
    }
    document.body.appendChild(this._canvas);
    if (DEBUG) {
      this.__scannedQrCurrent = "";
      this.__scannedQrFramesCount = 0;
      this.__scannedQrTimes = [];
      this.__log = document.createElement("div");
      this.__log.style.position = "absolute";
      this.__log.style.top = "40px";
      this.__log.style.left = "10px";
      this.__log.style.fontFamily = "monospace";
      this.__log.style.fontSize = "40px";
      this.__log.style.whiteSpace = "pre-line";
      this.__log.innerText = "QR debug mode: ENABLED";
      document.body.appendChild(this.__log);
    }
    this._canvasContext = this._canvas.getContext("2d");
    this._lastScanned = null;
    this._videoPlayable = new Promise((resolve, reject) => {
      this._video.onloadeddata = resolve;
    });
    navigator.getUserMedia(
      { audio: false, video: true },
      stream => {
        this._video.srcObject = stream;
      },
      err => {
        throw err;
      }
    );
    this.submitScan = submitScan;
    this.codeReader = new BrowserQRCodeReader();
  }
  start() {
    this._videoPlayable.then(() => {
      this._active = true;
      this._width = this._canvas.width = this._video.videoWidth;
      this._height = this._canvas.height = this._video.videoHeight;
      this._scan();
    });
  }
  stop() {
    console.log("Stopping Scanner");
    this._active = false;
    window.clearTimeout(this._scanTimeoutId);
    this._scanTimeoutId = null;
    this._lastScanned = null;
    if (this.cancelLastTimeout) clearTimeout(this.cancelLastTimeout);
    if (!this._video || !this._video.srcObject) {
      return;
    }
    this.codeReader.stop();
    for (let stream of this._video.srcObject.getVideoTracks()) {
      stream.stop();
    }
    this._video.srcObject = null;
    document.body.removeChild(this._canvas);
  }
  onSuccessfulScan = event => {
    const qrData = event.data;
    console.log("::: Scan:", qrData);
    if (DEBUG) {
      this.__scannedQrCurrent = qrData;
      this.__scannedQrFramesCount++;
      this.__scannedQrTimes.push(Date.now());
      this.__scannedQrTimes = this.__scannedQrTimes.slice(-10);
      this.__avgReadTime = this.__scannedQrTimes
        .map((t, i) => (i === 0 ? null : t - this.__scannedQrTimes[i - 1]))
        .filter(Boolean)
        .reduce((acc, e) => acc + e / 9, 0)
        .toFixed(0);
    }
    if (qrData !== this._lastScanned) {
      this._lastScanned = qrData;
      if (!DEBUG) {
        this.submitScan(qrData);
      }
    }
    this.cancelLastTimeout = setTimeout(() => {
      this._lastScanned = null;
    }, 5000);
    if (DEBUG) {
      // Restart scanning for debug purposes
      setTimeout(() => this._scan(), 100);
    }
  }
  _analyze() {
    if (this._video.readyState < 2) window.setTimeout(() => this._scan(), 250);
    const refreshOnScreenVideo = setInterval(() => {
      this._canvasContext.drawImage(this._video, 0, 0, this._width, this._height);
    }, 250);
    // const imageData = this._canvasContext.getImageData(0, 0, this._width, this._height)
    this.codeReader
      .decodeFromInputVideoDevice(undefined, this._video)
      .then((result: any) => {
        this.onSuccessfulScan({ data: result.text });
        clearInterval(refreshOnScreenVideo);
      })
      .catch(er => {
        console.error(er);
      });
  }
  _scan() {
    if (!this._active) {
      return;
    }
    // this._scanTimeoutId = window.setTimeout(() => this._scan(), 250)
    console.log("::: Scanning...");
    if (DEBUG) {
      this.__log.innerText = `\
        QR-TEST-5
        QR: ${this.__scannedQrCurrent || `...SCANNING...`}
        QR read count: ${this.__scannedQrFramesCount}
        Avg read time: ${this.__avgReadTime || 0} ms
        Size: ${this._width || 0}x${this._height || 0}
      `;
      window.setTimeout(() => {
        this.__scannedQrCurrent = "";
      }, 250);
    }
    this._analyze();
  }

}
