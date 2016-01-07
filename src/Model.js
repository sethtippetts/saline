
export default class Model {
  constructor(name, schemata, saline) {
    this.connection = connection;
    this.schemata = schemata;
  }
  static find(...args) {
    return this
      .sobject()
      .find(...args);
  }
  save(...args) {
    return this
      .sobject()
      .create(...args);
  }
  sobject() {
    return saline
      .getConnection()
      .sobject(this.schemata.tableName);
  }
}
