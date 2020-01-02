/*
servent

name
attack
heal
mock
charge

======

magic

fn

*/

function cardGen() {
  const arr = {
    servent: [],
    magic: []
  };

  for (let i = 0; i < 10; i++) {
    arr.servent.push({
      name: "随从" + i,
      attack: i,
      heal: i
    });
  }

  return arr;
}

function pickCard() {
  
}
