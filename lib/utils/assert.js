'use strict';

const assert = require('assert');

module.exports = exports = function salemanAssert(condition, message, ErrorType) {
  try {
    assert(condition, `saline: ${message}`);
  } catch (err) {
    if (ErrorType) throw new ErrorType(message);
    throw err;
  }
};
