const COLORS = [
  'rgb(255, 0, 0)',
  'rgb(255, 127, 0)',
  'rgb(255, 255, 0)',
  'rgb(0, 255, 0)',
  'rgb(0, 255, 255)',
  'rgb(0, 0, 255)',
  'rgb(127, 0, 255)',
];
const WHITE = 'rgb(255, 255, 255)';
const CIRCUM = 2 * Math.PI;
const SIDE_LENGTH = 29;
const MAX_STEPS = 12;

const getCartesianContext = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.scale(1, -1);
  return ctx;
};

const addCanvasToElement = (canvas, elementId) => {
  const parentContainer = document.getElementById(elementId);
  parentContainer.append(canvas);
};

const setUpCanvasContext = (config) => {
  const canvas = document.createElement('canvas');
  canvas.width = config.width;
  canvas.height = config.height;

  addCanvasToElement(canvas, config.parentContainerId);
  const cartesianCtx = getCartesianContext(canvas);
  cartesianCtx.lineWidth = 3;
  return cartesianCtx;
};

const clearScreen = (context, config) => {
  context.clearRect(
    -config.width / 2,
    -config.height / 2,
    config.width,
    config.height,
  );
};

const getPoint = (currentSide, numberOfSides) => {
  const howFarAroundTheCircle = (2 * currentSide) / numberOfSides;

  const unitCircleX = Math.sin(howFarAroundTheCircle * Math.PI);
  const sideLengthDiameterCircleX = unitCircleX * SIDE_LENGTH;
  const sizedByNumberOfSidesCircleX = sideLengthDiameterCircleX * numberOfSides;

  const unitCircleY = Math.cos(howFarAroundTheCircle * Math.PI);
  const sideLengthDiameterCircleY = unitCircleY * SIDE_LENGTH;
  const sizedByNumberOfSidesCircleY = sideLengthDiameterCircleY * numberOfSides;

  return { x: sizedByNumberOfSidesCircleX, y: sizedByNumberOfSidesCircleY };
};

const getBetweenPoint = (a, b, currentStep) => {
  const distanceAlongLine = (currentStep - 1) / MAX_STEPS;
  const between = {
    x: a.x + distanceAlongLine * (b.x - a.x),
    y: a.y + distanceAlongLine * (b.y - a.y),
  };
  return between;
};

const drawDot = (polygon, currentStep, context) => {
  const startPoint = getPoint(polygon.currentSide, polygon.numberOfSides);
  const endPoint = getPoint(polygon.currentSide + 1, polygon.numberOfSides);
  const dotPoint = getBetweenPoint(startPoint, endPoint, currentStep);
  context.beginPath();
  context.arc(dotPoint.x, dotPoint.y, 7, 0, CIRCUM);
  context.fillStyle = WHITE;
  context.fill();
};

const addSideToDrawPath = (currentSide, numberOfSides, context) => {
  const point = getPoint(currentSide, numberOfSides);
  context.lineTo(point.x, point.y);
};

const drawPolygon = (numberOfSides, context) => {
  context.strokeStyle = COLORS[numberOfSides % COLORS.length];
  context.beginPath();
  for (let currentSide = 0; currentSide <= numberOfSides; currentSide += 1) {
    addSideToDrawPath(currentSide, numberOfSides, context);
  }
  context.stroke();
};

const renderPolygonRaceInElement = (parentContainerId) => {
  const canvasConfig = {
    height: 900,
    width: 1200,
    parentContainerId,
  };
  const cartesianCtx = setUpCanvasContext(canvasConfig);

  const polygons = [];
  for (let numberOfSides = 3; numberOfSides < 16; numberOfSides += 1) {
    polygons.push({
      numberOfSides,
      currentSide: 0,
    });
  }

  let currentStep = 1;

  const tick = () => {
    clearScreen(cartesianCtx, canvasConfig);

    polygons.forEach((polygon) => {
      drawPolygon(polygon.numberOfSides, cartesianCtx);
      drawDot(polygon, currentStep, cartesianCtx);
    });

    if (currentStep < MAX_STEPS) {
      currentStep += 1;
    } else {
      currentStep = 1;
    }

    if (currentStep === 1) {
      polygons.forEach((_, i) => {
        polygons[i].currentSide += 1;
      });
    }

    window.requestAnimationFrame(tick);
  };

  window.requestAnimationFrame(tick);
};

export default renderPolygonRaceInElement;
