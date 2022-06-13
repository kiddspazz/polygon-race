const COLORS = [
  'rgb(255, 0, 0)',
  'rgb(255, 127, 0)',
  'rgb(255, 255, 0)',
  'rgb(0, 255, 0)',
  'rgb(0, 255, 255)',
  'rgb(0, 0, 255)',
  'rgb(127, 0, 255)'
];

const CIRCUM = 2 * Math.PI;

export const renderPolygonRaceInElement = (parentContainerId) => {
  const canvasConfig = {
    height: 900,
    width: 1200,
    parentContainerId: parentContainerId,
  };
  const CENTER = {x: canvasConfig.width/2, y: canvasConfig.height/2};
  const maxSteps = 12;

  const cartesianCtx = setUpCanvasContext(canvasConfig)

  let sideLength = 80;
  let currentStep = 0;

  let polygons = new Array(16).fill(0);

  function tick() {
    clearScreen()

    // TODO: Make this cleaner
    polygons.forEach((e, idx, a) => {
      if (!(idx < 3)) {
        drawPolygon(idx);
        drawDot(e/maxSteps, idx, currentStep);
        a[idx] ++;
        if (a[idx] === idx * maxSteps) {a[idx] = 0}
      }
    })

    currentStep + 1 !== maxSteps
      ? currentStep ++
      : currentStep = 0;
    window.requestAnimationFrame(tick)
  };

  const clearScreen = () => {
    cartesianCtx.clearRect(0, 0, canvasConfig.width, canvasConfig.height);
  };

  function drawPolygon(numberOfSides) {
    cartesianCtx.beginPath();
    for (let currentSide = 0; currentSide <= numberOfSides; currentSide ++) {
      let x = CENTER.x + findX(currentSide, numberOfSides);
      let y = CENTER.y + findY(currentSide, numberOfSides);
      cartesianCtx.lineTo(x, y);
    };
    cartesianCtx.strokeStyle = COLORS[(numberOfSides)%COLORS.length]
    cartesianCtx.stroke();
  };

  function findX(i, sides) {
    let mult = (2 * i/sides)
    let answer = Math.round(100000 * Math.sin(mult * Math.PI))/100000;
    return answer * sideLength * sides/3;
  };

  function findY(i, sides) {
    let mult = (2 * i/sides);
    let answer = Math.round(100000 * Math.cos(mult * Math.PI))/100000;
    return answer * sideLength * sides/3;
  };

  function drawDot(e, sides, currentStep) {
    let thisSideStart = Math.floor(e);
    let thisSideEnd = thisSideStart + 1;
    let a = [
      CENTER.x + findX(thisSideStart, sides),
      CENTER.y + findY(thisSideStart, sides)
    ];
    let b = [
      CENTER.x + findX(thisSideEnd, sides),
      CENTER.y + findY(thisSideEnd, sides)
    ];
    if (sides === 3) {
    };
    let between = betweenPoint(a, b, currentStep);
    cartesianCtx.beginPath();
    cartesianCtx.arc(between[0], between[1], 7, 0, CIRCUM);
    cartesianCtx.fillStyle = 'rgb(255,255,255)';
    cartesianCtx.fill();
  }

  function betweenPoint(a, b, currentStep) {
    let d = currentStep/maxSteps
    let between = [];
    between[0] = a[0] + d * (b[0] - a[0]);
    between[1] = a[1] + d * (b[1] - a[1]);
    return between;
  }

  window.requestAnimationFrame(tick);
}

const setUpCanvasContext = (config) => {
  let canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;

  addCanvasToElement(canvas, config.parentContainerId);
  const cartesianCtx = getCartesianContext(canvas);
  cartesianCtx.lineWidth = 3;
  return cartesianCtx;
};

const addCanvasToElement = (canvas, elementId) => {
  const parentContainer = document.getElementById(elementId);
  parentContainer.append(canvas);
};

const getCartesianContext = (canvas) => {
  let ctx = canvas.getContext('2d');
  ctx.translate(0, canvas.height);
  ctx.scale(1, -1);
  return ctx;
};
