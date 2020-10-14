// Canvas setup

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Drawing shape on canvas

const draw = (x, y, width, height, angle) => {

  const scaleText = document.getElementById('canvas-scale')
  if (width > canvas.width - 20 || height > canvas.height - 20) {
    const differences = [canvas.width - 20 - width, canvas.height - 20 - height];
    const scale = (Math.min(...differences) === differences[0]) ? 
      Math.ceil(width / (canvas.width - 20) * 2) / 2:
      Math.ceil(height / (canvas.height - 20) * 2) / 2;

    width *= 1 / scale;
    height *= 1 / scale;
    
    scaleText.innerHTML = `1:${Math.round(scale * 100) / 100}`;
  } else scaleText.innerHTML = '1:1';

  x = canvas.width / 2 - width / 2;
  y = canvas.height / 2 - height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let grd = ctx.createLinearGradient(...canvasGradient(x, y, width, height, angle));
  grd.addColorStop(0, 'rgba(110, 0, 149, 0.7)');
  grd.addColorStop(1, 'rgba(27, 13, 52, 0.4)');

  ctx.fillStyle = grd;
  ctx.fillRect(x,y,width,height);
}

// Color slider

const slider = document.getElementById('slider');

const colorStopValues = [];

function ColorStop(pos) {

  const values = {
    pos,
    color: null
  }

  let currentColorStopIndex;

  if (colorStopValues.length === 0) {
    colorStopValues.push(values);
    currentColorStopIndex = 0;
  } else {
    for (let i = 0; i < colorStopValues.length; i++) {
      if (pos < colorStopValues[i].pos) {
        currentColorStopIndex = i;
        break;
      }
    }
    if (currentColorStopIndex !== undefined)
      colorStopValues.splice(currentColorStopIndex, 0, values);
    else {
      colorStopValues.push(values);
      currentColorStopIndex = colorStopValues.length - 1;
    }
  }

  const currentColorStop = colorStopValues[currentColorStopIndex];

  if (colorStopValues.length < 3)
    this.color = [255,255,255,1];
  else {
    const predecessor = colorStopValues[currentColorStopIndex - 1];
    const successor = colorStopValues[currentColorStopIndex + 1];
    if (predecessor === undefined || successor === undefined)
      this.color = (predecessor === undefined) ? 
        successor.color:
        predecessor.color;
    else
      this.color = predecessor.color.map((val, index) => {
        const fullDifference = successor.pos - predecessor.pos;
        const partDifference = currentColorStop.pos - predecessor.pos;
        const posPercentage = partDifference / fullDifference;

        const colorDifference = successor.color[index] - predecessor.color[index];
        const finalColor = (index !== 3) ? 
          Math.round(predecessor.color[index] + (colorDifference * posPercentage)):
          parseFloat((predecessor.color[index] + (colorDifference * posPercentage)).toFixed(2));

        return finalColor;
      });
  }

  currentColorStop.color = this.color;

  this.pos = pos;
}

slider.addEventListener('click', e => {
  const newColorStop = new ColorStop(e.offsetX);
  console.log(colorStopValues);
});

// Scaling and layout of the canvas element

const widthInput = document.getElementById('width-input');
const heightInput = document.getElementById('height-input');
const angleInput = document.getElementById('angle-input');

const showcaseVals = () => [
  0,
  0,
  parseInt(widthInput.value), 
  parseInt(heightInput.value), 
  parseInt(angleInput.value)
];

let hasFocus = null;
window.addEventListener('focusin', e => {
  if (e.target.classList.contains('panel-input')) {
    hasFocus = e.target.id;
  }
});

window.addEventListener('focusout', e => {
  if (e.target.id === hasFocus) hasFocus = null;
});

window.addEventListener('keydown', e => {
  if (e.code === 'Enter' && hasFocus !== null) draw(...showcaseVals());
});

let w, h;
const showcaseShadow = document.getElementById('showcase-shadow');
const canvasCover = document.getElementById('canvas-cover');
const panel = document.getElementById('panel');
const sizing = () => {
  w = document.body.clientWidth;
  h = window.innerHeight;

  if (w < 720) {
    canvas.width = w;
    canvas.height = canvas.width / 2;

    showcaseShadow.style.display = 'none';
    canvas.classList.remove('canvas-border');
    canvas.classList.remove('canvas-large');
    canvasCover.classList.remove('canvas-large');
    panel.classList.add('panel-small');
  } else {
    if (h - 90 > w / 2 - 30) {
      canvas.width = canvas.height = w / 2 - 30;
    } else {
      canvas.width = w / 2 - 30;
      canvas.height = h - 90;
    }

    showcaseShadow.style.display = 'inline';
    canvas.classList.add('canvas-border');
    canvas.classList.add('canvas-large');
    canvasCover.classList.add('canvas-large');
    panel.classList.remove('panel-small');
  }

  document.documentElement.style.setProperty('--w', `${w}px`);
  document.documentElement.style.setProperty('--canvas-width', `${canvas.width}px`);
  document.documentElement.style.setProperty('--canvas-height', `${canvas.height}px`);

  draw(...showcaseVals());
}
sizing();

window.addEventListener('resize', sizing);

draw(...showcaseVals());
