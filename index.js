export const renderPolygonRaceInElement = (parentContainerId) => {
  const HEIGHT = 900;
  const WIDTH = 1200;
  const COLORS = [
    'rgb(255, 0, 0)',
    'rgb(255, 127, 0)',
    'rgb(255, 255, 0)',
    'rgb(0, 255, 0)',
    'rgb(0, 255, 255)',
    'rgb(0, 0, 255)',
    'rgb(127, 0, 255)'
  ];

  let canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  addCanvasToElement(canvas, parentContainerId);

  cartesianCtx = getCartesianContext(canvas);

  const c = {x: WIDTH/2, y: HEIGHT/2};
  const steps = 12;

  let u = 80;
  let circum = 2 * Math.PI
  let step = 0;
  cartesianCtx.lineWidth = 3;

  let polygons = new Array(16).fill(0);

  function tick() {
    cartesianCtx.clearRect(0,0,WIDTH,HEIGHT);
    polygons.forEach(function(e, idx, a) {
      if (!(idx < 3)) {
        draw(idx);
        drawDot(e/steps, idx, step);
        a[idx] ++;
        if (a[idx] === idx * steps) {a[idx] = 0}
      }
    })
    step ++;
    if (step === steps) {step = 0}
    window.requestAnimationFrame(tick);
  };

  function findX(i, sides) {
    let mult = (2 * i/sides)
    let answer = Math.round(100000 * Math.sin(mult * Math.PI))/100000;
    return answer * u;
  };

  function findY(i, sides) {
    let mult = (2 * i/sides);
    let answer = Math.round(100000 * Math.cos(mult * Math.PI))/100000;
    return answer * u;
  };

  function betweenPoint(a, b, step) {
    let d = step/steps
    let between = [];
    between[0] = a[0] + d * (b[0] - a[0]);
    between[1] = a[1] + d * (b[1] - a[1]);
    return between;
  }

  function draw(sides) {
    cartesianCtx.beginPath();
    for (let i = 0; i <= sides; i ++) {
      let x = c.x + findX(i, sides) * sides/3;
      let y = c.y + findY(i, sides) * sides/3;
      cartesianCtx.lineTo(x, y);
    };
    cartesianCtx.strokeStyle = COLORS[(sides)%COLORS.length] //(sides+cycle)%COLORS.length
    cartesianCtx.stroke();

  };

  function drawDot(e, sides, step) {
    let thisSideStart = Math.floor(e);
    let thisSideEnd = thisSideStart + 1;
    let a = [
      c.x + findX(thisSideStart, sides) * sides/3,
      c.y + findY(thisSideStart, sides) * sides/3
    ];
    let b = [
      c.x + findX(thisSideEnd, sides) * sides/3,
      c.y + findY(thisSideEnd, sides) * sides/3
    ];
    if (sides === 3) {
    };
    let between = betweenPoint(a, b, step);
    cartesianCtx.beginPath();
    cartesianCtx.arc(between[0], between[1], 7, 0, circum);
    cartesianCtx.fillStyle = 'rgb(255,255,255)';
    cartesianCtx.fill();
  }

  window.requestAnimationFrame(tick);
}

addCanvasToElement = (canvas, elementId) => {
  const parentContainer = document.getElementById(elementId);
  parentContainer.append(canvas);
};

getCartesianContext = (canvas) => {
  let ctx = canvas.getContext('2d');
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  return ctx;
};
