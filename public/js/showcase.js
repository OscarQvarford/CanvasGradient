// Canvas setup

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const draw = (x, y, width, height, angle) => {
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
const sizing = () => {
  w = window.innerWidth;
  h = window.innerHeight;

  if (w < 1000) {
    canvas.width = w;
    canvas.classList.remove('canvas-border');
  } else {
    canvas.width = w - (w - 1000);
    canvas.classList.add('canvas-border');
  }

  canvas.height = canvas.width / 2;
  draw(...showcaseVals());
}
sizing();

window.addEventListener('resize', sizing);

draw(...showcaseVals());