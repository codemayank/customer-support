const nodemailer = require('nodemailer'),
  mongoose = require('mongoose'),
  events = require('events'),
  Q = require('q')
queryEventEmitter = new events.EventEmitter()

//Import the emailAuth credentials
const emailAuth = require('../env.js')

//Event listener to listen to the event when query is created by the user and send the email to all admins.
queryEventEmitter.once('queryCreated', data => {
  if (emailAuth.useEmail) {
    let content = {
      subject:
        data.ticket.qTitle +
        ' ' +
        data.ticket._id +
        ' ' +
        data.ticket.createdAt,
      text: data.ticket.qDescription
    }
    data.db.find({}, 'email').then(admin => {
      let promises = []
      admin.forEach(admin => {
        promises.push(sendEmail(admin.email, content))
      })
      return Q.all(promises)
        .then(() => {})
        .catch(e => {
          console.log(e)
        })
    })
  } else {
    console.log('email service has been disabled')
  }
})

//Event listener to send email when a new message is submitted by either the admin or user
queryEventEmitter.once('messageSent', data => {
  if (emailAuth.useEmail) {
    let content = {
      subject:
        data.ticket.qTitle +
        ' ' +
        data.ticket._id +
        ' ' +
        data.ticket.createdAt,
      text: data.message.text
    }

    data.db
      .find(data.queryValue, 'email')
      .then(user => {
        user.forEach(user => {
          sendEmail(user.email, content)
        })
      })
      .catch(e => {
        console.log('there was an error in sending the message.', e)
      })
  } else {
    console.log('email service has been disabled')
  }
})

//Event listener to listen to status changes for the query when the user edits deletes or marks a query resolved a email is sent to the client.
queryEventEmitter.once('queryAction', data => {
  if (emailAuth.useEmail) {
    let content = {
      subject:
        ' Query ID: ' +
        data.ticket_id.substring(
          data.ticket_id.length - 5,
          data.ticket_id.length
        ),
      text: 'Subject query has been' + ' ' + data.action + ' ' + 'by the user.'
    }
    data.db
      .find({}, 'email')
      .then(admins => {
        admins.forEach(admin => {
          sendEmail(admin.email, content)
        })
      })
      .catch(e => {
        console.log('there was an error in sending the message ', e)
      })
  } else {
    console.log('email service has been disabled')
  }
})

//send email function.
let sendEmail = (email, content) => {
  //check if email service has been enabled by the user
  if (emailAuth.useEmail) {
    let smtpTransport = nodemailer.createTransport({
      service: emailAuth.service,
      auth: emailAuth.auth
    })
    let mailOptions = {
      to: email,
      from: 'customer-support@demo.com',
      subject: content.subject,
      text: content.text
    }
    return smtpTransport.sendMail(mailOptions)
  } else {
    return 'Email service has been disabled.'
  }
}

module.exports = queryEventEmitter
