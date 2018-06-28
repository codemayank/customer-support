# Customer-Support

A general ticket based customer support app made using Node.js, MongoDB, Express on backend and Angular.js on the front end.

The Aim of the project is to create an online ticket based support system, which will be usable by any kind of platform to get support queries from their users and resolve them.

The Project is can be divided in two parts User End accessible to the users / customers and Admin end accessible to the customer support team of service.

### Features User End:

1.  A view to login and register on the app. Also a view for forgot password and reset password.
2.  A view to list all the queries rasied by the user.
3.  A view to show a particular query by the person.
4.  User can edit / delete a particular query.
5.  User can mark a query as resovled.
6.  User can submit messages to the admin on this query.
7.  User can edit individual messages.
8.  User can delete individual messages.
9.  Once admin submits a response to the query the user receives a email message.

### Features Admin End:

1.  A view to login and register on the App. Admins require a admin id to register and login on the app.
2.  A view for forgot passwod and reset password.
3.  A view to list all the queries submitted by the users. Admin can filter the queries based on status, users.
4.  A view to show the details of a particualar query.
5.  Admin can close certain queries if the query has been marked resolved by the user.
6.  Admin can submit response to the user.
7.  Admins receive emails when the user submits a query.

### Assumptions

1.  Multiple admins can register on the app, can view and take action on any queries.
2.  Currently all users can register as admins by providing a unique admin id, in production app
    the admin id will be provided by the company and only the company employees that have the admin id
    can register on the app as admins. Admin ids can be stored in the db and checked for vaildity during admin registration. Currently this feature has not been implemented.

### Created by

Mayank yadav
