const express = require('express'),
      router = express.Router(),
    //   mongoose = require('mongoose'),
      user = require('../models/user-model'),
      admin = require('../models/admin-model'),
      _ = require('lodash'),
      authenticate = require('./middlewares/authenticate');


module.exports.controller = (app) =>{

    router.post('/user-registration', (req, res) => {
        let body = _.pick(req.body, ['username', 'email', 'password', 'phoneNumber'])
        let newUser = new user(body);

        newUser.save().then(() =>{
            return newUser.generateAuthToken('userAuth');
        }).then((token)=>{
            res.header('x-auth', token).send(newUser);
        }).catch((e)=>{
            res.status(400).send(e)
        })
    })

    //create new admin_id
    router.post('/admin-registration', (req, res)=>{
        let body = _.pick(req.body,['username', 'email', 'password', 'admin_id', 'phoneNumber', 'userType']);
        let newAdmin = new admin(body);
        newAdmin.save().then(()=>{
            return newAdmin.generateAuthToken('adminAuth');
        }).then((token) =>{
            res.header('x-auth', token).send(newAdmin);
        }).catch((e)=>{
            res.status(400).send(e);
        })
    });

    //post /user/user-login
    router.post('/user-login', (req, res)=>{
        let body = _.pick(req.body, ['username', 'password', 'loginAuth']);
        
        user.findByCredentials(body.username, body.password).then((user)=>{
            return user.generateAuthToken(body.loginAuth).then((token)=>{
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

    app.use('/user' ,router);
}