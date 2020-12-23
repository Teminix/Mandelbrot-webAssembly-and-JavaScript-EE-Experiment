const express = require("express");
const app = express();
const morgan = require("morgan");
app.use(morgan('short'))//
app.get('/',(req,res) => {
  res.send("Hello there");
})
app.get("/out",(req,res) => {
  res.type("application/octet-stream").send()
})
app.use(express.static("./static/"))
app.use(express.static("./static"))
app.listen(8000,'0.0.0.0',() => {
  console.log("Server running on 8000")
})
//
