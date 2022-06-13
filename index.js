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

  let sideLength = 29;
  let currentStep = 0;

  let polygons = new Array(16).fill(0);

  const tick = () => {
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

  const drawPolygon = (numberOfSides) => {
    cartesianCtx.strokeStyle = COLORS[numberOfSides % COLORS.length]

    cartesianCtx.beginPath();
    for (let currentSide = 0; currentSide <= numberOfSides; currentSide ++) {
      addSideToPath(currentSide, numberOfSides);
    };
    cartesianCtx.stroke();
  };

  const addSideToPath = (currentSide, numberOfSides) => {
    let startPointOfSide = findX(currentSide, numberOfSides);
    let endPointOfSide = findY(currentSide, numberOfSides);
    cartesianCtx.lineTo(startPointOfSide, endPointOfSide);
  };

  const findX = (currentSide, numberOfSides) => {
    let mult = 2 * currentSide/numberOfSides
    let answer = Math.sin(mult * Math.PI)
    return CENTER.x + (answer * sideLength * numberOfSides);
  };

  const findY = (currentSide, numberOfSides) => {
    let mult = 2 * currentSide/numberOfSides;
    let answer = Math.cos(mult * Math.PI);
    return CENTER.y + (answer * sideLength * numberOfSides);
  };

  const drawDot = (e, sides, currentStep) => {
    let thisSideStart = Math.floor(e);
    let thisSideEnd = thisSideStart + 1;
    let a = [
      findX(thisSideStart, sides),
      findY(thisSideStart, sides)
    ];
    let b = [
      findX(thisSideEnd, sides),
      findY(thisSideEnd, sides)
    ];
    if (sides === 3) {
    };
    let between = betweenPoint(a, b, currentStep);
    cartesianCtx.beginPath();
    cartesianCtx.arc(between[0], between[1], 7, 0, CIRCUM);
    cartesianCtx.fillStyle = 'rgb(255,255,255)';
    cartesianCtx.fill();
  }

  const betweenPoint = (a, b, currentStep) => {
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
