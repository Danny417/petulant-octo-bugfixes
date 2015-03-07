/**
 * Node.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
	/*connection: 'mysql',
	tableName: 'node',
	autoPK: false,*/
	attributes: {
		hostname: {
			type: 'string',
			primaryKey: true,
			required: true
		},
		ip: {
			type: 'string'
		},
		systemUptime: {
			type: 'datetime'
		},
		spaceAvailable: {
			type: 'integer'
		},
		averageLoads: {
			type: 'string'
		},
		serviceUptime: {
			type: 'datetime'
		},
		city: {
			type: 'string'
		},
		country: {
			type: 'string'
		},
		countryCode: {
			type: 'string'
		},
		lat: {
			type: 'float'
		},
		lon: {
			type: 'float'
		},
		regionName: {
			type: 'string'
		},
		timezone: {
			type: 'string'
		},
		org: {
			type: 'string'
		}
	}
};
