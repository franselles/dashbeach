'use strict';
const bcrypt = require('bcrypt');
require('dotenv').config();

const Users = require('../models/users_model');

function getUserID(req, res) {
  const userID = req.query.userID;
  Users.find({
    userID: userID,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

async function getUserPhone(phone) {
  return await Users.findOne({
    phone: phone,
  }).exec();
}

function getUsers(req, res) {
  Users.find().exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

function checkEmail(req, res) {
  const email = req.query.email;
  Users.find({
    email: email,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0) return res.status(404).send(false);

    res.status(200).send(true);
  });
}

function postUser(req, res) {
  const data = new Users();

  const date = new Date();

  data.name = req.body.name;
  data.email = req.body.email;
  data.password = req.body.password;
  data.phone = req.body.phone;
  data.date = date.toISOString().split('T')[0];
  data.banned = false;
  data.bannedDate = null;
  data.userID = req.body.phone;
  data.auxID = req.body.auxID;

  bcrypt
    .hash(data.password, Number(process.env.BCRYPT_SALT_ROUNDS))
    .then(function (hashedPassword) {
      data.password = hashedPassword;
      data.save((err, docStored) => {
        if (err)
          res.status(500).send({
            message: `Error al salvar en la base de datos: ${err} `,
          });

        return res.status(200).send({
          _id: docStored._id,
          name: docStored.name,
          phone: docStored.phone,
          userID: docStored.userID,
          auxID: docStored.auxID,
        });
      });
    })
    .catch(function (err) {
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    });
}

function getUser(req, res) {
  const email = req.query.email;
  const password = req.query.password;

  Users.find({
    email: email,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (doc.length == 0)
      return res.status(404).send({
        message: 'No existe',
      });

    bcrypt
      .compare(password, doc[0].password)
      .then(function (result) {
        if (result) {
          return res.status(200).send({
            _id: doc[0]._id,
            name: doc[0].name,
            phone: doc[0].phone,
            userID: doc[0].userID,
            auxID: doc[0].auxID,
          });
        } else {
          return res.status(404).send({
            message: 'No existe',
          });
        }
      })
      .catch(function (err) {
        return res.status(500).send({
          message: `Error al realizar la petición: ${err}`,
        });
      });
  });
}

module.exports = {
  getUserID,
  postUser,
  getUser,
  checkEmail,
  getUsers,
  getUserPhone,
};
