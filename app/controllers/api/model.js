'use strict';
const co = require('co');
const handleError = require('../../../helpers/controller').handleError;
const modelBll = require('../../bll/model');

exports.modelObj = function modelCreate(req, res) {
  const msg = req.body.data;
  const name = modelBll.modelObj(msg);
  res.send({"file":name});
};
