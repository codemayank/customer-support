const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      path = require('path'),
      publicPath = path.join(__dirname, '../client'),
      async = require('async'),
      port = process.env.PORT || 3000;

app.use(express.static(publicPath));


mongoose.connection.on("connected", () => {
    console.log("Connection Established");
  });
  
mongoose.connection.on("reconnected", () => {
    console.log("Connection Reestablished");
});
  
mongoose.connection.on("disconnected", () => {
    console.log("Connection Disconnected");
});
  
mongoose.connection.on("close", () => {
    console.log("Connection Closed");
});
  
mongoose.connection.on("error", (error) => {
    console.log("ERROR: " + error);
});

mongoose.connect('mongodb://localhost/customer_support')

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})