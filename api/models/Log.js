/**
 * Log.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  /*connection: 'mysql',
	tableName: 'log',*/
  attributes: {
    type: {
      type: 'string'
    },
    msg: {
      type: 'text'
    }
  }
};
