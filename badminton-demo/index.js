// 已经发球
const started = false;

const E = new tinyEngine();

E.createScene({
  element: document.querySelector("#scene"),
  width: "600",
  height: "300",
  bgColor: "white"
});

const bg = E.createObject({
  width: "600",
  height: "300",
  position: { left: 0, top: 0 },
  style: "background: black;"
});

const self = E.createObject({
  width: "30",
  height: "120",
  position: { left: 100, top: 180 },
  style: "background: white;"
});

const web = E.createObject({
  width: "10",
  height: "100",
  position: { left: 300, top: 200 },
  style: "background: white;"
});

const webPos = E.getObjectPos(web);

const opponent = E.createObject({
  width: "30",
  height: "120",
  position: { left: 500, top: 180 },
  style: "background: white;"
});

const ball = E.createObject({
  width: "10",
  height: "10",
  position: { left: 490, top: 200 },
  style: "background: white; border-radius: 10px;"
});

const ground = E.createObject({
  width: "600",
  height: "10",
  position: { left: 0, top: 290 },
  style: "background: yellow;"
});

document.addEventListener("keyup", e => {
  // d
  if (e.keyCode === 68) {
    const { left, top } = E.getObjectPos(self);
    E.setObjectPosAnimation(self, {
      keyframes: [
        {
          time: 100,
          positionStart: { left, top },
          positionEnd: { left: left + 25, top: top }
        }
      ]
    });
  }
  // a
  if (e.keyCode === 65) {
    const { left, top } = E.getObjectPos(self);
    E.setObjectPosAnimation(self, {
      keyframes: [
        {
          time: 100,
          positionStart: { left, top },
          positionEnd: { left: left - 25, top: top }
        }
      ]
    });
  }
  // w
  if (e.keyCode === 87) {
    const { left, top } = E.getObjectPos(self);
    E.setObjectPosAnimation(self, {
      keyframes: [
        {
          time: 200,
          positionStart: { left, top },
          positionEnd: { left, top: top - 75 }
        },
        {
          time: 200,
          positionStart: { left, top: top - 75 },
          positionEnd: { left, top }
        }
      ]
    });
  }

  // j 轻击
  if (e.keyCode === 74) {
    const { left, top } = E.getObjectPos(ball);
  }
  // k 重击
  if (e.keyCode === 75) {
    const { left, top } = E.getObjectPos(ball);
  }
});

function gamestart() {
  const { left, top } = E.getObjectPos(self);
  const { left: leftBall, top: topBall } = E.getObjectPos(ball);
  console.log('Ball', leftBall, topBall);
  console.log('self', left, top);
  console.log('web', webPos);

  const inter = 30;
  const arr = curveGen(
    [
      { x: leftBall, y: 300 - topBall },
      { x: webPos.left, y: 300 - webPos.top - 20 },
      { x: left + 40, y: 20 }
    ],
    inter
  );

  console.log('arr', arr);
  const keyframes = [];

  for (let i = 0; i < inter; i++) {
    keyframes.push({
      time: 30,
      positionStart:
        i > 0
          ? { left: arr[i - 1].x, top: 300 - arr[i - 1].y }
          : { left: leftBall, top: topBall },
      positionEnd: { left: arr[i].x, top: 300 - arr[i].y }
    });
  }

  E.setObjectPosAnimation(ball, {
    keyframes
  });

  function curveGen(points, inter) {
    const { aaa, bbb, ccc } = calcParam(points);
    const xd = points[0].x - points[2].x;
    const arr = [];

    for (let i = 1; i <= inter; i++) {
      const x = points[0].x - (xd / inter) * i;
      arr.push({ x, y: aaa * x * x + bbb * x + ccc });
    }

    return arr;

    // 计算曲线的三个系数
    function calcParam() {
      let aaa, bbb, ccc;
      let x1 = points[0].x,
        x2 = points[1].x,
        x3 = points[2].x,
        y1 = points[0].y,
        y2 = points[1].y,
        y3 = points[2].y;

      bbb =
        ((y1 - y2) * (x2 * x2 - x3 * x3) - (y2 - y3) * (x1 * x1 - x2 * x2)) /
        ((x2 * x2 - x3 * x3) * (x1 - x2) - (x1 * x1 - x2 * x2) * (x2 - x3));
      aaa = (y1 - y2 - (x1 - x2) * bbb) / (x1 * x1 - x2 * x2);
      ccc = (y1 + y2 - aaa * (x1 * x1 + x2 * x2) - bbb * (x1 + x2)) / 2;
      return { aaa, bbb, ccc };
    }
  }
}
