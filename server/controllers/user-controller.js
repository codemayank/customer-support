const express = require('express'),
      router = express.Router(),
    //   mongoose = require('mongoose'),
      user = require('../models/user-model'),
      _ = require('lodash'),
      authenticate = require('./middlewares/authenticate');


module.exports.controller = (app) =>{

    router.post('/user-registration', (req, res) => {
        let body = _.pick(req.body, ['username', 'email', 'password', 'phoneNumber'])
        let newUser = new user(body);

        newUser.save().then(() =>{
            return newUser.generateAuthToken();
        }).then((token)=>{
            res.header('x-auth', token).send(newUser);
        }).catch((e)=>{
            res.status(400).send(e)
        })
    })

    //post /user/user-login
    router.post('/User-login', (req, res)=>{
        let body = _.pick(req.body, ['username', 'password']);
        
        user.findByCredentials(body.username, body.password).then((user)=>{
            return user.generateAuthToken().then((token)=>{
                res.header('x-auth', token).send(user);
            })
        }).catch((e)=>{
            res.status(400).send();
        })
    })

    router.delete('/user-logout', authenticate, (req, res)=>{
        req.user.removeToken(req.token).then(()=>{
            res.status(200).send();
        }, ()=>{
            res.status(400).send();
        });
    })

    router.get('/me', authenticate, (req, res) => {
        res.send(req.user);
    })
    app.use('/user' ,router);
}