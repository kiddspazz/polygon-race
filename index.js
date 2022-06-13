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
  const maxSteps = 12;

  const cartesianCtx = setUpCanvasContext(canvasConfig)

  let sideLength = 29;
  let currentStep = 0;

  let polygons = new Array(16).fill(0);

  const tick = () => {
    clearScreen()

    // TODO: Make this cleaner
    polygons.forEach((e, numberOfSides) => {
      if (!(numberOfSides < 3)) {
        drawPolygon(numberOfSides);
        drawDot(e/maxSteps, numberOfSides, currentStep);
        polygons[numberOfSides] ++;
        if (polygons[numberOfSides] === numberOfSides * maxSteps) {
          polygons[numberOfSides] = 0;
        }
      }
    })

    currentStep + 1 !== maxSteps
      ? currentStep ++
      : currentStep = 0;
    window.requestAnimationFrame(tick)
  };

  const clearScreen = () => {
    cartesianCtx.clearRect(
      -canvasConfig.width/2,
      -canvasConfig.height/2,
      canvasConfig.width,
      canvasConfig.height,
    );
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
    let point = getPoint(currentSide, numberOfSides);
    cartesianCtx.lineTo(point.x, point.y);
  };

  const getPoint = (currentSide, numberOfSides) => {
    const howFarAroundTheCircle = 2 * currentSide/numberOfSides;
    const unitCircleX = Math.sin(howFarAroundTheCircle * Math.PI);
    const sameDiameterCircleX = unitCircleX * sideLength;
    const sizedByNumberOfSidesCircleX = sameDiameterCircleX * numberOfSides;

    const unitCircleY = Math.cos(howFarAroundTheCircle * Math.PI);
    const sameDiameterCircleY = unitCircleY * sideLength;
    const sizedByNumberOfSidesCircleY = sameDiameterCircleY * numberOfSides;

    return {x: sizedByNumberOfSidesCircleX, y: sizedByNumberOfSidesCircleY};
  };

  const drawDot = (e, sides, currentStep) => {
    let thisSideStart = Math.floor(e);
    let thisSideEnd = thisSideStart + 1;
    let a = getPoint(thisSideStart, sides)
    let b = getPoint(thisSideEnd, sides)
    let between = betweenPoint(a, b, currentStep);
    cartesianCtx.beginPath();
    cartesianCtx.arc(between[0], between[1], 7, 0, CIRCUM);
    cartesianCtx.fillStyle = 'rgb(255,255,255)';
    cartesianCtx.fill();
  }

  const betweenPoint = (a, b, currentStep) => {
    let d = currentStep/maxSteps
    let between = [];
    between[0] = a.x + d * (b.x - a.x);
    between[1] = a.y + d * (b.y - a.y);
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
  ctx.translate(canvas.width/2, canvas.height/2);
  ctx.scale(1, -1);
  return ctx;
};
