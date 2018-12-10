import Utils from "./gestureUtils";

const Polyline = function(points) {
  this.points = points || [];
};

let proto = {
  constructor: Polyline,
  id: null,
  name: null,
  points: null,
  origPoints: null,
  ignoreRotate: false,
  originX: 0,
  originY: 0,
  ratio1D: 0.2,
  rotationInvariance: Math.PI / 4,
  normalPointCount: 40,
  normalSize: 200,
  init: function(transform) {
    transform = transform !== false;
    this.origPoints = this.points;
    if (transform) {
      this.points = Utils.resample(this.origPoints, this.normalPointCount);
    }
    this.pointCount = this.points.length;
    this.firstPoint = this.points[0];
    this.centroid = this.getCentroid();
    this.translateTo(this.originX, this.originY);
    this.aabb = Utils.getAABB(this.points);
    if (transform) {
      this.scaleTo(this.normalSize);
      this.angle = this.indicativeAngle();
      // if (this.angle){
      this.rotateBy(-this.angle);
      // }
    }
    this.vector = this.vectorize();
  },
  indicativeAngle: function() {
    let iAngle = Math.atan2(this.firstPoint[1], this.firstPoint[0]);
    if (this.rotationInvariance) {
      let r = this.rotationInvariance;
      let baseOrientation = r * Math.floor((iAngle + r / 2) / r);
      return iAngle - baseOrientation;
    }
    return iAngle;
  },
  length: function() {
    return Utils.polylineLength(this.points);
  },
  vectorize: function() {
    let sum = 0;
    let vector = [];
    let len = this.pointCount;
    for (let i = 0; i < len; i++) {
      let x = this.points[i][0],
        y = this.points[i][1];
      vector.push(x);
      vector.push(y);
      sum += x * x + y * y;
    }
    let magnitude = Math.sqrt(sum);
    len <<= 1;
    for (let i = 0; i < len; i++) {
      vector[i] /= magnitude;
    }
    return vector;
  },
  getCentroid: function() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.pointCount; i++) {
      x += this.points[i][0];
      y += this.points[i][1];
    }
    x /= this.pointCount;
    y /= this.pointCount;
    return [x, y];
  },
  translateTo: function(x, y) {
    let c = this.centroid;
    c[0] -= x;
    c[1] -= y;
    for (let i = 0; i < this.pointCount; i++) {
      let p = this.points[i];
      let qx = p[0] - c[0];
      let qy = p[1] - c[1];
      p[0] = qx;
      p[1] = qy;
    }
  },
  rotateBy: function(radians) {
    let cos = Math.cos(radians);
    let sin = Math.sin(radians);
    for (let i = 0; i < this.pointCount; i++) {
      let p = this.points[i];
      let qx = p[0] * cos - p[1] * sin;
      let qy = p[0] * sin + p[1] * cos;
      p[0] = qx;
      p[1] = qy;
    }
  },
  scale: function(scaleX, scaleY) {
    for (let i = 0; i < this.pointCount; i++) {
      let p = this.points[i];
      let qx = p[0] * scaleX;
      let qy = p[1] * scaleY;
      p[0] = qx;
      p[1] = qy;
    }
  },
  scaleTo: function(width, height) {
    height = height || width;
    let aabb = this.aabb;
    if (this.ratio1D) {
      let longSide = Math.max(aabb[4], aabb[5]);
      let shortSide = Math.min(aabb[4], aabb[5]);
      let uniformly = shortSide / longSide < this.ratio1D;
      if (uniformly) {
        let scaleX = width / longSide;
        let scaleY = height / longSide;
        return this.scale(scaleX, scaleY);
      }
    }
    let scaleX = width / aabb[4];
    let scaleY = height / aabb[5];
    this.scale(scaleX, scaleY);
  }
};

for (let p in proto) {
  Polyline.prototype[p] = proto[p];
}

export default Polyline;
