import Utils from "./gestureUtils";
import Polyline from "./polyline";
const DollarOne = function(cfg) {
  for (let property in cfg) {
    this[property] = cfg[property];
  }
  this.gesturePool = this.gesturePool || {};
};
let proto = {
  constructor: DollarOne,
  threshold: 0.3,
  ratio1D: 0.2,
  rotationInvariance: Math.PI / 4,
  normalPointCount: 40,
  normalSize: 200,
  recognize: function(points, first) {
    let polyline = this.createPolyline(points);
    polyline.init();
    let vector = polyline.vector;
    let minDis = this.threshold;
    let match = null;
    for (let name in this.gesturePool) {
      let gesture = this.gesturePool[name];
      let d = Utils.cosDistance(gesture.vector, vector);
      if (d < minDis) {
        minDis = d;
        match = name;
        if (first) {
          return match;
        }
      }
    }
    return match;
  },
  createPolyline: function(points) {
    let polyline = new Polyline(points);
    polyline.ratio1D = this.ratio1D;
    polyline.rotationInvariance = this.rotationInvariance;
    polyline.normalPointCount = this.normalPointCount;
    polyline.normalSize = this.normalSize;
    return polyline;
  },
  getGesture: function(name) {
    return this.gesturePool[name];
  },
  addGesture: function(name, points, transform) {
    let polyline = Array.isArray(points) ? this.createPolyline(points) : points;
    polyline.name = name;
    polyline.init(transform);
    this.gesturePool[name] = polyline;
  },
  removeGesture: function(name) {
    if (!name) {
      this.gesturePool = {};
      return;
    }
    delete this.gesturePool[name];
  }
};
for (let p in proto) {
  DollarOne.prototype[p] = proto[p];
}
export default DollarOne;
