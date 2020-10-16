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
const sliderStyle = window.getComputedStyle(slider);

const colorStopValues = [];

function ColorStop(pos, color) {

  const values = {
    pos,
    posPercentage: pos / parseInt(sliderStyle.getPropertyValue('width')),
    color
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

  if (!color) {
    if (colorStopValues.length < 3)
      this.color = [255,255,255,1];
    else {
      const predecessor = colorStopValues[currentColorStopIndex - 1];
      const successor = colorStopValues[currentColorStopIndex + 1];
      if (predecessor === undefined || successor === undefined)
        this.color = (predecessor === undefined) ? 
          successor.color:
          predecessor.color;
      else {
        const fullDifference = successor.pos - predecessor.pos;
        const partDifference = currentColorStop.pos - predecessor.pos;
        const posPercentage = partDifference / fullDifference;

        this.color = predecessor.color.map((val, index) => {
          const colorDifference = successor.color[index] - val;
          const finalColor = (index !== 3) ? 
            Math.round(val + (colorDifference * posPercentage)):
            parseFloat((val + (colorDifference * posPercentage)).toFixed(2));

          return finalColor;
        });
      }
    }
  } else {
    this.color = color;
  }

  currentColorStop.color = this.color;

  const colorStopElemContainer = document.createElement('div');
  const colorStopElem = document.createElement('div');
  const colorStopElemArrow = document.createElement('div');
  const sliderWidth = parseInt(sliderStyle.getPropertyValue('width'));
  colorStopElemContainer.classList.add('color-stop-container');
  colorStopElem.classList.add('color-stop');
  colorStopElemArrow.classList.add('color-stop-arrow');
  colorStopElem.style.backgroundColor = `rgba(${this.color})`;
  colorStopElem.style.left = colorStopElemArrow.style.left = `calc(${pos / sliderWidth} * 100% - 10px)`;
  slider.appendChild(colorStopElemContainer);
  colorStopElemContainer.appendChild(colorStopElem);
  colorStopElemContainer.appendChild(colorStopElemArrow);
  
  let backgroundString = '';
  for (let i = 0; i < colorStopValues.length; i++) {
    if (backgroundString !== '') backgroundString += ',';
    backgroundString += `rgba(${colorStopValues[i].color}) ${colorStopValues[i].posPercentage * 100}%`;
  }

  slider.style.background = `linear-gradient(90deg, ${backgroundString})`;

  this.pos = pos;
}

slider.addEventListener('click', e => {
  const newColorStop = new ColorStop(e.offsetX, null);  
});

const sliderWidth = parseInt(sliderStyle.getPropertyValue('width'));

new ColorStop(0, [255,0,0,1]);
new ColorStop(sliderWidth, [255,255,255,1]);

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
