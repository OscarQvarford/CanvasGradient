let mouseIsPressed = false;

const colorBox = document.getElementById('color-box');
const doughnut = document.getElementById('doughnut');
const polychrome = document.getElementById('polychrome');
const polychromeSlider = document.querySelector('#polychrome > .slider');
const transparency = document.getElementById('transparency');
const transparencySlider = document.querySelector('#transparency > .slider');
const rgbaInput = document.getElementById('rgba');
const hexInput = document.getElementById('hex');
let doughnutIsPressed = false;
let cursorIsOut = false;
let polySliderIsPressed = false;
let polySliderIsOut = false;
let transparencySliderIsPressed = false;
let transparencySliderIsOut = false;
let transparencyLevel = 1;

doughnut.style.top = doughnut.style.right = '-8px';

const baseColors = [255, 0, 0];
const colors = [255, 0, 0];

function setBaseColor(y) {
  const style = window.getComputedStyle(polychrome);
  const height = parseInt(style.getPropertyValue('height'));

  const colorPos = (Math.round(y / (height / 256)) / 256 * 1536);
  const colorZone = colorPos / 256;

  if (colorZone <= 1) {
    baseColors[0] = 255;
    baseColors[1] = colorPos;
    baseColors[2] = 0;
  } else if (colorZone < 3) {
    baseColors[1] = 255;

    if (colorZone <= 2) {
      baseColors[0] = 255 - (colorPos - 255);
      baseColors[2] = 0;
    } else {
      baseColors[2] = colorPos - (2 * 255);
      baseColors[0] = 0;
    }
  } else if (colorZone < 5) {
    baseColors[2] = 255;
    
    if (colorZone <= 4) {
      baseColors[1] = 255 - (colorPos - 3 * 255);
      baseColors[0] = 0;
    } else {
      baseColors[0] = colorPos - (4 * 255);
      baseColors[1] = 0;
    }
  } else {
    baseColors[0] = 255;
    baseColors[1] = 0;
    baseColors[2] = 255 - (colorPos - 5 * 255);
  }

  for (let i = 0; i < baseColors.length; i++) {
    if (baseColors[i] > 255) baseColors[i] = 255;
  }

  const colorString = `rgb(${baseColors[0]},${baseColors[1]},${baseColors[2]})`;
  document.documentElement.style.setProperty('--base-color', colorString);
}

function setColor(colorInput) {
  const style = window.getComputedStyle(colorBox);
  const side = parseInt(style.getPropertyValue('width'));
  let colorString;
  let opaqueColorString;

  if (colorInput === undefined) {
    const colorXPos = parseInt(doughnut.style.right) + 8;
    const colorYPos = parseInt(doughnut.style.top) + 8;

    for (let i = 0; i < baseColors.length; i++) {
      colors[i] = Math.abs(Math.round(
        baseColors[i] + ((255 - baseColors[i]) * 
        (((baseColors[i] + 1) / 255) * 
        (255 - ((side - colorXPos) / 
        (side / 256)))) / 
        (baseColors[i] + 1))));
        
      if (baseColors[i] !== 0 || colors[i] !== 0) {
        colors[i] = Math.abs(Math.round(
          (colors[i] - ((colorYPos / side) * colors[i]))
        ));
      }

      if (colorXPos === 0 && baseColors[i] === 0) colors[i] = 0;
      if (colors[i] >= 255) colors[i] = 255;
    }

    if (transparencyLevel.toString() === '1.00') {
      transparencyLevel = 1;
    } else if (transparencyLevel.toString() === '0.00') {
      transparencyLevel = 0; 
    }

    colorString = `rgba(${colors.toString()}, ${transparencyLevel})`;
    opaqueColorString = `rgb(${colors.toString()})`;
    rgbaInput.value = `${`${colors}`.split(',').join(', ')}, ${transparencyLevel}`;

    let hexString = '';

    for (let i = 0; i < colors.length; i++) {
      let hexVal = colors[i].toString(16);
      if (hexVal.length === 1) hexVal = `0${hexVal}`;
      hexString += hexVal;
    }

    if (transparencyLevel !== 1) {
      let hexVal = Math.round(transparencyLevel * 255).toString(16);
      if (hexVal.length === 1) hexVal = `0${hexVal}`;
      hexString += hexVal;
    }

    hexInput.value = hexString.toUpperCase();

  } else {
    const largestValue = Math.max(...colorInput);
    const smallestValue = Math.min(...colorInput);

    doughnut.style.top = `${(((255 - largestValue) / 255) * side) - 8}px`;

    if (largestValue !== smallestValue) {
      doughnut.style.right = `${(side - (((255 - smallestValue) / 255) * side)) - 8}px`;
    } else {
      doughnut.style.right = `${side - 8}px`;
    }

    colorString = `rgba(${colorInput.toString()}, ${transparencyLevel})`;
    opaqueColorString = `rgb(${colorInput.toString()})`;
    const baseColorString = `rgb(${baseColors.toString()})`;
    document.documentElement.style.setProperty('--base-color', baseColorString);
  }

  document.documentElement.style.setProperty('--picker-color', colorString);
  document.documentElement.style.setProperty('--picker-color-opaque', opaqueColorString);
}

function setSliders(colorInput) {
  let occursMultipleTimes;
  const indices = [];

  if (colorInput.length === 4) {
    const style = window.getComputedStyle(transparency);
    const height = parseInt(style.getPropertyValue('height'));

    transparencyLevel = colorInput[3];
    colorInput.pop();
    transparencySlider.style.top = `${(height - (height * transparencyLevel)) - 6}px`
  } else {
    transparencySlider.style.top = '-6px';
    transparencyLevel = 1;
  }

  if (colorInput[0] === colorInput[1] ||
      colorInput[0] === colorInput[2]) {
    occursMultipleTimes = colorInput[0];
  }
    
  if (colorInput[1] === colorInput[2]) {
    occursMultipleTimes = colorInput[1];
  }

  for (let i = 0; i < colorInput.length; i++) {
    if (colorInput[i] === occursMultipleTimes) indices.push(i);
  }

  const largestValue = Math.max(...colorInput);
  const smallestValue = Math.min(...colorInput);
  const style = window.getComputedStyle(polychrome);
  const height = parseInt(style.getPropertyValue('height'));
  const baseColorPos = [0, height / 3, height / 1.5, height];

  if (largestValue === occursMultipleTimes && 
      indices.length === 2) {
    if (indices.includes(0) && indices.includes(2)) {
      const pos = (baseColorPos[2] + baseColorPos[3]) / 2;
      setBaseColor(pos);
      polychromeSlider.style.top = `${pos - 6}px`;
      setColor(colorInput);
    } else {
      const pos = (baseColorPos[indices[0]] + baseColorPos[indices[1]]) / 2;
      setBaseColor(pos);
      polychromeSlider.style.top = `${pos - 6}px`;
      setColor(colorInput);
    }

  } else if (indices.length === 2) {
    const pos = baseColorPos[colorInput.indexOf(largestValue)]
    setBaseColor(pos);
    polychromeSlider.style.top = `${pos - 6}px`;
    setColor(colorInput);
  } else if (indices.length === 3) {
    setBaseColor(0);
    polychromeSlider.style.top = '-6px';
    setColor(colorInput);
  } else {
    let middleValue;
    for (let i = 0; i < colorInput.length; i++) {
      if (colorInput[i] !== largestValue && colorInput[i] !== smallestValue) {
        middleValue = colorInput[i];
      }
    }

    const middleBaseColor = Math.round(
      (middleValue - smallestValue) / 
      (1 - (smallestValue / largestValue)) *
      (255 / largestValue)
    );

    if ((colorInput.indexOf(middleValue) === 2 && colorInput.indexOf(largestValue) === 0) ||
        colorInput.indexOf(middleValue) < colorInput.indexOf(largestValue)) {
      const baseColor = (colorInput.indexOf(middleValue) === 2) ?
          baseColorPos[3] :
          baseColorPos[colorInput.indexOf(largestValue)];

      let pos = (baseColor - 
                  (height / 6) + 
                  (((255 - middleBaseColor) / 6) * 
                  (height / 255)));
      
      if (colorInput.indexOf(middleValue) === 0 && colorInput.indexOf(largestValue) === 2) {
        pos = baseColor + (baseColor - pos);
      }

      setBaseColor(pos);
      polychromeSlider.style.top = `${pos - 6}px`;
      setColor(colorInput);

    } else {
      const pos = (baseColorPos[colorInput.indexOf(largestValue)] + 
                  ((middleBaseColor / 255) * 
                  (height / 6)));

      setBaseColor(pos);
      polychromeSlider.style.top = `${pos - 6}px`;
      setColor(colorInput);
    }
  }
}

setBaseColor(0);
setColor();

window.addEventListener('mousemove', e => {
  if (e.target.id === 'polychrome' && mouseIsPressed && !cursorIsOut && !doughnutIsPressed && !transparencySliderIsPressed) {
    polySliderIsOut = false;
    polySliderIsPressed = true;

    const y = e.offsetY;
    polychromeSlider.style.top = `${y - 6}px`;

    setBaseColor(e.offsetY);
    setColor();
  } else if (polySliderIsPressed) {
    polySliderIsOut = true;

    const style = window.getComputedStyle(polychrome);
    const height = parseInt(style.getPropertyValue('height'));
    const pos = polychrome.getBoundingClientRect();
    const y = e.clientY;

    let offsetYPos;

    if (y < pos.top) {
      polychromeSlider.style.top = '-6px';
      offsetYPos = 0;
    } else if (y > pos.top + height) {
      polychromeSlider.style.top = `${height - 6}px`
      offsetYPos = height - 1;
    } else {
      polychromeSlider.style.top = `${(y - pos.top) - 6}px`;
      offsetYPos = y - pos.top;
    }

    setBaseColor(offsetYPos);
    setColor();

  } else if (e.target.id === 'transparency' && mouseIsPressed && !cursorIsOut) {
    transparencySliderIsOut = false;
    transparencySliderIsPressed = true;

    const style = window.getComputedStyle(e.target);
    const height = parseInt(style.getPropertyValue('height'));
    
    const y = e.offsetY;
    transparencyLevel = ((height - y) / height).toFixed(2);

    setColor();

    transparencySlider.style.top = `${y - 6}px`;
  } else if (transparencySliderIsPressed) {
    transparencySliderIsOut = true;

    const style = window.getComputedStyle(transparency);
    const height = parseInt(style.getPropertyValue('height'));
    const pos = transparency.getBoundingClientRect();
    const y = e.clientY;

    if (y < pos.top) {
      transparencyLevel = 1;
      transparencySlider.style.top = '-6px';
    } else if (y > pos.top + height) {
      transparencyLevel = 0;
      transparencySlider.style.top = `${height - 6}px`;
    } else {
      transparencyLevel = (((height - (y - pos.top)) / height)).toFixed(2);
      transparencySlider.style.top = `${y - pos.top - 6}px`;
    }

    setColor();
  } else if (e.target.id === 'color-box' && mouseIsPressed) {
    cursorIsOut = false;
    doughnutIsPressed = true;

    const style = window.getComputedStyle(e.target);
    const width = parseInt(style.getPropertyValue('width'));

    const x = e.offsetX;
    const y = e.offsetY;

    doughnut.style.right = `${(width - x) - 8}px`;
    doughnut.style.top = `${y - 8}px`;

    setColor();
  } else if (doughnutIsPressed) {
    cursorIsOut = true;

    const style = window.getComputedStyle(colorBox);
    const side = parseInt(style.getPropertyValue('width'));
    const pos = colorBox.getBoundingClientRect();
    const vpw = window.innerWidth
    const x = e.clientX;
    const y = e.clientY;

    // Top-right corner

    if (x > pos.left + side && y < pos.top) {
      doughnut.style.right = '-8px';
      doughnut.style.top = '-8px';
    } 
    
    // Bottom-right corner

    else if (x > pos.left + side && y > pos.top + side) {
      doughnut.style.right = '-8px';
      doughnut.style.top = `${side - 8}px`;
    }

    // Top-left corner

    else if (x < pos.left && y < pos.top) {
      doughnut.style.right = `${side - 8}px`;
      doughnut.style.top = '-8px';
    }

    // Bottom-left corner

    else if (x < pos.left && y > pos.top + side) {
      doughnut.style.right = `${side - 8}px`;
      doughnut.style.top = `${side - 8}px`;
    } else {

      if (x <= pos.left + side && x >= pos.left) {
        doughnut.style.right = `${
          ((vpw - x) - ((vpw - pos.left) - side)) - 8
        }px`;

        if (y < pos.top) doughnut.style.top = '-8px';
        else if (y > pos.top + side) doughnut.style.top = `${side - 8}px`;
      } else {
        doughnut.style.top = `${(y - pos.top) - 8}px`;

        if (x < pos.left) doughnut.style.right = `${side - 8}px`;
        else if (x > pos.left + side) doughnut.style.right = '-8px';
      }
    }
    setColor();
  }
});

window.addEventListener('mousedown', e => {
  if (e.target.id === 'color-box' ||
      e.target.id === 'polychrome' ||
      e.target.id === 'transparency') {
    mouseIsPressed = true;
  }
});

window.addEventListener('mouseup', () => {
  mouseIsPressed = doughnutIsPressed = cursorIsOut = false;
  polySliderIsPressed = polySliderIsOut = false;
  transparencySliderIsPressed = transparencySliderIsOut = false
});

window.addEventListener('change', e => {
  if (e.target.id === 'rgba') {
    const colorInput = rgbaInput.value.split(',').map(val => parseFloat(val));

    const validation = val => {
      let isPassing = true;

      if (colorInput.indexOf(val) === 3) {
        if (!(val >= 0 && val <= 1)) isPassing = false;
      } else {
        if (!(val >= 0 && val <= 255)) isPassing = false;
      }

      return isPassing;
    }

    if (colorInput.every(validation) && 
       (colorInput.length === 3 || colorInput.length === 4)) {
      let hexString = '';
      for (let i = 0; i < colorInput.length; i++) {
        let hexVal;

        if (i !== 3) {
          hexVal = colorInput[i].toString(16);
        } else {
          hexVal = (Math.round(colorInput[i] * 255)).toString(16);
          if (hexVal === 'ff') hexVal = '';
        }

        if (hexVal.length === 1) hexVal = `0${hexVal}`;
        hexString += hexVal;
      }

      hexInput.value = hexString.toUpperCase();

      setSliders(colorInput);

    }
  } else if (e.target.id === 'hex') {
    let abort = false;

    if (hexInput.value.length === 6 || hexInput.value.length === 8) {
      const colorInput = [];
      for (let i = 0; i < hexInput.value.length; i++) {
        let decimalVal = parseInt(`0x${hexInput.value[i]}`);
        if (!(decimalVal >= 0 && decimalVal <= 16)) {
          abort = true;
          break;
        }

        if (i % 2 !== 0) {
          colorInput.push(parseInt(`0x${hexInput.value[i - 1]}${hexInput.value[i]}`));
        }
      }

      if (!abort) {
        if (colorInput[3]) {
          colorInput[3] = colorInput[3] / 255;
        }

        rgbaInput.value = colorInput.toString().split(',').join(', ');

        if (!colorInput[3]) {
          rgbaInput.value += ', 1';
        }

        setSliders(colorInput);
      }
    }
  }
});

window.addEventListener('click', e => {
  if (e.target.id === 'polychrome') {
    const y = e.offsetY;
    polychromeSlider.style.top = `${y - 6}px`;

    setBaseColor(e.offsetY);
    setColor();
  } else if (e.target.id === 'transparency') {
    const style = window.getComputedStyle(e.target);
    const height = parseInt(style.getPropertyValue('height'));
    
    const y = e.offsetY;
    transparencyLevel = ((height - y) / height).toFixed(2);

    setColor();

    transparencySlider.style.top = `${y - 6}px`;
  } else if (e.target.id === 'color-box') {
    const style = window.getComputedStyle(e.target);
    const width = parseInt(style.getPropertyValue('width'));

    const x = e.offsetX;
    const y = e.offsetY;

    doughnut.style.right = `${(width - x) - 8}px`;
    doughnut.style.top = `${y - 8}px`;

    setColor();
  }
});

window.addEventListener('input', e => {
  if (e.target.className === 'picker-input') {
    e.target.value = e.target.value.toUpperCase();
  }
});
