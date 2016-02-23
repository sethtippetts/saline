'use strict';

module.exports = class SalineError extends Error {

  constructor(message) {
    super(`saline: ${message}`);
    Error.captureStackTrace(this, this.constructor);
    this.message = `saline: ${message}`;
  }

  get name() {
    return this.constructor.name;
  }

};
