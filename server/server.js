const express = require('express'),
      app = express(),
      mongoose = require('mongoose'),
      bodyParser = require('body-parser'),
      path = require('path'),
      publicPath = path.join(__dirname, '../client'),
      async = require('async'),
      port = process.env.PORT || 3000,
      
      ticketModel = require('./models/query-model'),
      userModel = require('./models/user-model'),
      messageModel = require('./models/message-model');
            

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

mongoose.connect('mongodb://localhost/user_support')


let queryRoute = require('./controllers/query-controller');
queryRoute.controller(app);

let userRoute = require('./controllers/user-controller');
userRoute.controller(app);

let messageRoute = require('./controllers/messages-controller')
messageRoute.controller(app);

app.listen(port, ()=>{
    console.log(`Listening to port ${port}`);
})

//TODO make the auth token expire after 7 days.
//TODO implement forgot password -> user/admins.
//TODO send e-mail everytime a query is created. -> to admins
//TODO send e-mail everytime a message is sent. -> to user / admins
//TODO send e-mail everytime a query is resolved. -> to admins
//TODO send e-mail everytime a query is closed -> to user