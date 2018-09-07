const Utils = {
  distance: function(p1, p2) {
    let dx = p2[0] - p1[0];
    let dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
  },
  getAABB: function(points) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 0, len = points.length; i < len; i++) {
      let p = points[i];
      minX = Math.min(minX, p[0]);
      maxX = Math.max(maxX, p[0]);
      minY = Math.min(minY, p[1]);
      maxY = Math.max(maxY, p[1]);
    }
    return [minX, minY, maxX, maxY, maxX - minX, maxY - minY];
  },
  cosSimilarity: function(vector1, vector2) {
    let dot = 0;
    let sum1 = 0;
    let sum2 = 0;
    for (let i = 0; i < vector1.length; i++) {
      let v1 = vector1[i];
      let v2 = vector2[i];
      dot += v1 * v2;
      sum1 += v1 * v1;
      sum2 += v2 * v2;
    }
    return dot / Math.sqrt(sum1 * sum2);
  },
  cosDistance: function(vector1, vector2) {
    // return 1-Utils.cosSimilarity(vector1,vector2)
    let a = 0;
    let b = 0;
    for (let i = 0; i < vector1.length; i += 2) {
      a += vector1[i] * vector2[i] + vector1[i + 1] * vector2[i + 1];
      b += vector1[i] * vector2[i + 1] - vector1[i + 1] * vector2[i];
    }
    let angle = Math.atan(b / a);
    let d = Math.acos(a * Math.cos(angle) + b * Math.sin(angle));
    return d;
  },
  polylineLength: function(points) {
    let d = 0;
    for (let i = 1, len = points.length; i < len; i++) {
      d += Utils.distance(points[i - 1], points[i]);
    }
    return d;
  },
  resample: function(points, n) {
    let I = Utils.polylineLength(points) / (n - 1);
    let D = 0;
    let p1 = points[0];
    let newPoints = [[p1[0], p1[1]]];
    let len = points.length;
    for (let i = 1; i < len; ) {
      let p2 = points[i];
      let d = Utils.distance(p1, p2);
      if (D + d >= I) {
        let k = (I - D) / d;
        let qx = p1[0] + k * (p2[0] - p1[0]);
        let qy = p1[1] + k * (p2[1] - p1[1]);
        let q = [qx, qy];
        newPoints.push(q);
        D = 0;
        p1 = q;
      } else {
        D += d;
        p1 = p2;
        i++;
      }
    }
    if (newPoints.length === n - 1) {
      newPoints.push([points[len - 1][0], points[len - 1][1]]);
    }
    return newPoints;
  }
};
export default Utils;
