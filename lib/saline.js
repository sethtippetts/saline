'use strict';

const Bluebird = require('bluebird');
const assert = require('./utils/assert');
const SalineError = require('./utils/error');
const Connection = require('./connection');
const Schema = require('./schema');
const Model = require('./model');

/**
 * @class Saline
 * @classdesc A Salesforce connection pool instance that manages multiple
 * tentants and model/schema definitions.
 */

class Saline {

  constructor() {
    this.models = {};
  }

  /**
   * @function Saline#connect
   * @returns {Promise} Resolves when all connections have been esablished
   */
  connect(config) {
    if (this.connection) return Bluebird.reject(new SalineError('A connection has already been initialized'));

    Object.defineProperty(this, 'connection', {
      value: new Connection(config),
    });

    return this.connection.getConnection().return();
  }

  /**
   * @function Saline#model
   * @param {string} name - The name of the model
   * @param {Schema} schema - The schema to convert into a model
   * @param {object} options - Model configuration options
   *
   * @returns {Saline} The saline instance
   */
  model(name, schema, options) {
    assert(schema instanceof Schema, `Non-Schema passed to saline.model: ${name}`);

    this.models[name] = new Model(schema, this, options);

    return this.models[name];
  }

  /**
   * @function Saleman#getModel
   * @param {string} modelName - The model name to retrieve
   * @returns {Promise} resolves to tenants module
   */
  getModel(modelName) {
    assert(this.models[modelName], `'${modelName}' is not a valid model`);

    return this.models[modelName];
  }

}

module.exports = Saline;
