// Canvas setup

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 500;
canvas.height = 500;

const draw = (x, y, width, height, angle) => {
  let grd = ctx.createLinearGradient(...canvasGradient(x, y, width, height, angle));
  grd.addColorStop(0, "red");
  grd.addColorStop(1, "white");

  ctx.fillStyle = grd;
  ctx.fillRect(x,y,width,height);
}

const panelForm = document.getElementById('panel-form');
const xInput = document.getElementById('x-input');
const yInput = document.getElementById('y-input');
const widthInput = document.getElementById('width-input');
const heightInput = document.getElementById('height-input');
const angleInput = document.getElementById('angle-input');

panelForm.addEventListener('submit', e => {
  e.preventDefault();
  draw(parseInt(xInput.value),
       parseInt(yInput.value),
       parseInt(widthInput.value), 
       parseInt(heightInput.value), 
       parseInt(angleInput.value));
});

draw(parseInt(xInput.value),
       parseInt(yInput.value),
       parseInt(widthInput.value), 
       parseInt(heightInput.value), 
       parseInt(angleInput.value));