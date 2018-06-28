const express = require('express'),
  router = express.Router(),
  ticket = require('../models/query-model'),
  message = require('../models/message-model'),
  user = require('../models/user-model'),
  _ = require('lodash'),
  queryEventEmitter = require('../lib/mailer'),
  authenticate = require('../controllers/middlewares/authenticate')

module.exports.controller = app => {
  //route to submit new query.
  router.post('/user/submit-query', authenticate, (req, res) => {
    let newTicket = new ticket({
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      qTitle: req.body.qTitle,
      qDescription: req.body.qDescription,
      resolved: false,
      status: 'open',
      createdAt: new Date().getTime(),
      _creator: {
        id: req.user._id,
        username: req.user.username
      }
    })
    newTicket.save(err => {
      if (err) {
        console.log(
          'There was an error in saving your query at this time.',
          err
        )
      }

      queryEventEmitter.emit('queryCreated', {
        ticket: newTicket,
        db: user.Admin
      })
      res.send(newTicket)
    })
  })

  //route to send the queries to the user.
  router.get('/user/show-queries', authenticate, (req, res) => {
    ticket
      .find({
        '_creator.id': req.user._id
      })
      .then(
        tickets => {
          res.send({ tickets })
        },
        e => {
          res.status(400).send(e)
        }
      )
  })

  //route to send a specific query to the user.
  router.get('/user/:ticket_id', authenticate, (req, res) => {
    ticket
      .findOne({ _id: req.params.ticket_id, '_creator.id': req.user._id })
      .populate('messages')
      .then(
        ticket => {
          res.send({ ticket })
        },
        e => {
          res.status(400).send(e)
        }
      )
  })

  //route to edit the query
  router.put('/user/edit-query', authenticate, (req, res) => {
    let body = _.pick(req.body, ['ticket_id', 'qTitle', 'qDescription'])
    if (body.ticket_id && body.qTitle && body.qDescription) {
      ticket.findOneAndUpdate(
        {
          '_creator.id': req.user._id,
          _id: body.ticket_id
        },
        { qTitle: body.qTitle, qDescription: body.qDescription },
        { new: true },
        (err, query) => {
          if (err) {
            console.log('error in saving the edited query.')
            res.status(400).send(err)
          }

          res.send(query)
          queryEventEmitter.emit('queryAction', {
            ticket_id: req.body.ticket_id,
            db: user.Admin,
            action: 'edited'
          })
        }
      )
    } else {
      res.send('Not sufficent data was sent')
    }
  })

  //route to delete the query
  router.delete('/user/delete-query/:queryId', authenticate, (req, res) => {
    ticket.findOneAndRemove(
      {
        '_creator.id': req.user._id,
        _id: req.params.queryId
      },
      err => {
        if (err) {
          res.status(400).send(err)
        } else {
          queryEventEmitter.emit('queryAction', {
            ticket_id: req.params.queryId,
            db: user.Admin,
            action: 'deleted'
          })
          res.send('The query has been deleted.')
        }
      }
    )
  })

  //route to mark the query as resolved from user end.
  router.put('/user/mark-resolved/:queryId', authenticate, (req, res) => {
    ticket.findOneAndUpdate(
      {
        '_creator.id': req.user._id,
        _id: req.params.queryId
      },
      { resolved: true },
      { new: true },
      (err, query) => {
        if (err) {
          res.status(400).send('unable to resolve query.')
        }
        if (!query) {
          res.send('could not resolve query as you do not own this.')
        } else {
          res.send('query marked resolved')
          queryEventEmitter.emit('queryAction', {
            ticket_id: req.params.queryId,
            db: user.Admin,
            action: 'Marked Resolved'
          })
        }
        //send e-mail to the admins that has been corresponding with this guy that the query has been marked as resolved.
      }
    )
  })

  //route to show all the queries to the admins.
  router.get('/admin/show-queries', authenticate, (req, res) => {
    if (req.user.tokens[0].access === 'adminAuth') {
      ticket.find().then(
        tickets => {
          res.send({ tickets })
        },
        e => {
          res.status(400).send(e)
        }
      )
    } else {
      res.status(401).send()
    }
  })

  //route to show a specific query to the admin.
  router.get('/admin/:ticket_id', authenticate, (req, res) => {
    if (req.user.tokens[0].access === 'adminAuth') {
      ticket
        .findOne({ _id: req.params.ticket_id })
        .populate('messages')
        .then(
          ticket => {
            res.send({ ticket })
          },
          e => {
            res.status(400).send(e)
          }
        )
    } else {
      res.status(400).send(e)
    }
  })

  //route to mark the qury as closed by the admin.
  router.put('/admin/close-query/:query_id', authenticate, (req, res) => {
    if (req.user.tokens[0].access === 'adminAuth') {
      ticket.findOneAndUpdate(
        { _id: req.params.query_id, resolved: true },
        { status: 'Closed' },
        (err, ticket) => {
          if (err) {
            res.status(400).send(err)
          } else {
            res.send('This query has now been closed and will now be archived.')
          }
        }
      )
    } else {
      res.status(401).send()
    }
  })

  app.use('/query', router)
}
