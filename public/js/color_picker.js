class ColorPicker {
  constructor() {
    this.mouseIsPressed = false;
    this.colorBox = document.getElementById('color-box');
    this.doughnut = document.getElementById('doughnut');
    this.polychrome = document.getElementById('polychrome');
    this.polychromeSlider = document.querySelector('#polychrome > .slider');
    this.transparency = document.getElementById('transparency');
    this.transparencySlider = document.querySelector('#transparency > .slider');
    this.rgbaInput = document.getElementById('rgba');
    this.hexInput = document.getElementById('hex');

    this.doughnutIsPressed = false;
    this.cursorIsOut = false;
    this.polySliderIsPressed = false;
    this.polySliderIsOut = false;
    this.transparencySliderIsPressed = false;
    this.transparencySliderIsOut = false;
    this.transparencyLevel = 1;

    this.callback = null;
    this.context = null;

    this.colors = [255, 0, 0];
    this.baseColors = [255, 0, 0];

    doughnut.style.top = doughnut.style.right = '-8px';

    this.runListeners();

    const a = [0,43,25];
    this.setBaseColor(0);
    this.setColor(a);
    this.setSliders(a);
  }

  set(context) {
    this.context = context;
    this.callback = context.updateColor;
    this.setSliders(context.color);    
  }

  setBaseColor(y) {
    const style = window.getComputedStyle(polychrome);
    const height = parseInt(style.getPropertyValue('height'));

    const colorPos = (Math.round(y / (height / 256)) / 256 * 1536);
    const colorZone = colorPos / 256;

    if (colorZone <= 1) {
      this.baseColors[0] = 255;
      this.baseColors[1] = colorPos;
      this.baseColors[2] = 0;
    } else if (colorZone < 3) {
      this.baseColors[1] = 255;

      if (colorZone <= 2) {
        this.baseColors[0] = 255 - (colorPos - 255);
        this.baseColors[2] = 0;
      } else {
        this.baseColors[2] = colorPos - (2 * 255);
        this.baseColors[0] = 0;
      }
    } else if (colorZone < 5) {
      this.baseColors[2] = 255;
      
      if (colorZone <= 4) {
        this.baseColors[1] = 255 - (colorPos - 3 * 255);
        this.baseColors[0] = 0;
      } else {
        this.baseColors[0] = colorPos - (4 * 255);
        this.baseColors[1] = 0;
      }
    } else {
      this.baseColors[0] = 255;
      this.baseColors[1] = 0;
      this.baseColors[2] = 255 - (colorPos - 5 * 255);
    }

    for (let i = 0; i < this.baseColors.length; i++) {
      if (this.baseColors[i] > 255) this.baseColors[i] = 255;
    }

    const colorString = `rgb(${this.baseColors[0]},${this.baseColors[1]},${this.baseColors[2]})`;
    document.documentElement.style.setProperty('--base-color', colorString);
  }

  setColor(colorInput) {
    const style = window.getComputedStyle(this.colorBox);
    const side = parseInt(style.getPropertyValue('width'));
    let colorString;
    let opaqueColorString;

    if (colorInput) this.colors = colorInput;

    if (colorInput === undefined) {
      const colorXPos = parseInt(doughnut.style.right) + 8;
      const colorYPos = parseInt(doughnut.style.top) + 8;

      for (let i = 0; i < this.baseColors.length; i++) {
        this.colors[i] = Math.abs(Math.round(
          this.baseColors[i] + ((255 - this.baseColors[i]) * 
          (((this.baseColors[i] + 1) / 255) * 
          (255 - ((side - colorXPos) / 
          (side / 256)))) / 
          (this.baseColors[i] + 1))));
          
        if (this.baseColors[i] !== 0 || this.colors[i] !== 0) {
          this.colors[i] = Math.abs(Math.round(
            (this.colors[i] - ((colorYPos / side) * this.colors[i]))
          ));
        }

        if (colorXPos === 0 && this.baseColors[i] === 0) this.colors[i] = 0;
        if (this.colors[i] >= 255) this.colors[i] = 255;
      }
    } else {
      const largestValue = Math.max(...colorInput);
      const smallestValue = Math.min(...colorInput);

      doughnut.style.top = `${(((255 - largestValue) / 255) * side) - 8}px`;

      if (largestValue !== smallestValue) {
        doughnut.style.right = `${(side - (((255 - smallestValue) / 255) * side)) - 8}px`;
      } else {
        doughnut.style.right = `${side - 8}px`;
      }

      colorString = `rgba(${colorInput.toString()}, ${this.transparencyLevel})`;
      opaqueColorString = `rgb(${colorInput.toString()})`;
      const baseColorString = `rgb(${this.baseColors.toString()})`;
      document.documentElement.style.setProperty('--base-color', baseColorString);
    }

    if (this.transparencyLevel.toString() === '1.00') {
      this.transparencyLevel = 1;
    } else if (this.transparencyLevel.toString() === '0.00') {
      this.transparencyLevel = 0; 
    }

    colorString = `rgba(${this.colors.toString()}, ${this.transparencyLevel})`;
    opaqueColorString = `rgb(${this.colors.toString()})`;
    this.rgbaInput.value = `${`${this.colors}`.split(',').join(', ')}, ${this.transparencyLevel}`;
    if (this.callback) {
      console.log('callback');
      this.callback.call(this.context, this.rgbaInput.value);
    };

    let hexString = '';

    for (let i = 0; i < this.colors.length; i++) {
      let hexVal = this.colors[i].toString(16);
      if (hexVal.length === 1) hexVal = `0${hexVal}`;
      hexString += hexVal;
    }

    if (this.transparencyLevel !== 1) {
      let hexVal = Math.round(this.transparencyLevel * 255).toString(16);
      if (hexVal.length === 1) hexVal = `0${hexVal}`;
      hexString += hexVal;
    }

    this.hexInput.value = hexString.toUpperCase();

    document.documentElement.style.setProperty('--picker-color', colorString);
    document.documentElement.style.setProperty('--picker-color-opaque', opaqueColorString);
  }

  setSliders(colorInput) {
    let occursMultipleTimes;
    const indices = [];

    if (colorInput.length === 4) {
      const style = window.getComputedStyle(this.transparency);
      const height = parseInt(style.getPropertyValue('height'));

      this.transparencyLevel = colorInput[3];
      colorInput.pop();
      this.transparencySlider.style.left = `${(height - (height * this.transparencyLevel)) - 6}px`
    } else {
      this.transparencySlider.style.top = '-6px';
      this.transparencyLevel = 1;
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
        this.setBaseColor(pos);
        this.polychromeSlider.style.top = `${pos - 6}px`;
        this.setColor(colorInput);
      } else {
        const pos = (baseColorPos[indices[0]] + baseColorPos[indices[1]]) / 2;
        this.setBaseColor(pos);
        this.polychromeSlider.style.top = `${pos - 6}px`;
        this.setColor(colorInput);
      }

    } else if (indices.length === 2) {
      const pos = baseColorPos[colorInput.indexOf(largestValue)]
      this.setBaseColor(pos);
      this.polychromeSlider.style.top = `${pos - 6}px`;
      this.setColor(colorInput);
    } else if (indices.length === 3) {
      this.setBaseColor(0);
      this.polychromeSlider.style.top = '-6px';
      this.setColor(colorInput);
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

        this.setBaseColor(pos);
        this.polychromeSlider.style.top = `${pos - 6}px`;
        this.setColor(colorInput);

      } else {
        const pos = (baseColorPos[colorInput.indexOf(largestValue)] + 
                    ((middleBaseColor / 255) * 
                    (height / 6)));

        this.setBaseColor(pos);
        this.polychromeSlider.style.top = `${pos - 6}px`;
        this.setColor(colorInput);
      }
    }
  }

  runListeners() {
    window.addEventListener('mousemove', e => {
      if (e.target.id === 'polychrome' && this.mouseIsPressed && !this.cursorIsOut && !this.doughnutIsPressed && !this.transparencySliderIsPressed) {
        this.polySliderIsOut = false;
        this.polySliderIsPressed = true;
    
        const y = e.offsetY;
        this.polychromeSlider.style.top = `${y - 6}px`;
    
        this.setBaseColor(e.offsetY);
        this.setColor();
      } else if (this.polySliderIsPressed) {
        this.polySliderIsOut = true;
    
        const style = window.getComputedStyle(this.polychrome);
        const height = parseInt(style.getPropertyValue('height'));
        const pos = this.polychrome.getBoundingClientRect();
        const y = e.clientY;
    
        let offsetYPos;
    
        if (y < pos.top) {
          this.polychromeSlider.style.top = '-6px';
          offsetYPos = 0;
        } else if (y > pos.top + height) {
          this.polychromeSlider.style.top = `${height - 6}px`
          offsetYPos = height - 1;
        } else {
          this.polychromeSlider.style.top = `${(y - pos.top) - 6}px`;
          offsetYPos = y - pos.top;
        }
    
        this.setBaseColor(offsetYPos);
        this.setColor();
    
      } else if (e.target.id === 'transparency' && this.mouseIsPressed && !this.cursorIsOut) {
        this.transparencySliderIsOut = false;
        this.transparencySliderIsPressed = true;
    
        const style = window.getComputedStyle(e.target);
        const height = parseInt(style.getPropertyValue('height'));
        
        const y = e.offsetY;
        this.transparencyLevel = ((height - y) / height).toFixed(2);
    
        this.setColor();
    
        this.transparencySlider.style.top = `${y - 6}px`;
      } else if (this.transparencySliderIsPressed) {
        this.transparencySliderIsOut = true;
    
        const style = window.getComputedStyle(this.transparency);
        const height = parseInt(style.getPropertyValue('height'));
        const pos = this.transparency.getBoundingClientRect();
        const y = e.clientY;
    
        if (y < pos.top) {
          this.transparencyLevel = 1;
          this.transparencySlider.style.top = '-6px';
        } else if (y > pos.top + height) {
          this.transparencyLevel = 0;
          this.transparencySlider.style.top = `${height - 6}px`;
        } else {
          this.transparencyLevel = (((height - (y - pos.top)) / height)).toFixed(2);
          this.transparencySlider.style.top = `${y - pos.top - 6}px`;
        }
    
        this.setColor();
      } else if (e.target.id === 'color-box' && this.mouseIsPressed) {
        this.cursorIsOut = false;
        this.doughnutIsPressed = true;
    
        const style = window.getComputedStyle(e.target);
        const width = parseInt(style.getPropertyValue('width'));
    
        const x = e.offsetX;
        const y = e.offsetY;
    
        this.doughnut.style.right = `${(width - x) - 8}px`;
        this.doughnut.style.top = `${y - 8}px`;
    
        this.setColor();
      } else if (this.doughnutIsPressed) {
        this.cursorIsOut = true;
    
        const style = window.getComputedStyle(this.colorBox);
        const side = parseInt(style.getPropertyValue('width'));
        const pos = this.colorBox.getBoundingClientRect();
        const vpw = window.innerWidth;
        const x = e.clientX;
        const y = e.clientY;
    
        // Top-right corner
    
        if (x > pos.left + side && y < pos.top) {
          this.doughnut.style.right = '-8px';
          this.doughnut.style.top = '-8px';
        } 
        
        // Bottom-right corner
    
        else if (x > pos.left + side && y > pos.top + side) {
          this.doughnut.style.right = '-8px';
          this.doughnut.style.top = `${side - 8}px`;
        }
    
        // Top-left corner
    
        else if (x < pos.left && y < pos.top) {
          this.doughnut.style.right = `${side - 8}px`;
          this.doughnut.style.top = '-8px';
        }
    
        // Bottom-left corner
    
        else if (x < pos.left && y > pos.top + side) {
          this.doughnut.style.right = `${side - 8}px`;
          this.doughnut.style.top = `${side - 8}px`;
        } else {
    
          if (x <= pos.left + side && x >= pos.left) {
            this.doughnut.style.right = `${
              ((vpw - x) - ((vpw - pos.left) - side)) - 8
            }px`;
    
            if (y < pos.top) this.doughnut.style.top = '-8px';
            else if (y > pos.top + side) doughnut.style.top = `${side - 8}px`;
          } else {
            this.doughnut.style.top = `${(y - pos.top) - 8}px`;
    
            if (x < pos.left) this.doughnut.style.right = `${side - 8}px`;
            else if (x > pos.left + side) this.doughnut.style.right = '-8px';
          }
        }

        this.setColor();
      }
    });
    
    window.addEventListener('mousedown', e => {
      if (e.target.id === 'color-box' ||
          e.target.id === 'polychrome' ||
          e.target.id === 'transparency') {
        this.mouseIsPressed = true;
      }
    });
    
    window.addEventListener('mouseup', () => {
      this.mouseIsPressed = this.doughnutIsPressed = this.cursorIsOut = false;
      this.polySliderIsPressed = this.polySliderIsOut = false;
      this.transparencySliderIsPressed = this.transparencySliderIsOut = false
    });
    
    window.addEventListener('change', e => {
      if (e.target.id === 'rgba') {
        const colorInput = this.rgbaInput.value.split(',').map(val => parseFloat(val));
    
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

          this.hexInput.value = hexString.toUpperCase();
    
          this.setSliders(colorInput);
        }
      } else if (e.target.id === 'hex') {
        let abort = false;
    
        if (this.hexInput.value.length === 6 || this.hexInput.value.length === 8) {
          const colorInput = [];
          for (let i = 0; i < this.hexInput.value.length; i++) {
            let decimalVal = parseInt(`0x${this.hexInput.value[i]}`);
            if (!(decimalVal >= 0 && decimalVal <= 16)) {
              abort = true;
              break;
            }
    
            if (i % 2 !== 0) {
              colorInput.push(parseInt(`0x${this.hexInput.value[i - 1]}${this.hexInput.value[i]}`));
            }
          }
    
          if (!abort) {
            if (colorInput[3]) {
              colorInput[3] = colorInput[3] / 255;
            }
    
            this.rgbaInput.value = colorInput.toString().split(',').join(', ');
    
            if (!colorInput[3]) {
              this.rgbaInput.value += ', 1';
            }

            this.setSliders(colorInput);
          }
        }
      }
    });
    
    window.addEventListener('click', e => {
      if (e.target.id === 'polychrome') {
        const y = e.offsetY;
        this.polychromeSlider.style.top = `${y - 6}px`;
    
        this.setBaseColor(e.offsetY);
        this.setColor();
      } else if (e.target.id === 'transparency') {
        const style = window.getComputedStyle(e.target);
        const height = parseInt(style.getPropertyValue('height'));
        
        const y = e.offsetY;
        this.transparencyLevel = ((height - y) / height).toFixed(2);
    
        this.setColor();
    
        this.transparencySlider.style.top = `${y - 6}px`;
      } else if (e.target.id === 'color-box') {
        const style = window.getComputedStyle(e.target);
        const width = parseInt(style.getPropertyValue('width'));
    
        const x = e.offsetX;
        const y = e.offsetY;
    
        this.doughnut.style.right = `${(width - x) - 8}px`;
        this.doughnut.style.top = `${y - 8}px`;
    
        this.setColor();
      }
    });
    
    window.addEventListener('input', e => {
      if (e.target.className === 'picker-input') {
        e.target.value = e.target.value.toUpperCase();
      }
    });
  }
}
