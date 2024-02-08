// Canvas setup

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Drawing shape on canvas

const stops = [];

const widthInput = document.getElementById('width-input');
const heightInput = document.getElementById('height-input');
const angleInput = document.getElementById('angle-input');

const codeText = document.getElementById('code-text');

const draw = () => {
  let width = parseInt(widthInput.value);
  let height = parseInt(heightInput.value);
  let angle = parseInt(angleInput.value);

  let trueWidth = width;
  let trueHeight = height;

  if (isNaN(width) || isNaN(height) || isNaN(angle)) return;

  const scaleText = document.getElementById('canvas-scale')
  if (width > canvas.width - 20 || height > canvas.height - 20) {
    const differences = [canvas.width - 20 - width, canvas.height - 20 - height];
    const scale = (Math.min(...differences) === differences[0]) ? 
      Math.ceil(width / (canvas.width - 20) * 2) / 2:
      Math.ceil(height / (canvas.height - 20) * 2) / 2;

    width *= 1 / scale;
    height *= 1 / scale;
    
    scaleText.innerHTML = `Scale 1:${Math.round(scale * 100) / 100}`;
  } else scaleText.innerHTML = 'Scale 1:1';

  const x = canvas.width / 2 - width / 2;
  const y = canvas.height / 2 - height / 2;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradientVals = gradient(width, height, angle);
  const grd = ctx.createLinearGradient(...gradientVals);

  let stopText = '';

  for (const stop of stops) {
    grd.addColorStop(stop.posPercentage, `rgba(${stop.color.toString()})`);
    stopText += `<span class="code-green">gradient</span><span class="code-purple">.</span><span class="code-blue">addColorStop</span><span class="code-purple">(</span><span class="code-orange">${Math.round((stop.posPercentage + Number.EPSILON) * 100) / 100}</span><span class="code-purple">,</span> <span class="code-beige">'rgba(${stop.color.toString().split(',').join(', ')})'</span><span class="code-purple">)</span>;<br>`;
  }

  document.getElementById('code-stops').innerHTML = stopText;

  ctx.shadowColor = 'rgb(230,230,230)';
  ctx.shadowBlur = 15;

  ctx.fillStyle = grd;
  ctx.fillRect(x,y,width,height);

  document.getElementById('code-gradient').innerHTML = gradientVals.toString().split(',').map(s => `<span class="code-orange">${s}</span>`).join('<span class="code-purple">,</span> ');
  document.getElementById('code-dimensions').innerHTML = `<span class="code-orange">${trueWidth}<span class="code-purple">,</span> <span class="code-orange">${trueHeight}</span>`;
}

// Color slider

const slider = document.getElementById('slider');
const sliderStyle = window.getComputedStyle(slider);

const colorStopValues = [];

class ColorStop {
  constructor(pos, color, callback) {    
    this.pos = pos;
    this.posPercentage = pos / parseInt(sliderStyle.getPropertyValue('width'));
    this.color = color;
    this.elContainer = null;
    this.timestamp = null;
    this.callback = callback;
  }

  createStop() {
    let currentColorStopIndex;
    this.timestamp = Date.now();

    const values = {
      pos: this.pos,
      posPercentage: this.posPercentage,
      color: this.color,
      timestamp: this.timestamp
    };

    if (colorStopValues.length === 0) {
      colorStopValues.push(values);
      currentColorStopIndex = 0;
    } else {
      for (let i = 0; i < colorStopValues.length; i++) {
        if (this.pos < colorStopValues[i].pos) {
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

    if (!this.color) {
      if (colorStopValues.length < 3)
        this.color = [255, 255, 255, 1];
      else {
        const predecessor = colorStopValues[currentColorStopIndex - 1];
        const successor = colorStopValues[currentColorStopIndex + 1];
        if (predecessor === undefined || successor === undefined)
          this.color = (predecessor === undefined) ?
            successor.color :
            predecessor.color;
        else {
          const fullDifference = successor.pos - predecessor.pos;
          const partDifference = currentColorStop.pos - predecessor.pos;
          const posPercentage = partDifference / fullDifference;

          this.color = predecessor.color.map((v, index) => {
            const val = parseFloat(v);
            const colorDifference = successor.color[index] - val;
            
            const finalColor = (index !== 3) ?
              Math.round(val + (colorDifference * posPercentage)) :
              parseFloat((val + (colorDifference * posPercentage))).toFixed(2);

            return finalColor;
          });
        }
      }
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
    colorStopElem.style.left = colorStopElemArrow.style.left = `calc(${this.pos / sliderWidth} * 100% - 10px)`;
  
    colorStopElemContainer.appendChild(colorStopElem);
    colorStopElemContainer.appendChild(colorStopElemArrow);
    slider.appendChild(colorStopElemContainer);

    this.elContainer = colorStopElemContainer;
    if (this.callback) this.callback(this.elContainer);

    let backgroundString = '';
    for (let i = 0; i < colorStopValues.length; i++) {
      if (backgroundString !== '') backgroundString += ',';
      backgroundString += `rgba(${colorStopValues[i].color}) ${colorStopValues[i].posPercentage * 100}%`;
    }

    slider.style.background = `linear-gradient(90deg, ${backgroundString})`;
    draw();
  }

  removeStop() {
    this.elContainer.remove();
    for (let i = 0; i < colorStopValues.length; i++) {
      if (colorStopValues[i].timestamp === this.timestamp) {
        colorStopValues.splice(i, 1);
        break;
      }
    }
  }

  updateColor(c) {
    this.color = c.split(', ').map(n => parseFloat(n));
    this.removeStop();
    this.createStop();
  }

  updatePos(pos) {
    this.pos = pos;
    this.posPercentage = pos / parseInt(sliderStyle.getPropertyValue('width'));

    this.removeStop();
    this.createStop();
  }
}

const colorPicker = new ColorPicker();
const colorPickerEl = document.getElementById('color-picker');
document.getElementById('picker-close').addEventListener('click', () => {
  colorPickerEl.style.display = 'none';
});

function sliderHandler(e, edge, color) {
  let colorStopElem;

  const colorPickerHandler = () => {
    colorPicker.set(colorStop);

    colorPickerEl.style.display = 'block';
  }

  let sliderRect = slider.getBoundingClientRect();

  const colorStopMoveHandler = () => {
    const colorStopPositioner = e => {
      sliderRect = slider.getBoundingClientRect();
      let pos = e.clientX - sliderRect.x;
      pos = Math.max(pos, 0);
      pos = Math.min(pos, sliderRect.width);
      colorStop.updatePos(pos);

      colorStopElem = colorStop.elContainer;
      //colorStopElem.addEventListener('click', colorPickerHandler);
    }

    window.addEventListener('mousemove', colorStopPositioner);

    window.addEventListener('mouseup', () => {
      window.removeEventListener('mousemove', colorStopPositioner);
      colorStopElem.addEventListener('mousedown', colorStopMoveHandler, { once: true })
    }, { once: true });
  }

  const setColorStopElem = el => {
    colorStopElem = el;
    colorStopElem.addEventListener('click', colorPickerHandler);
    colorStopElem.addEventListener('mousedown', colorStopMoveHandler, { once: true });
  }

  let colorStop;

  if (edge === 'start') {
    colorStop = new ColorStop(0, null, setColorStopElem);
  } else if (edge === 'end') {
    colorStop = new ColorStop(sliderRect.width, null, setColorStopElem);
  } else {
    colorStop = new ColorStop(e.offsetX, null, setColorStopElem);
  }

  stops.push(colorStop);
  if (color) colorStop.color = color;
  colorStop.createStop();
}
/**
 * 
 *
const gradient = context.createLinearGradient(0, 165, 30, 135);
    
gradient.addColorStop(0, 'rgba(255, 255, 0, 1)');
gradient.addColorStop(0.8, 'rgba(0, 188, 212, 1)');
gradient.addColorStop(1, 'rgba(238, 130, 238, 1)');
        
context.fillStyle = grad;
context.fillRect(0, 0);

/**
 * 
 */

slider.addEventListener('click', e => {
  if (e.target.id !== 'slider') return;

  sliderHandler(e);
});

const sliderWidth = parseInt(sliderStyle.getPropertyValue('width'));

sliderHandler(null, 'start', [255,0,0,1]);
setTimeout(() => {
  sliderHandler(null, 'end', [255,255,255,1]);
}, 0)

/*const c1 = new ColorStop(0, [255,0,0,1]);
c1.createStop();
stops.push(c1);

const c2 = new ColorStop(sliderWidth, [255,255,255,1]);
c2.createStop();
stops.push(c2);*/

// Scaling and layout of the canvas element

window.addEventListener('keyup', e => {
  if (e.target.classList.contains('panel-input')) {
    let val;

    if (!isNaN(parseInt(e.target.value))) {
      e.target.value = val = parseInt(e.target.value);
    } else {
      e.target.value = '';
    }

    if (val) {
      draw();
    }
  }
});

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
  if (e.code === 'Enter' && hasFocus !== null) draw();
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

    //showcaseShadow.style.display = 'inline';
    canvas.classList.add('canvas-border');
    canvas.classList.add('canvas-large');
    canvasCover.classList.add('canvas-large');
    panel.classList.remove('panel-small');
  }

  document.documentElement.style.setProperty('--w', `${w}px`);
  document.documentElement.style.setProperty('--canvas-width', `${canvas.width}px`);
  document.documentElement.style.setProperty('--canvas-height', `${canvas.height}px`);

  draw();
}
sizing();

window.addEventListener('resize', sizing);

draw();
