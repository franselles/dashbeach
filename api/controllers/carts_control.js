'use strict';
const mongoose = require('mongoose');
const dayjs = require('dayjs');

const Carts = require('../models/carts_model');
const { getCheckFilled } = require('./filled_control');
const { getSectorFunction } = require('./sectors_control');

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

function generateUUID(s) {
  let d = new Date().getTime();
  const uuid = s.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
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
      data.ticketID = generateUUID('xxx') + '-' + ('00000000' + nt).slice(-8);
      // data.ticketID = req.body.ticketID;
      data.canceled = req.body.canceled;
      data.payed = true;
      data.lang = req.body.lang;
      data.payMethod = req.body.payMethod;
      data.detail = req.body.detail;
      data.coupon = req.body.coupon;
      for (const iterator of data.detail) {
        let sector = await getSectorFunction(
          iterator.cityID,
          iterator.beachID,
          iterator.sectorID
        );
        iterator.city = sector.city;
        iterator.beach = sector.beach;
        iterator.sector = sector.sector;
      }
      data.save((err, docStored) => {
        if (err)
          res.status(500).send({
            message: `Error al salvar en la base de datos: ${err} `,
          });

        res.status(200).send({
          success: true,
          data: {
            id: docStored.ticketID,
          },
        });
      });
    } else {
      res.status(200).send({
        success: false,
        code: 1,
        data: check,
      });
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
    data.payed = true;
    data.lang = req.body.lang;
    data.payMethod = req.body.payMethod;
    data.detail = req.body.detail;
    data.coupon = req.body.coupon;

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

async function getTicketNumberFunction() {
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

  let ticketNumber = await getTicketNumberFunction();

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
      ticketID: generateUUID('xxx') + '-' + ('00000000' + nt).slice(-8),
      canceled: payload.canceled,
      payed: payload.payed,
      lang: req.body.lang,
      payMethod: req.body.payMethod,
      coupon: req.body.coupon,
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

  Carts.insertMany(cart, function (err, docStored) {
    if (err)
      res.status(500).send({
        message: `Error al salvar en la base de datos: ${err} `,
      });

    res.status(200).send({ message: 'OK', docStored: docStored });
  });
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
        'detail.date': date,
      },
    },
    { $sort: { 'detail.sectorID': 1, 'detail.typeID': 1 } },
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
        quantity: '$detail.quantity',
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

function getCartsDetailGropuedSector(req, res) {
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
        'detail.date': date,
      },
    },
    {
      $group: {
        _id: {
          userID: '$userID',
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
          quantity: '$detail.quantity',
          price: '$detail.price',
          used: '$detail.used',
          dateTimeUsed: '$detail.dateTimeUsed',
          numberItem: '$detail.numberItem',
        },
      },
    },
    {
      $sort: {
        '_id.userID': 1,
        '_id.cityID': 1,
        '_id.beachID': 1,
        '_id.sectorID': 1,
        '_id.typeID': 1,
      },
    },
  ])

    // Carts.find({
    //   payed: true,
    //   detail: { $elemMatch: { date: date } },
    // })

    // Carts.aggregate([
    //   {
    //     $match: {
    //       payed: true,
    //     },
    //   },
    //   {
    //     $match: {
    //       'detail.date': date,
    //     },
    //   },
    // ])
    .exec((err, doc) => {
      if (err)
        return res.status(500).send({
          message: `Error al realizar la petición: ${err}`,
        });
      if (!doc)
        return res.status(404).send({
          message: 'No existe',
        });

      let docReformated = [];

      for (const iterator of doc) {
        docReformated.push(iterator._id);
      }

      res.status(200).send(docReformated);
    });
}

function getCartsDetailGropuedItems(req, res) {
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
        'detail.date': date,
      },
    },
    {
      $group: {
        _id: {
          date: '$detail.date',
          typeID: '$detail.typeID',
          type: '$detail.type',
          price: '$detail.price',
        },
        total: { $sum: '$detail.quantity' },
      },
    },
    {
      $sort: {
        '_id.typeID': 1,
      },
    },
  ])

    // Carts.find({
    //   payed: true,
    //   detail: { $elemMatch: { date: date } },
    // })

    // Carts.aggregate([
    //   {
    //     $match: {
    //       payed: true,
    //     },
    //   },
    //   {
    //     $match: {
    //       'detail.date': date,
    //     },
    //   },
    // ])
    .exec((err, doc) => {
      if (err)
        return res.status(500).send({
          message: `Error al realizar la petición: ${err}`,
        });
      if (!doc)
        return res.status(404).send({
          message: 'No existe',
        });

      let docReformated = [];

      for (const iterator of doc) {
        let objDoc = {};
        let obj = Object.assign(objDoc, iterator._id);
        obj.total = iterator.total;
        obj.amount = iterator.total * obj.price;
        docReformated.push(obj);
      }

      res.status(200).send(docReformated);
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
        quantity: '$detail.quantity',
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

function getTicketNumberByYearFunction() {
  const dateL = new Date();
  const y = String(dateL.getFullYear());

  return new Promise(resolve => {
    Carts.aggregate([
      {
        $project: {
          year: { $substr: ['$date', 0, 4] },
        },
      },
      {
        $match: {
          year: y,
        },
      },
      {
        $group: {
          _id: {
            year: '$year',
          },
          tickets: {
            $sum: 1,
          },
        },
      },
    ]).exec((err, doc) => {
      resolve(doc);
    });
  });
}

function getTicketNumberByYear(req, res) {
  const dateL = new Date();
  const y = String(dateL.getFullYear());

  Carts.aggregate([
    {
      $project: {
        year: { $substr: ['$date', 0, 4] },
      },
    },
    {
      $match: {
        year: y,
      },
    },
    {
      $group: {
        _id: {
          year: '$year',
        },
        tickets: {
          $sum: 1,
        },
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

function getTicketNumber(req, res) {
  Carts.aggregate([
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

function getTicket(req, res) {
  const ticketID = req.query.id;

  Carts.findOne({
    ticketID: ticketID,
    payed: false,
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

module.exports = {
  postCart,
  getCarts,
  getTicketNumber,
  getCartsDetail,
  getItemUserDetail,
  getItemUser,
  postUsed,
  checkAvaiability,
  postCartCheck,
  getTicket,
  getTicketNumberByYear,
  getTicketNumberByYearFunction,
  postMultiCart,
  getCartsDetailGropuedSector,
  getCartsDetailGropuedItems,
};
