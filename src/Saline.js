import assert from 'assert';
import Model from './Model';
import { Connection as JSForceConnection } from 'jsforce';
import Promise from 'bluebird';
import Pool from 'pool-party';
import Connection from './Connection';

export default class Saline {
  constructor(config, options) {
    this.models = {};
    this.connections = [];
    this.createConnection(config);
  }

  model(name, schemata) {
    if (typeof schemata !== 'object') {
      let model = this.models[name];
      assert(model, `Model "${name}" not found.`);

      return model;
    }
    return this.models[name] = new Model(name, schemata, this);
  }

  getConnection() {
    return Promise.any(this.connections);
  }

  static parseConnectionUrl(str) {
    // FORMAT:  `{username}:{password}+{token}@{hostname}`

    // If there are commas, it's a set.
    if (~str.indexOf(',')) return str.split(',').map(Connection.parseConnectionUrl);

    // Split the string into parts
    let [username, password, token, hostname] = str.split(/[:+@]/g);
    return { username, password, token, hostname };
  }
  query(query, cb) {
    this.getConnection()
      .then(conn => conn.query(query));
  }
  connect(config) {

    if (typeof config === 'string') config = Connection.parseConnectionUrl(config);
    if (Array.isArray(config)) return config.map(c => this.createConnection(c));

    let { username, password, hostname, token } = config;
    assert(username, 'Missing connection username.');
    assert(password, 'Missing connection password.');
    assert(hostname, 'Missing connection hostname.');

    let connection = new Pool({
      factory() {
        let conn = JSForceConnection({
          loginUrl: hostname,
          accessToken: token,
        });

        return Promise.fromCallback(cb => conn.login(username, password + token, cb).return(conn));
      },
      destroy(conn){
        return Promise.fromCallback(cb => conn.logout(cb));
      },
    });

    this.connections.push(connection);
  }
}
