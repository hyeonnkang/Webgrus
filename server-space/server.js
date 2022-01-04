const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "../react-space/build")));
app.get("/", function (request, response) {
  response.sendFile(path.join(__dirname, "../react-space/build/index.html"));
});

app.listen(3000, function () {
  console.log("success");
});
