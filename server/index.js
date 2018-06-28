const express = require('express'),
  app = express(),
  mongoose = require('mongoose'),
  bodyParser = require('body-parser'),
  path = require('path'),
  publicPath = path.join(__dirname, '../client'),
  port = process.env.PORT || 3000 //specify the port
//import the models

app.use(express.static(publicPath))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connection.on('connected', () => {
  console.log('Connection Established')
})

mongoose.connection.on('reconnected', () => {
  console.log('Connection Reestablished')
})

mongoose.connection.on('disconnected', () => {
  console.log('Connection Disconnected')
})

mongoose.connection.on('close', () => {
  console.log('Connection Closed')
})

mongoose.connection.on('error', error => {
  console.log('ERROR: ' + error)
})

//establish database connection.
mongoose.connect(process.env.MONGODB_URI)

//Import the routes
let queryRoute = require('./controllers/query-controller')
queryRoute.controller(app)

let userRoute = require('./controllers/user-controller')
userRoute.controller(app)

let messageRoute = require('./controllers/messages-controller')
messageRoute.controller(app)

app.listen(port, () => {
  console.log(`Listening to port ${port}`)
})
