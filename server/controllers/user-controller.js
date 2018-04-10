const express = require('express'),
      router = express.Router(),
      user = require('../models/user-model'),
      _ = require('lodash'),
      authenticate = require('./middlewares/authenticate');


module.exports.controller = (app) =>{

    //route for user registration
    router.post('/user-registration', (req, res) => {
        let body = _.pick(req.body, ['username', 'email', 'password', 'phoneNumber'])
        let newUser = new user.User(body);
        console.log(newUser);
        newUser.save().then(() =>{
            return newUser.generateAuthToken('userAuth');
        }).then((token)=>{
            res.header('x-auth', token).send(newUser);
        }).catch((e)=>{
            res.status(400).send(e)
        })
    })

    //route for admin registration
    router.post('/admin-registration', (req, res)=>{
        let body = _.pick(req.body,['username', 'email', 'password', 'admin_id', 'phoneNumber', 'userType']);
        let newAdmin = new user.Admin(body);
        newAdmin.save().then(()=>{
            return newAdmin.generateAuthToken('adminAuth');
        }).then((token) =>{
            res.header('x-auth', token).send(newAdmin);
        }).catch((e)=>{
            res.status(400).send(e);
        })
    });

    //route to login the user
    router.post('/user-login', (req, res)=>{
        let body = _.pick(req.body, ['username', 'password']);
        console.log(body);
        
        user.User.findByCredentials(body.password, body.username).then((user)=>{
            return user.generateAuthToken('userAuth').then((token)=>{
                res.header('x-auth', token).send(user);
            })
        }).catch((e)=>{
            res.status(400).send(e);
        })
    })

    //route to login the admin
    router.post('/admin-login', (req, res)=>{
        let body = _.pick(req.body, ['admin_id', 'password']);
        
        user.Admin.findByCredentials(body.password, 0, body.admin_id).then((user)=>{
            return user.generateAuthToken('adminAuth').then((token)=>{
                res.header('x-auth', token).send(user);
            })
        }).catch((e)=>{
            res.status(400).send();
        })
    })

    //route to logout the user
    router.delete('/user-logout', authenticate, (req, res)=>{
        req.user.removeToken(req.token).then(()=>{
            res.status(200).send();
        }, ()=>{
            res.status(400).send();
        });
    })

    //forgot password route.
    router.post('/forgot-password', (req, res)=>{
        let userType = user.User;
        if(req.header('x-userType') == 'Admin'){
            userType = user.Admin
        }
        userType.createResetPasswordToken(req.body.email).then(()=>{
            res.status(200).send();
        }).catch((e)=>{
            res.status(500).send(e)
        })
    })

    router.post('/reset-password', (req, res)=>{
        let userType = user.User;
        if(req.header('x-userType') == 'Admin'){
            userType = user.Admin
        }
        userType.changePassword(req.body.token, req.body.newPassword).then(()=>{
            res.status(200).send()            
        }).catch((e)=>{
            res.status(500).send(e)
        })

    })

    app.use('/user' ,router);
}