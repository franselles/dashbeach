'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const employeesSchema = new Schema(
  {
    name: { type: String, uppercase: true },
    dni: { type: String, uppercase: true },
    password: { type: String },
    phone: { type: String },
    active: { type: Boolean },
  },
  { collection: 'employees' }
);

module.exports = mongoose.model('Employees', employeesSchema);
