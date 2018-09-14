/* eslint-disable */
importScripts('./zxing.js')
var decodeCallback = ZXing.Runtime.addFunction(function(ptr, len, resultIndex, resultCount) {
  var result = new Uint8Array(ZXing.HEAPU8.buffer, ptr, len)

  var str = String.fromCharCode.apply(null, result)
  if (resultCount === 0) {
    return zxDecodeResult = null
  }
  postMessage(str)
})

onmessage = function(message) {
  try {
    var data = message.data.data
    var width = message.data.width
    var height = message.data.height

    var imageWritePtr = ZXing._resize(width, height)

    for (var i = 0, j = 0; i < data.length; i += 4, j++) {
      var r = data[i]
      var g = data[i + 1]
      var b = data[i + 2]
      ZXing.HEAPU8[imageWritePtr + j] = Math.trunc((r + g + b) / 3)
    }
    ZXing._decode_qr(decodeCallback)
  } catch(err) {
    console.error(err)
  }

}
