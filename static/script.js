
// Declarations

Math.roundOff = (e,places)=>Math.round(e*10**places)/(10**places)

const l = console.log;
const canvas = document.getElementById("canvas");
canvas.style.height = canvas.height+"px";
canvas.style.width = canvas.width+"px";
const ctx = canvas.getContext('2d');
let {height,width} = canvas;
ctx.fillStyle = "white";
ctx.fillRect(0,0,width,height)
// console.error(height)
let imageData = ctx.createImageData(width,height);
const c = (a,b)=>new Complex(a,b)
progress  = $('#progress');
progressValue = $('#progressValue');
// Function definitions

// Returns in the form of [X,Y]
const getCoordsFromIndex = (
  width,
  height,
  index,
  xTopLeftCornerOffset=0,
  yTopLeftCornerOffset=0,
  xBottomRightCornerOffset=xTopLeftCornerOffset+width,
  yBottomRightCornerOffset=yTopLeftCornerOffset+height)=>{
    let dx = Math.abs(xBottomRightCornerOffset-xTopLeftCornerOffset)/width
    let dy = Math.abs(yBottomRightCornerOffset-yTopLeftCornerOffset)/height
    let xThPixel = (index)%width;
    // console.log(dx)
    let yThPixel = Math.floor((index)/width);
    let xCoord = xThPixel*dx + xTopLeftCornerOffset;
    let yCoord = yTopLeftCornerOffset-yThPixel*dy ;
    return [xCoord,yCoord]
  }
  const getCoordsFromPixels = (
    width,
    height,
    xPixel,
    yPixel,
    xTopLeftCornerOffset=0,
    yTopLeftCornerOffset=0,
    xBottomRightCornerOffset=xTopLeftCornerOffset+width,
    yBottomRightCornerOffset=yTopLeftCornerOffset+height,showDx=false)=>{
      let dx = Math.abs(xBottomRightCornerOffset-xTopLeftCornerOffset)/width
      let dy = Math.abs(yBottomRightCornerOffset-yTopLeftCornerOffset)/height
      // if(showDx) console.log(dx)
      let xCoord = xPixel*dx + xTopLeftCornerOffset;
      let yCoord = yTopLeftCornerOffset - yPixel*dy;
      return [xCoord,yCoord]
    }
function mandelbrotCheck(num,iterations) {
  let z0 = c(0,0);
  let inMandelBrot = true
  for(let i=0;i<iterations && inMandelBrot;i++){
    z0 = z0.pow(2).add(num);
    if(z0.abs() > 2) inMandelBrot = false
  }
  return inMandelBrot
}
function setPixelTo(imageData,pixel,R,G,B,A){
  imageData.data[pixel] = R;
  imageData.data[pixel+1] = G;
  imageData.data[pixel+2] = B;
  imageData.data[pixel+3] = A;
}


// Loops/mechanics

//renderFunction
function mainRenderFunction(xStart,yStart,xEnd,yEnd){
  return new Promise((resolve, reject) => {
    try {
      $('.loadable').text("Loading...")
      console.log("Rendering...")
      for(let i=0;i<imageData.data.length;i+=4){
        let pixel = i/4;
        let [xCoord,yCoord] = getCoordsFromIndex(width,height,pixel,xStart,yStart,xEnd,yEnd);
        if(mandelbrotCheck(c(xCoord,yCoord),20)) setPixelTo(imageData,i,0,0,0,255);
      }
      resolve(imageData)
    } catch (e) {
        reject(e)
    }
  })
}
let interval;
let xPixelElem = document.getElementById("xpixel");
let yPixelElem = document.getElementById("ypixel");
let x = $(canvas).offset().left;
let y = $(canvas).offset().top
// console.log(canvas.getBoundingClientRect())
let xCoordinate = document.getElementById("xcoordinate")
let yCoordinate = document.getElementById("ycoordinate")
xTopLeftOffset = -2;
yTopLeftOffset = 1;
xBottomRightOffset = 1;
yBottomRightOffset = -1;

$('#xstart').text(xTopLeftOffset)
$('#ystart').text(yTopLeftOffset)
$('#xend').text(xBottomRightOffset)
$('#yend').text(yBottomRightOffset)

getCoordsFromPixels(width,height,0,0,xTopLeftOffset,yTopLeftOffset,xBottomRightOffset,yBottomRightOffset,true)
// console.log(Math.abs(xTopLeftOffset - xBottomRightOffset)/width)
canvas.addEventListener("mousemove",function(e){
  xPixel = e.pageX-x
  yPixel = e.pageY-y
  xPixelElem.innerText = Math.round(xPixel);
  yPixelElem.innerText = Math.round(yPixel);
  let [xCoord, yCoord] = getCoordsFromPixels(width,height,xPixel,yPixel,xTopLeftOffset,yTopLeftOffset,xBottomRightOffset,yBottomRightOffset)
  xCoordinate.innerText = Math.roundOff(xCoord,3);
  yCoordinate.innerText = Math.roundOff(yCoord,3);
})
canvas.addEventListener("mouseout",function(e){
  xPixelElem.innerText = yPixelElem.innerText = xCoordinate.innerText = yCoordinate.innerText = ""
  // clearInterval(interval);
})



// for(let i=0;i<imageData.data.length;i+=4){
//   let val = Math.random()*255
//   let [xCoord, yCoord] = getCoordsFromIndex(width,height,i,-width/2,-height/2);
//   if(i<width/2+4) console.log(xCoord);
//   if(xCoord == 0) imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = 0;
//   else imageData.data[i] = imageData.data[i+1] = imageData.data[i+2] = 255
//   imageData[i+3] = 255
// }

$('.loadable').on('load',function() {
  let e = $(this);
  if(e.attr("onloadText")===undefined) e.text('')
  else e.text(e.attr('onloadText'))
})
function executeRender(){
  $('#runtime').text("Rendering...")
  setTimeout(runRender,500)
}
function clearCanvas(){
  let ImgData = ctx.getImageData(0,0,width,height);
  for(let i=0;i<ImgData.data.length;i+=4){
    ImgData.data[i] =ImgData.data[i+1] =ImgData.data[i+2] =ImgData.data[i+3] = 0;
  }
  ctx.putImageData(ImgData,0,0)
}
function runRender(){
  let ts = Date.now();
  mainRenderFunction(xTopLeftOffset,yTopLeftOffset,xBottomRightOffset,yBottomRightOffset)
  .then((imageData) => {
      ctx.putImageData(imageData,0,0)
      runtime = (Date.now()-ts)/1000;
      $('.loadable').trigger('load');
      $('#runtime').text(`${runtime}s`)
      console.log(`Rendering complete[Runtime: ${runtime} seconds]`)
    })
}
// ctx.putImageData(imageData,0,0)





// Template for axios :

/*
axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
})
*/
