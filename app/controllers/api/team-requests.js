'use strict';
const co = require('co');
const handleError = require('../../../helpers/controller').handleError;
const requestsBll = require('../../bll/team-requests');

exports.create = function requestsCreate(req, res) {
  co(function* () {
    const request = req.body.request;
    const newRequest = yield requestsBll.create(request, req.user);
    res.send(newRequest);
  }).catch(handleError(req, res));
};
