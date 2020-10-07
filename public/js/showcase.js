// Canvas setup

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

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

const panelForm = document.getElementById('panel-form');
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

panelForm.addEventListener('submit', e => {
  e.preventDefault();
  draw(...showcaseVals());
});

let w, h;
const canvasCover = document.getElementById('canvas-cover');
const sizing = () => {
  w = document.body.clientWidth;
  h = document.body.clientHeight;

  if (w < 720) {
    canvas.width = w;
    canvas.classList.remove('canvas-border');
    canvas.classList.remove('canvas-large');
    canvasCover.classList.remove('canvas-large');
    canvas.height = canvas.width / 2;
  } else {
    canvas.width = w / 2 - 20;
    canvas.classList.add('canvas-border');
    canvas.classList.add('canvas-large');
    canvasCover.classList.add('canvas-large');
    canvas.height = canvas.width;
  }

  document.documentElement.style.setProperty('--w', `${w}px`);
  document.documentElement.style.setProperty('--canvas-width', `${canvas.width}px`);
  document.documentElement.style.setProperty('--canvas-height', `${canvas.height}px`);

  draw(...showcaseVals());
}
sizing();

window.addEventListener('resize', sizing);

draw(...showcaseVals());
