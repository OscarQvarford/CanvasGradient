function gradient(w, h, deg) {
  const caseAngle1 = Math.round((Math.atan(w / h) * 180) / Math.PI),
    caseAngle2 = Math.round(180 - caseAngle1),
    caseAngle3 = Math.round(180 + caseAngle1),
    caseAngle4 = Math.round(360 - caseAngle1);
        
  let bx = tx = wh = w/2,
    hh = h/2,
    ty = h,    
    by = 0,
    angInRad = (deg * Math.PI) / 180,    
    count1;
      
  if (deg == caseAngle1) {   tx = 0;bx = w;} else 
    if (deg == caseAngle2) {   tx = 0;ty = 0;bx = w;by = h;} else
      if (deg == caseAngle3) {   tx = w;ty = 0;bx = 0;by = h;} else
        if (deg == caseAngle4) {   tx = w;ty = h;bx = 0;by = 0;} else
      {
        const mtan = Math.tan(angInRad);

        if (0 < deg && deg < caseAngle1) {    
          count1 = (mtan * h) / 2;
          tx = wh - count1;    
          bx = wh + count1;
        } 
        else if (caseAngle1 < deg && deg < caseAngle2) {    
          count1 = wh / mtan;
          tx = 0;
          ty = hh + count1;
          bx = w;
          by = hh - count1;
        } else if (caseAngle2 < deg && deg < caseAngle3) {    
          count1 = (mtan * h) / 2;
          tx = wh + count1;
          ty = 0;
          bx = wh - count1;
          by = h;
        } else if (caseAngle3 < deg && deg < caseAngle4) {    
          count1 = wh / mtan;
          tx = w;
          ty = hh - count1;
          bx = 0;
          by = hh + count1;
        } else if (caseAngle4 < deg && deg < 361) {
          count1 = (mtan * h) / 2;
          tx = wh - count1;
          ty = h;
          bx = wh + count1;
          by = 0;
        }
      }
  return [Math.round(tx), Math.round(ty), Math.round(bx), Math.round(by)];
}

function createLinearGradientValues(width, height, angle) {
  angle = angle * Math.PI / 180;
  const x = width * Math.cos(angle);
  const y = height * Math.sin(angle);

  return { x, y }
}
