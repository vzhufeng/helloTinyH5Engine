function compose(middleware) {
  // copy from koa-compose
  return function(next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(
          fn(function next() {
            return dispatch(i + 1);
          })
        );
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}

function queueTimer(list, cb) {
  let cnt = 0;
  walk();
  function walk() {
    const { time } = list[cnt];
    setTimeout(() => {
      cb(list[cnt]);
      cnt++;
      cnt < list.length && walk();
    }, time);
  }
}

export default {
  compose,
  queueTimer
};
