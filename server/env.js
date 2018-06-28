//Please specify your e-mail credentials below if you want the app to send e-mail messages.
const emailAuth = {
  useEmail: process.env.USE_EMAIL, //set to true if you want to the app to send email messages.
  service: process.env.EMAIL_SERVICE, //Please specify your email service here such as gmail yahoo etc
  auth: {
    user: process.env.EMAIL_USERNAME, //please insert your email username
    pass: process.env.EMAIL_PASSWORD //please insert your email password
  }
}

module.exports = emailAuth
