const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      path = require('path'),
      publicPath = path.join(__dirname, '../client'),
      async = require('async'),
      port = process.env.PORT || 3000;

app.use(express.static(publicPath));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


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

let ticketModel = require('./models/query-model');
let customerModel = require('./models/customer-model');

let queryRoute = require('./controllers/query-controller');
queryRoute.controller(app);

let userRoute = require('./controllers/user-controller');
userRoute.controller(app);

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})