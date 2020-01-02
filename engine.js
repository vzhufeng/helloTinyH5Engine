import Util from "./util";

const { compose, queueTimer } = Util;

export default class Engine {
  constructor() {
    this.ids = [];
  }

  paramCheck(param, list) {
    for (let i = 0, len = list.length; i < len; i++) {
      if (!param[list[i]]) {
        throw `please set "${list[i]}" property`;
      }
    }
  }

  getObject(name, param = {}, list = []) {
    if (name) {
      this.paramCheck(param, list);
      if (this.ids.includes(name)) {
        return document.querySelector("#" + name);
      } else {
        throw "this object is not in this scene";
      }
    } else {
      throw 'please set "name" property';
    }
  }

  genId = () => {
    let temp = "_tinyEngine_ele_" + this.ids.length;
    this.ids.push(temp);
    return temp;
  };

  getUnit(val) {
    const v = (val + '').trim();
    if (/^[\d\-]+$/g.test(v)) {
      return v + "px";
    } else {
      return v;
    }
  }

  createScene = param => {
    const { element, height, width, bgColor } = param;
    this.scene = element || document.body;
    this.scene.style.cssText = `position: relative; width: ${this.getUnit(width)}; height: ${this.getUnit(height)}; background-color: ${bgColor}; overflow: hidden;`;
  };

  createObject = param => {
    const { style, height, width, position = {}, path } = param;
    const ele = document.createElement("div");
    ele.id = this.genId();
    ele.style.cssText =
      (path
        ? `background: url("${path}") no-repeat center center; background-size: 100% 100%;`
        : "") +
      (style || "") +
      `left: ${this.getUnit(position.left)}; top: ${this.getUnit(position.top)};position: absolute; width: ${this.getUnit(width)}; height: ${this.getUnit(height)};`;
    this.scene.appendChild(ele);
    return ele.id;
  };

  setObjectPosAnimation = (name, param) => {
    const ele = this.getObject(name, param, ["keyframes"]);
    const { keyframes = [] } = param;
    const middleware = [];

    for (let i = 0, len = keyframes.length; i < len; i++) {
      const { positionStart = {}, positionEnd = {}, time } = keyframes[i];
      middleware.push(next => {
        let leftReach = false;
        let topReach = false;
        let already = false;

        this.animFactory({
          start: positionStart.left,
          end: positionEnd.left,
          time,
          cb: val => {
            ele.style.cssText += ele.style.cssText + `left: ${this.getUnit(val)};`;
            if (!already && val === positionEnd.left) {
              leftReach = true;
              if (topReach) {
                // 防止多次调用next
                already = true;
                next();
              }
            }
          }
        });
        this.animFactory({
          start: positionStart.top,
          end: positionEnd.top,
          time,
          cb: val => {
            ele.style.cssText += ele.style.cssText + `top: ${this.getUnit(val)};`;
            if (!already && val === positionEnd.top) {
              topReach = true;
              if (leftReach) {
                already = true;
                next();
              }
            }
          }
        });
      });
    }

    compose(middleware)();
  };

  setObjectPos = (name, param) => {
    const ele = this.getObject(name, param, ["position"]);
    const { left, top } = param.position;
    ele.style.cssText += ele.style.cssText + `top: ${this.getUnit(top)}; left: ${this.getUnit(left)};`;
  };

  getObjectPos = (name, param) => {
    const ele = this.getObject(name);
    let top = ele.style.top;
    let left = ele.style.left;

    if (window.getComputedStyle) {
      const style = window.getComputedStyle(ele, null);
      top = style.getPropertyValue("top");
      left = style.getPropertyValue("left");
    } else {
      top = ele.style.top;
      left = ele.style.left;
    }

    return {
      left: parseInt(left.slice(0, left.length - 2), 10),
      top: parseInt(top.slice(0, top.length - 2), 10)
    };
  };

  animFactory = options => {
    const { start, end, time, cb, next } = options;
    const createTime = function() {
      return +new Date();
    };
    let startTime = createTime();

    const _setTime = requestAnimationFrame ? requestAnimationFrame : setTimeout;
    const _clearTime =
      _setTime === requestAnimationFrame ? cancelAnimationFrame : clearTimeout;

    let timerId = _setTime(tick, 13);

    function tick() {
      let remaining = Math.max(0, startTime + time - createTime());
      let temp = remaining / time || 0;
      let percent = 1 - temp;
      let val = (end - start) * percent + start;
      cb(val);
      if (percent < 1) {
        timerId = _setTime(tick, 13);
      } else {
        _clearTime(timerId);
        timerId = null;
        next && next();
      }
    }
  };

  setObjectSpriteAnimation = (name, param) => {
    const ele = this.getObject(name, param, ["keyframes"]);
    const { keyframes = [] } = param;

    queueTimer(keyframes, item => {
      const { path } = item;
      ele.style.cssText += ele.style.cssText + `background: url('${path}');`;
    });
  };

  /*

  创建物体，绑定图片，渲染
  修改位置，获取位置
  设置速度，获取速度
  检测碰撞，监听碰撞事件
  */
}
