const fs = require("fs");
fs.readFile("static/tables/first.csv",(err,docs) => {
  if(err) console.error(err)
  const parseString = docs.toString();
  let splitString = parseString.split('\n').map(e=>e.split(","))
  let keys = splitString[0];
  let dataArray = []
  for(let i=1;i<splitString.length;i++) {
    dataObject = {};
    for(let j=0;j<keys.length;j++) dataObject[keys[j]] = splitString[i][j];
    dataArray.push(dataObject)
  }
  let IDList = [];
  let fileList = fs.readdirSync('static/images');
  for(let {ID} of dataArray) IDList.push(ID+".png")
  // console.log(fs.readdirSync("static/images"))
  let exclusionArray = [];
  for(let elem of fileList) if(!(elem in IDList)) exclusionArray.push(elem);
  console.log(exclusionArray)
})
