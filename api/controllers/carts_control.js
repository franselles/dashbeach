'use strict';
const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Carts = require('../models/carts_model');
const { getCheckFilled } = require('./filled_control');

function postUsed(req, res) {
  const id = req.body.id;

  Carts.findOneAndUpdate(
    { 'detail._id': id },
    {
      $set: {
        'detail.$.used': true,
        'detail.$.dateTimeUsed': dayjs(new Date()).format('YYYY-MM-DD HH:MM'),
      },
    },
    { new: true }
  ).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (!doc)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

async function checkAvaiability(req, res) {
  let data = req.body;
  let toRemove = [];

  try {
    for (const item of data.detail) {
      let result = await getCheckFilled({
        cityID: item.cityID,
        beachID: item.beachID,
        sectorID: item.sectorID,
        typeID: item.typeID,
        date: item.date,
      });
      if (result.available < item.quantity) {
        let excess = item.quantity - result.available;
        toRemove.push({ ...result, excess: excess });
      }
    }
    res.status(200).send(toRemove);
  } catch (error) {
    return res.status(404).send(error);
  }
}

async function checkAvaiabilityFunction(data) {
  let toRemove = [];

  try {
    for (const item of data.detail) {
      let result = await getCheckFilled({
        cityID: item.cityID,
        beachID: item.beachID,
        sectorID: item.sectorID,
        typeID: item.typeID,
        date: item.date,
      });
      if (result.available < item.quantity) {
        let excess = item.quantity - result.available;
        toRemove.push({ ...result, excess: excess });
      }
    }
    return toRemove;
  } catch (error) {
    console.log(error);
  }
}

async function postCartCheck(req, res) {
  try {
    const check = await checkAvaiabilityFunction(req.body);
    const numTicket = await getTicketNumberFunction();
    let nt = 1;
    if (numTicket.length > 0) {
      nt = numTicket[0].tickets + 1;
    }

    if (check.length == 0) {
      const data = new Carts();

      data.date = req.body.date;
      data.userID = req.body.userID;
      data.phone = req.body.phone;
      data.ticketID = ('00000000' + nt).slice(-8);
      // data.ticketID = req.body.ticketID;
      data.canceled = req.body.canceled;
      data.payed = true;
      data.detail = req.body.detail;

      data.save(err => {
        if (err)
          res.status(500).send({
            message: `Error al salvar en la base de datos: ${err} `,
          });

        res.status(200).send(true);
      });
    } else {
      res.status(200).send(check);
    }
  } catch (error) {
    return res.status(404).send(error);
  }
}

async function postCart(req, res) {
  try {
    const data = new Carts();

    data.date = req.body.date;
    data.userID = req.body.userID;
    data.phone = req.body.phone;
    data.ticketID = req.body.ticketID;
    data.canceled = req.body.canceled;
    data.payed = req.body.payed;
    data.detail = req.body.detail;

    data.save(err => {
      if (err)
        res.status(500).send({
          message: `Error al salvar en la base de datos: ${err} `,
        });

      res.status(200).send(true);
    });
  } catch (error) {
    return res.status(404).send(error);
  }
}

function getStock(cart) {
  let exists = [];

  try {
    return new Promise(function(resolve) {
      cart.detail.forEach((element, index) => {
        Carts.aggregate([
          {
            $match: {
              payed: true,
            },
          },
          { $unwind: '$detail' },
          {
            $match: {
              'detail.cityID': Number(element.cityID),
              'detail.beachID': Number(element.beachID),
              'detail.sectorID': Number(element.sectorID),
              'detail.typeID': Number(element.typeID),
              'detail.date': element.date,
              'detail.row': element.row,
              'detail.col': element.col,
            },
          },
          {
            $project: {
              date: '$detail.date',
              cityID: '$detail.cityID',
              city: '$detail.city',
              beachID: '$detail.beachID',
              beach: '$detail.beach',
              sectorID: '$detail.sectorID',
              sector: '$detail.sector',
              typeID: '$detail.typeID',
              type: '$detail.type',
              itemID: '$detail.itemID',
              col: '$detail.col',
              row: '$detail.row',
              price: '$detail.price',
              used: '$detail.used',
              dateTimeUsed: '$detail.dateTimeUsed',
              numberItem: '$detail.numberItem',
            },
          },
        ]).exec((err, doc) => {
          if (err) return { error: 500 };
          if (doc.length > 0) {
            exists.push(doc[0]);
          }

          if (index == cart.detail.length - 1) {
            resolve(exists);
          }
        });
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function getCarts(req, res) {
  const userID = req.query.userID;

  Carts.find({
    userID: userID,
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (!doc)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

function getCartsDetail(req, res) {
  const userID = req.query.userID;
  const date = req.query.date;

  Carts.aggregate([
    {
      $match: {
        payed: true,
      },
    },
    { $unwind: '$detail' },
    {
      $match: {
        userID: userID,
        'detail.date': { $gte: date },
      },
    },
    { $sort: { 'detail.date': 1, col: 1, row: 1 } },
    {
      $project: {
        date: '$detail.date',
        cityID: '$detail.cityID',
        city: '$detail.city',
        beachID: '$detail.beachID',
        beach: '$detail.beach',
        sectorID: '$detail.sectorID',
        sector: '$detail.sector',
        typeID: '$detail.typeID',
        type: '$detail.type',
        itemID: '$detail.itemID',
        col: '$detail.col',
        row: '$detail.row',
        price: '$detail.price',
        used: '$detail.used',
        dateTimeUsed: '$detail.dateTimeUsed',
        numberItem: '$detail.numberItem',
      },
    },
  ]).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (!doc)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

function getItemUser(req, res) {
  const id = req.query.id;
  const ObjectId = mongoose.Types.ObjectId;

  Carts.find({
    'detail._id': ObjectId(id),
  }).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (!doc)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

function getItemUserDetail(req, res) {
  const id = req.query.id;
  const ObjectId = mongoose.Types.ObjectId;

  Carts.aggregate([
    {
      $match: {
        payed: true,
      },
    },
    { $unwind: '$detail' },
    {
      $match: {
        'detail._id': ObjectId(id),
      },
    },
    { $sort: { 'detail.date': 1, col: 1, row: 1 } },
    {
      $project: {
        _id: '$detail._id',
        date: '$detail.date',
        cityID: '$detail.cityID',
        city: '$detail.city',
        beachID: '$detail.beachID',
        beach: '$detail.beach',
        sectorID: '$detail.sectorID',
        sector: '$detail.sector',
        typeID: '$detail.typeID',
        type: '$detail.type',
        itemID: '$detail.itemID',
        col: '$detail.col',
        row: '$detail.row',
        price: '$detail.price',
        used: '$detail.used',
        dateTimeUsed: '$detail.dateTimeUsed',
        numberItem: '$detail.numberItem',
      },
    },
  ]).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (!doc)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

async function getTicketNumberFunc() {
  // const date = req.query.date;

  return new Promise(resolve => {
    Carts.aggregate([
      // {
      //   $match: {
      //     date: date,
      //   },
      // },
      {
        $count: 'tickets',
      },
    ]).exec((err, doc) => {
      resolve(doc);
    });
  });
}

async function postMultiCart(req, res) {
  let payload = req.body;
  let cart = [];

  const date1 = dayjs(payload.dateTo);
  const date2 = dayjs(payload.dateFrom);

  let numDays = date1.diff(date2, 'days') + 1;

  let ticketNumber = await getTicketNumberFunc();

  let nt = 0;
  if (ticketNumber.length > 0) {
    nt = ticketNumber[0].tickets;
  }

  for (let index = 0; index < numDays; index++) {
    let dayIndex = dayjs(payload.dateFrom).add(index, 'day');

    nt++;

    let items = {
      date: dayjs(dayIndex).format('YYYY-MM-DD'),
      userID: payload.userID,
      phone: payload.phone,
      ticketID: ('00000000' + nt).slice(-8),
      canceled: payload.canceled,
      payed: payload.payed,
      detail: [
        {
          date: dayjs(dayIndex).format('YYYY-MM-DD'),
          cityID: payload.detail[0].cityID,
          city: payload.detail[0].city,
          beachID: payload.detail[0].beachID,
          beach: payload.detail[0].beach,
          sectorID: payload.detail[0].sectorID,
          sector: payload.detail[0].sector,
          typeID: payload.detail[0].typeID,
          type: payload.detail[0].type,
          itemID: payload.detail[0].itemID,
          quantity: Number(payload.detail[0].quantity),
          price: Number(payload.detail[0].price),
          codeID: payload.detail[0].codeID,
          used: payload.detail[0].used,
          dateTimeUsed: payload.detail[0].dateTimeUsed,
        },
      ],
    };

    cart.push(items);
  }

  Carts.insertMany(cart, function(err, docStored) {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    res.status(200).send({ message: 'OK', docStored: docStored });
  });
}

function getTicketNumberFunction() {
  // const date = req.query.date;

  return new Promise(resolve => {
    Carts.aggregate([
      // {
      //   $match: {
      //     date: date,
      //   },
      // },
      {
        $count: 'tickets',
      },
    ]).exec((err, doc) => {
      resolve(doc);
    });
  });
}

function getTicketNumber(req, res) {
  // const date = req.query.date;

  Carts.aggregate([
    // {
    //   $match: {
    //     date: date,
    //   },
    // },
    {
      $count: 'tickets',
    },
  ]).exec((err, doc) => {
    if (err)
      return res.status(500).send({
        message: `Error al realizar la petición: ${err}`,
      });
    if (!doc)
      return res.status(404).send({
        message: 'No existe',
      });

    res.status(200).send(doc);
  });
}

module.exports = {
  postCart,
  getCarts,
  getTicketNumber,
  getCartsDetail,
  getStock,
  getItemUserDetail,
  getItemUser,
  postUsed,
  checkAvaiability,
  postMultiCart,
  postCartCheck,
};
