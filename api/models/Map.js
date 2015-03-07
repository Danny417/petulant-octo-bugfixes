/**
 * Map.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  /*connection: 'mysql',
  tableName: 'map',
  autoPK: false,*/
  attributes: {
    key: {
      type: 'string',
      primaryKey: true,
      required: true,
      columnName: 'keyid'
    },
    value: {
      type: 'text'
    }
  }
};
