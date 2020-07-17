'use strict';

const Employees = require('../models/employees_model');

function getEmployee(req, res) {
  const dni = req.query.dni;
  // const password = req.query.password;

  Employees.find({
    dni: dni,
    // password: password,
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

function postEmployee(req, res) {
  const data = new Employees();

  data.name = req.body.name;
  data.dni = req.body.dni;
  data.password = req.body.password;
  data.phone = req.body.phone;
  data.active = req.body.active;

  data.save((err, docStored) => {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    res.status(200).send(docStored._id);
  });
}

module.exports = {
  getEmployee,
  postEmployee,
};
