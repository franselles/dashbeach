'use strict';

const express = require('express');
// const jwt = require('jsonwebtoken');
const api = express.Router();

require('dotenv').config();

const citiesControl = require('../controllers/cities_control.js');
const beachesControl = require('../controllers/beaches_control.js');
const itemsControl = require('../controllers/items_control.js');
const usersControl = require('../controllers/users_control.js');
const employeesControl = require('../controllers/employees_control.js');
const filledControl = require('../controllers/filled_control.js');
const sectorsControl = require('../controllers/sectors_control.js');
const cartsControl = require('../controllers/carts_control.js');

// const usersControl = require('../controllers/users_control.js');

// Cities
api.get('/cities', citiesControl.getCities);
api.get('/redireccion', citiesControl.redireccion);
api.get('/redireccion2', citiesControl.redireccion2);

// Beaches
api.get('/beaches', beachesControl.getBeaches);

// Carts
api.post('/cart', cartsControl.postCart2);
api.get('/carts', cartsControl.getCarts);
api.get('/tickets', cartsControl.getTicketNumber);
api.get('/detailday', cartsControl.getCartsDetail);

// Users
api.get('/user/email', usersControl.checkEmail);
api.get('/user/id', usersControl.getUserID);
api.get('/user', usersControl.getUser);
api.post('/user', usersControl.postUser);

// Employees
api.get('/employee', employeesControl.getEmployee);
api.post('/employee', employeesControl.postEmployee);

// Sold tickest and filled sectors
api.get('/state', filledControl.getFilled);
api.post('/checkcart', filledControl.getStock);

// Sectors
api.post('/sectors', sectorsControl.postSectors);
api.get('/sectors', sectorsControl.getSectors);
api.get('/sector', sectorsControl.getSector);
api.put('/sector', sectorsControl.putSector);
api.post('/sector', sectorsControl.postSector);

// Items
api.get('/items', itemsControl.getItemsCitySector);
api.get('/item', itemsControl.getItem);
api.put('/item', itemsControl.putItem);
api.put('/items', itemsControl.putItems);
api.delete('/items', itemsControl.deleteItems);
api.delete('/item', itemsControl.deleteItem);
api.post('/items', itemsControl.postItems);
api.post('/item', itemsControl.postItem);

//  Users check, token and cookie
// api.post('/login', usersControl.postUsersToken);

api.get('/', function (request, response) {
  response.send('NODE AT WORK!!!');
});

// Check the TOKEN of user
// function middlewareRouter(req, res, next) {
//   // let tokenHeader = req.headers['authorization'].split(' ');
//   // let token = tokenHeader[1];
//   let token = req.cookies['csrftoken'];

//   jwt.verify(token, process.env.KEY, function (err) {
//     if (err) {
//       res.status(401).send({
//         message: 'Forbidden',
//       });
//     } else {
//       next();
//     }
//   });
// }

module.exports = api;
