/*
* BoxBlurFilter
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Adapted by Hiro to function as a standalone web worker. Pass it a
* message with a data object supplying ImageData, a radius and quality
* (number of passes). Returns a message with the resulting
* blurred ImageData.
*
*
* Copyright (c) 2010 gskinner.com, inc.
* With Portions Copyright (c) 2013 Hiro, http://www.madebyhiro.com/
*
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
*
*/

onmessage = function (event) {
  blur(event.data.imageData, event.data.radius, event.data.quality);
}

function blur(imageData, radius, quality) {
  var pixels = imageData.data;
  var width = imageData.width;
  var height = imageData.height;

  var rsum, gsum, bsum, asum, x, y, i, p, p1, p2, yp, yi, yw;
  var wm = width - 1;
  var hm = height - 1;
  var rad1x = radius + 1;
  var divx = radius + rad1x;
  var rad1y = radius + 1;
  var divy = radius + rad1y;
  var div2 = 1 / (divx * divy);

  var r = [];
  var g = [];
  var b = [];
  var a = [];

  var vmin = [];
  var vmax = [];

  while (quality-- > 0) {
      yw = yi = 0;

      for (y = 0; y < height; y++) {
          rsum = pixels[yw] * rad1x;
          gsum = pixels[yw + 1] * rad1x;
          bsum = pixels[yw + 2] * rad1x;
          asum = pixels[yw + 3] * rad1x;


          for (i = 1; i <= radius; i++) {
              p = yw + (((i > wm ? wm : i)) << 2);
              rsum += pixels[p++];
              gsum += pixels[p++];
              bsum += pixels[p++];
              asum += pixels[p]
          }

          for (x = 0; x < width; x++) {
              r[yi] = rsum;
              g[yi] = gsum;
              b[yi] = bsum;
              a[yi] = asum;

              if (y == 0) {
                  vmin[x] = Math.min(x + rad1x, wm) << 2;
                  vmax[x] = Math.max(x - radius, 0) << 2;
              }

              p1 = yw + vmin[x];
              p2 = yw + vmax[x];

              rsum += pixels[p1++] - pixels[p2++];
              gsum += pixels[p1++] - pixels[p2++];
              bsum += pixels[p1++] - pixels[p2++];
              asum += pixels[p1] - pixels[p2];

              yi++;
          }
          yw += (width << 2);
      }

      for (x = 0; x < width; x++) {
          yp = x;
          rsum = r[yp] * rad1y;
          gsum = g[yp] * rad1y;
          bsum = b[yp] * rad1y;
          asum = a[yp] * rad1y;

          for (i = 1; i <= radius; i++) {
              yp += (i > hm ? 0 : width);
              rsum += r[yp];
              gsum += g[yp];
              bsum += b[yp];
              asum += a[yp];
          }

          yi = x << 2;
          for (y = 0; y < height; y++) {
              pixels[yi] = (rsum * div2 + 0.5) | 0;
              pixels[yi + 1] = (gsum * div2 + 0.5) | 0;
              pixels[yi + 2] = (bsum * div2 + 0.5) | 0;
              pixels[yi + 3] = (asum * div2 + 0.5) | 0;

              if (x == 0) {
                  vmin[y] = Math.min(y + rad1y, hm) * width;
                  vmax[y] = Math.max(y - radius, 0) * width;
              }

              p1 = x + vmin[y];
              p2 = x + vmax[y];

              rsum += r[p1] - r[p2];
              gsum += g[p1] - g[p2];
              bsum += b[p1] - b[p2];
              asum += a[p1] - a[p2];

              yi += width << 2;
          }
      }
  }
  postMessage(imageData);
}