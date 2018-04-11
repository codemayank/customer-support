const nodemailer = require('nodemailer'),
    mongoose = require('mongoose'),
    events = require('events'),
    Q = require('q',)
    queryEventEmitter = new events.EventEmitter();

queryEventEmitter.once('queryCreated', (data) => {
    console.log('a query was fired -->', data.ticket);
    let content = {
        subject : data.ticket.qTitle + " " + data.ticket._id + " " + data.ticket.createdAt,
        text : data.ticket.qDescription
    }
    data.db.find({}, "email").then((admin)=>{
        console.log('array of e-mails', admin);
        let promises = []
        admin.forEach((admin)=>{
            promises.push(sendEmail(admin.email, content)); 
        })
        console.log(promises);
        return Q.all(promises).then(()=>{
            return console.log('emails sent');
        }).catch((e)=>{
            console.log(e);
        })
    })
})

queryEventEmitter.once('messageSent', (data)=>{
    console.log('a message was iced -->', data.message)
    console.log('ticket --> ', data.ticket)
    let content = {
        subject : data.ticket.qTitle + " " + data.ticket._id + " " + data.ticket.createdAt,
        text : data.message.text
    }

    data.db.find(data.queryValue, "email").then((user)=>{
        console.log('array of e-mails', user);
        user.forEach((user)=>{
            sendEmail(user.email, content)
        })
        console.log('email sent');
    }).catch((e)=>{
        console.log('there was an error in sending the message.', e)
    })

})

queryEventEmitter.once('queryAction', (data)=>{
    console.log('query modified event was fired', data);
    let content = {
        subject : " Query ID: " + data.ticket_id.substring(data.ticket_id.length-5, data.ticket_id.length),
        text : "Subject query has been" + " " + data.action + " " +  "by the user."
    }
    data.db.find({}, "email",).then((admins)=>{
        admins.forEach((admin)=>{
            sendEmail(admin.email, content)
        })
        console.log('email sent');
    }).catch((e)=>{
        console.log('there was an error in sending the message', e)
    })
})

let sendEmail = (email, content) => {
    let smtpTransport = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'myan123',
            pass: "$~f).Vv$36'6dApF"
        }
    });
    let mailOptions = {
        to: email,
        from: 'customer-support@demo.com',
        subject: content.subject,
        text: content.text
    }
    return smtpTransport.sendMail(mailOptions);


}

module.exports = queryEventEmitter;