'use strict';

const Schema = require('./lib/schema');
const Saline = require('./lib/saline');

const saline = new Saline();

module.exports = exports = saline;

exports.Schema = Schema;
exports.Saline = Saline;
