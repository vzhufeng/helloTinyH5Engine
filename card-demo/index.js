

window.addEventListener(
  "onorientationchange" in window ? "orientationchange" : "resize",
  function () {
    if (window.orientation == 180 || window.orientation == 0) {
      console.log("竖屏状态！");
    }
    if (window.orientation == 90 || window.orientation == -90) {
      console.log("横屏状态！");
    }
  },
  false
);

const E = new tinyEngine();

E.createScene({
  width: "100%",
  height: "100vh",
  bgColor: "yellow"
});

const self = E.createObject({
  width: 60,
  height: 60,
  style: "left: calc(50% - 30px); top: 0; background: white;"
});

const opponent = E.createObject({
  width: 60,
  height: 60,
  style: "left: calc(50% - 30px); bottom: 0; background: white;"
});

const allCards = cardGen();

const selfCards = pickCard(allCards);
