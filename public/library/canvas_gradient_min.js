/**
 * @copyright Oscar Qvarford 2020
 * @license
 * https://opensource.org/licenses/MIT
 */
function canvasGradient(t,n,a,o,r){function s(t){return t*(Math.PI/180)}const h=function(t,n,a){a=Math.floor(a/45)%2==0?a%90:Math.abs(a-(a+90-a%90));const o=Math.tan(s(a))*n,r=t-o,h=Math.sin(s(a))*r,M=Math.sin(s(a))*h,c=Math.cos(s(90-a))*h;return posY=n+c,posX=o+M,{x:posX,y:posY}}(a,o,r),M=new Array(4).fill(0),c=Math.floor(r/45);return c%2==0?(M[c/2]=h.x,M[(3+c/2)%4]=h.y):(M[(c-1)/2]=h.y,M[(3+(c-1)/2)%4]=h.x),M[0]+=t,M[2]+=t,M[1]+=n,M[3]+=n,M}