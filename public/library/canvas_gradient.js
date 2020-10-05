/**
 * @author Oscar Qvarford <oscar.qvarford@gmail.com>
 * @copyright Oscar Qvarford 2020
 * @license
 * https://opensource.org/licenses/MIT
 * 
 * 
 * Returns values to use for creating a gradient in JavaScript Canvas
 * 
 * @example <caption>Linear Gradient Example</caption>
 * document.createElement('canvas').getContext('2d').createLinearGradient(...canvasGradient(0,0,50,50,45));
 * // Creates a 45 degree gradient for a square with the dimensions 50x50
 * @param  {Number} x      The x-offset of the gradient
 * @param  {Number} y      The y-offset of the gradient
 * @param  {Number} width  The width of the desired gradient
 * @param  {Number} height The height of the desired gradient
 * @param  {Number} angle  The angle of the gradient's slope
 * @return {Number[]}      The array containing the values that can be used to create a gradient
 */
function canvasGradient(x, y, width, height, angle) {
  // Calculations

  function toRadians(deg) {
    return deg * (Math.PI / 180);
  }

  // Calculating the two points that will be used to determine the gradient
  function calcPoints(width, height, angle) {

    angle = (Math.floor(angle / 45) % 2 === 0) ?
      angle % 90:
      Math.abs(angle - (angle + 90 - angle % 90));

    const opposite1 = Math.tan(toRadians(angle)) * height;

    const hypotenuse2 = width - opposite1;
    const opposite2 = Math.sin(toRadians(angle)) * hypotenuse2;

    const hypotenuse3 = opposite2;
    const opposite3 = Math.sin(toRadians(angle)) * hypotenuse3;
    const adjacent3 = Math.cos(toRadians(90 - angle)) * hypotenuse3;

    posY = height + adjacent3;
    posX = opposite1 + opposite3;

    return {
      x: posX,
      y: posY
    };
  }

  // Positioning the points

  const pos = calcPoints(width, height, angle);
  const vals = new Array(4).fill(0);
  const angleSection = Math.floor(angle / 45);
  if (angleSection % 2 === 0) {
    vals[angleSection / 2] = pos.x;
    vals[(3 + angleSection / 2) % 4] = pos.y;
  } else {
    vals[(angleSection - 1) / 2] = pos.y;
    vals[(3 + (angleSection - 1) / 2) % 4] = pos.x;
  }

  vals[0] += x;
  vals[2] += x;
  vals[1] += y;
  vals[3] += y;

  return vals;
}