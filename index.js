const COLORS = [
  'rgb(255, 0, 0)',
  'rgb(255, 127, 0)',
  'rgb(255, 255, 0)',
  'rgb(0, 255, 0)',
  'rgb(0, 255, 255)',
  'rgb(0, 0, 255)',
  'rgb(127, 0, 255)'
];
const WHITE = 'rgb(255, 255, 255)';
const CIRCUM = 2 * Math.PI;

export const renderPolygonRaceInElement = (parentContainerId) => {
  const canvasConfig = {
    height: 900,
    width: 1200,
    parentContainerId: parentContainerId,
  };
  const maxSteps = 12;
  const cartesianCtx = setUpCanvasContext(canvasConfig);
  const sideLength = 29;

  const polygons = [];
  for (let numberOfSides = 3; numberOfSides < 16; numberOfSides++) {
    polygons.push({
      numberOfSides: numberOfSides,
      currentSide: 0,
    });
  }

  let currentStep = 1;

  const tick = () => {
    clearScreen();

    polygons.forEach(polygon => {
      drawPolygon(polygon.numberOfSides);
      drawDot(polygon.currentSide, polygon.numberOfSides, currentStep);
    });

    if (currentStep === maxSteps) {
      polygons.forEach(polygon => {
        polygon.currentSide ++;
      });
    }

    currentStep < maxSteps
      ? currentStep ++
      : currentStep = 1;

    window.requestAnimationFrame(tick);
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

  const drawDot = (currentSide, numberOfSides, currentStep) => {
    const startPoint = getPoint(currentSide, numberOfSides)
    const endPoint = getPoint(currentSide + 1, numberOfSides)
    const dotPoint = betweenPoint(startPoint, endPoint, currentStep);
    cartesianCtx.beginPath();
    cartesianCtx.arc(dotPoint.x, dotPoint.y, 7, 0, CIRCUM);
    cartesianCtx.fillStyle = WHITE;
    cartesianCtx.fill();
  }

  const addSideToPath = (currentSide, numberOfSides) => {
    const point = getPoint(currentSide, numberOfSides);
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

  const betweenPoint = (a, b, steps) => {
    let distanceAlongLine = (steps - 1)/maxSteps
    let between = {};
    between.x = a.x + distanceAlongLine * (b.x - a.x);
    between.y = a.y + distanceAlongLine * (b.y - a.y);
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
