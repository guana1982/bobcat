export function setRafInterval(cb, interval) {
  let timerId;
  let start = Date.now();
  const timer = () => {
    let now = Date.now();
    let d = now - start;
    if (d > interval) {
      // eslint-disable-next-line
      cb(d);
      start = now - d % interval;
    }
    timerId = window.requestAnimationFrame(timer);
  };
  timerId = window.requestAnimationFrame(timer);
  return timerId;
}

export function setRafTimeout(cb, timeout) {
  let timerId;
  let start = Date.now();
  const timer = () => {
    let now = Date.now();
    let d = now - start;
    if (d < timeout) {
      timerId = window.requestAnimationFrame(timer);
    }
    cb(d > timeout, timerId);
  };
  timerId = window.requestAnimationFrame(timer);
  return timerId;
}
