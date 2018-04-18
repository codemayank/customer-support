Customer-Support
================
A general ticket based customer support app made using Node.js, MongoDB, Express on backend and Angular.js on the front end.

The Aim of the project is to create an online ticket based support system, which will be usable by any kind of platform to get support queries from their users and resolve them.

The Project is can be divided in two parts User End accessible to the users / customers and Admin end accessible to the customer support team of service.

## Features User End:
1. A view to login and register on the app. Also a view for forgot password and reset password.
2. A view to list all the queries rasied by the user.
3. A view to show a particular query by the person.
4. User can edit / delete a particular query.
5. User can mark a query as resovled.
6. User can submit messages to the admin on this query.
7. User can edit individual messages.
8. User can delete individual messages.
9. Once admin submits a response to the query the user receives a email message.

## Features Admin End:
1. A view to login and register on the App. Admins require a admin id to register and login on the app.
2. A view for forgot passwod and reset password.
3. A view to list all the queries submitted by the users. Admin can filter the queries based on status, users.
4. A view to show the details of a particualar query.
5. Admin can close certain queries if the query has been marked resolved by the user.
6. Admin can submit response to the user.
7. Admins receive emails when the user submits a query.

Usage
=====

To run the app on local server on your machine.

You will need the following programs
1. Node.js
2. MongoDB
4. npm
3. bower

Once you have the above programs installed follow the below steps.

1. clone the repository

```bash
  git clone https://github.com/codemayank/customer-support.git
```
2. Navigate to the directory where the sourcecode for conversations has been downloaded.

3. install all the server side dependencies.

```bash
  npm install
```

4. install all the client side dependencies.
    ```bash
        cd client
        bower install
    ```
    run to install if bower not already installed.
    ```bash
        npm install bower -g
    ```
5. Start the MongoDB server by running.

  ```bash
    ./mongod
  ```
6. In the set the email specifications in the env.js file if you want to use the email features of the app.

6. start the app.

```bash
  node server/server.js
```

7. The app should now be open on localhost port 3000.

Created by
==========
Mayank yadav
