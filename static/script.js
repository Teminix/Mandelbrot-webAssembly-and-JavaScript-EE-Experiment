
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
GLOBALS = {
  aspectRatio:1.5,
  roundOffAmount:6,
  iterations:20
}

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
function randGen(len){
  let alphabets = "abcdefghijklmnoopqrstuvwxyz"
  let allowed = alphabets + alphabets.toUpperCase() + "0123456789";
  let str = '';
  for(let i=0;i<len;i++) str += allowed[Math.round(Math.random()*allowed.length)-1];
  return str;
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
        if(mandelbrotCheck(c(xCoord,yCoord),GLOBALS.iterations)) setPixelTo(imageData,i,0,0,0,255);
        else setPixelTo(imageData,i,255,255,255,255)
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
let universalXOffset = $(canvas).offset().left;
let universalYOffset = $(canvas).offset().top
// console.log(canvas.getBoundingClientRect())
let xCoordinate = document.getElementById("xcoordinate")
let yCoordinate = document.getElementById("ycoordinate")
xTopLeftOffset = -2;
yTopLeftOffset = 1;
xBottomRightOffset = 1;
aspectRatio = GLOBALS.aspectRatio// Width : Height
yBottomRightOffset = yTopLeftOffset - (Math.abs(xBottomRightOffset-xTopLeftOffset))/aspectRatio;

// $('#xstart').text(xTopLeftOffset)
// $('#ystart').text(yTopLeftOffset)
// $('#xend').text(xBottomRightOffset)
$('#yend').text(yBottomRightOffset)

getCoordsFromPixels(width,height,0,0,xTopLeftOffset,yTopLeftOffset,xBottomRightOffset,yBottomRightOffset,true)
// console.log(Math.abs(xTopLeftOffset - xBottomRightOffset)/width)
canvas.addEventListener("mousemove",function(e){
  xPixel = e.pageX-universalXOffset
  yPixel = e.pageY-universalYOffset
  xPixelElem.innerText = Math.round(xPixel);
  yPixelElem.innerText = Math.round(yPixel);
  let [xCoord, yCoord] = getCoordsFromPixels(width,height,xPixel,yPixel,xTopLeftOffset,yTopLeftOffset,xBottomRightOffset,yBottomRightOffset)
  xCoordinate.innerText = Math.roundOff(xCoord,GLOBALS.roundOffAmount);
  yCoordinate.innerText = Math.roundOff(yCoord,GLOBALS.roundOffAmount);
})
canvas.addEventListener("mousedown",function(e){ // Adding a cross hair
  if($(canvas).attr("crosshair") === 'on') {
    let xPoint = e.pageX - universalXOffset;
    let yPoint = e.pageY - universalYOffset;
    let [xCoord, yCoord] = getCoordsFromPixels(width,height,xPoint,yPoint,xTopLeftOffset,yTopLeftOffset,xBottomRightOffset,yBottomRightOffset);
    idLabels({
      'crossXPixel':Math.round(xPoint),
      'crossYPixel':Math.round(yPoint),
      'crossXCoordinate':Math.roundOff(xCoord,GLOBALS.roundOffAmount),
      'crossYCoordinate':Math.roundOff(yCoord,GLOBALS.roundOffAmount)
    })
    ctx.putImageData(GLOBALS.mainImageData,0,0);
    cross(ctx, xPoint, yPoint, 10,{thickness:3,color:'red'});
  }
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


// Special class declarations
$('.loadable').on('load',function() { // Every element that we want a "loading..." text to be shown while execution
  let e = $(this);
  if(e.attr("onloadText")===undefined) e.text('')
  else e.text(e.attr('onloadText'))
})
$('.copy').on('click',(e) => {
  let elem = $(e.target);
  let boundElementValue = $(`#${elem.attr('copy-bind')}`).text();
  boundElementValue = boundElementValue.trim() == ''?0:boundElementValue;
  if(typeof $(`#${elem.attr('copy-output')}`) != 'undefined') $(`#${elem.attr('copy-output')}`).val(boundElementValue);
  let inputElem = $(`<input value="${boundElementValue}">`);
  $('body').append(inputElem);
  inputElem.select();
  // l(inputElem[0])
  // GLOBALS.inputElem = inputElem;
  document.execCommand("copy");
  inputElem.remove();
})


// Button functions

function executeRender(){
  $('#runtime').text("Rendering...")
  setTimeout(runRender,500)
}
function loadStock(){
  let fr = new FileReader();
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.open('GET','/stock.png',true);
  fr.addEventListener('load',function(event){
    // console.log(event.target.result.replace('data:image/png;base64,',''));
    let res = event.target.result;
    let img = $('#testImage');
    img.attr("src",res);
    img = img[0];
    let canvas = $('#canvas')[0]
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img,0,0);
    GLOBALS.mainImageData = ctx.getImageData(0,0,width,height);
  })
  xhr.onload = function(){
    if (this.status === 200) fr.readAsDataURL(this.response)
    else console.warn("Something may have gone wrong oops pls fix")
  }
  xhr.send()
}
function loadID(){
  let ID = prompt("Enter ID of image to use:");
  let fr = new FileReader();
  let xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.open('GET',`/images/${ID}.png`,true);
  fr.addEventListener('load',function(event){
    // console.log(event.target.result.replace('data:image/png;base64,',''));
    let res = event.target.result;
    let img = $('#testImage');
    img.attr("src",res);
    img = img[0];
    let canvas = $('#canvas')[0]
    let ctx = canvas.getContext('2d');
    ctx.drawImage(img,0,0);
    GLOBALS.mainImageData = ctx.getImageData(0,0,width,height);
  })
  xhr.onload = function(){
    if (this.status === 200) fr.readAsDataURL(this.response)
    else if(this.status >= 500) alert('Error occured')
    else console.warn("Something may have gone wrong oops pls fix")
  }
  xhr.send()
}
function testFunc(){

}
function idLabels(idObject){
  for(let id in idObject) $(`#${id}`).text(idObject[id]);
}
function resetRenderValues(){
  $('#xstart,#ystart,#xend').each((index,item)=>{
    $(item).val($(item).attr('default-value'))
  })
  $('#yend').text($('#yend').attr('default-value'))
}
function calculateYEnd(){
  $('#yend').text(Math.roundOff(Number($('#ystart').val())-(Math.abs(Number($('#xend').val())-Number($('#xstart').val())))/GLOBALS.aspectRatio,GLOBALS.roundOffAmount))
  // console.log(())
}
function clearCanvas(){
  let ImgData = ctx.getImageData(0,0,width,height);
  for(let i=0;i<ImgData.data.length;i+=4){
    ImgData.data[i] =ImgData.data[i+1] =ImgData.data[i+2] =ImgData.data[i+3] = 0;
  }
  ctx.putImageData(ImgData,0,0)
}
function toggleCrossHair(button){
  if($(canvas).attr("crosshair") == 'on'){
    $(canvas).attr('crosshair','off');
    $(button).text("Choose point")
  } else {
    $(canvas).attr('crosshair','on');
    $(button).text("Cancel")
  }
}
function generateImageID(){
  let imageID = randGen(10);
  GLOBALS.currentImageID = imageID;
  $('#imageID').text(imageID);
}
function runRender(){ // Renders and calculates runtime
  let ts = Date.now();
  xTopLeftOffset = Number($('#xstart').val() );
  yTopLeftOffset = Number($('#ystart').val());
  xBottomRightOffset = Number($('#xend').val());
  yBottomRightOffset = yTopLeftOffset - (Math.abs(xBottomRightOffset-xTopLeftOffset))/aspectRatio;
  // generateImageID();
  // console.log([xTopLeftOffset,yTopLeftOffset,xBottomRightOffset,yBottomRightOffset].join("\n"))
  mainRenderFunction(xTopLeftOffset,yTopLeftOffset,xBottomRightOffset,yBottomRightOffset)
  .then((imageData) => {
      ctx.putImageData(imageData,0,0);
      GLOBALS.mainImageData = imageData;
      console.log(imageData);
      runtime = (Date.now()-ts)/1000;
      $('.loadable').trigger('load');
      $('#runtime').text(`${runtime}s`);
      console.log(`Rendering complete[Runtime: ${runtime} seconds]`);
    })
}
function uploadCanvas(){
  canvas.toBlob(function(blob){
    let formData = new FormData();
    formData.append('image_render',blob,GLOBALS.currentImageID+".png");
    let xhr = new XMLHttpRequest();
    xhr.open("POST",'/upload_image',true);
    xhr.responseType = 'text';
    xhr.onreadystatechange = function(){
      if(this.readyState  == 4){
        if(this.status == 200) console.log(this.responseText);
        else if (this.status >=500) console.error(this.responseText);
        else console.info(this.responseText);
      }
    }
    xhr.send(formData);
  })
}
// ctx.putImageData(imageData,0,0)



// Drawing tools
function cross(ctx, x, y, len,props={}){
  ctx.beginPath();
  ctx.lineWidth = props.thickness || 1;
  ctx.strokeStyle = props.color || 'black';
  ctx.moveTo(x-len,y+len);
  ctx.lineTo(x+len,y-len);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x-len,y-len);
  ctx.lineTo(x+len,y+len);
  ctx.stroke();
}


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
