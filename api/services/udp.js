var dgram = require('dgram'),
	udpServer = dgram.createSocket('udp4'),
	udpClient = dgram.createSocket('udp4'),
	http = require('http'),
	options = {
		host: "ip-api.com",
		port: 80,
		path: "/json/",
		method: 'GET'
	};
module.exports = {
	sets: [],
	cache: {},
	adapter: udpServer,
	client: udpClient,
	setup: function() {
		var that = this;
		udpServer.on('listening', function() {
			'use strict';
			console.log('UDP Server listening on ' + udpServer.address().address +
				":" + udpServer.address().port);
		});

		udpClient.on('listening', function() {
			'use strict';
			console.log('UDP Client listening on ' + udpClient.address().address +
				":" + udpClient.address().port);
		});

		udpClient.on('message', function(data, remote) {
			'use strict';
			var msg = '';
			try {
				var buf = new Buffer(data);
				var uid = buf.toString('hex', 0, 16);
				if (!!that.cache[uid]) {
					switch (buf[16]) {
						case 0:
							msg = 'Successfully ';
							if (that.cache[uid].data[16] == 1) {
								msg += 'put value to key "' + that.cache[uid].data.toString(
									'utf8', 17, 49) + '" in ';
							} else if (that.cache[uid].data[16] == 2) {
								msg += 'get value "' + buf.toString('utf8', 19, (buf.readUInt16LE(
										17) +
									19)) + '" from key "' + that.cache[uid].data.toString(
									'utf8', 17, 49) + '" in ';
							} else if (that.cache[uid].data[16] == 3) {
								msg += 'remove value from key "' + that.cache[uid].data
									.toString('utf8',
										17, 49) + '" in ';
							} else if (that.cache[uid].data[16] == 4) {
								msg += 'shutdown machine ';
							}
							break;
						case 1:
							msg = "Key does not exisit in ";
							break;
						case 2:
							msg = "Not available space in ";
							break;
						case 3:
							msg = "System overload in ";
							break;
						case 4:
							msg = "Internal KVStore failure";
							break;
						case 5:
							msg = "Unrecognized command";
							break;
						default:
							msg = 'unknown response from ';
							break;
					}
					delete that.cache[uid];
					sails.sockets.blast("logUpdate", msg + remote.address +
						'.');
				}
			} catch (err) {
				sails.sockets.blast("logUpdate", err.toString());
			}
		});
		udpServer.on('message', function(data, remote) {
			'use strict';
			try {
				var obj = JSON.parse(data.toString('utf8'));
				if (!!sails.config.nodes[obj.hostname]) {
					obj.logs = sails.config.nodes[obj.hostname].logs.concat(
						obj.logs);
				}
				sails.config.nodes[obj.hostname] = obj;
				sails.config.nodes[obj.hostname].ip = remote.address;
				sails.config.nodes[obj.hostname].status = true;
				sails.config.nodes[obj.hostname].lastReceived = new Date();
				if (obj.loc.status === 'fail') {
					sails.config.nodes[obj.hostname].country =
						"Canada";
					sails.config.nodes[obj.hostname].countryCode =
						"CAN";
					sails.config.nodes[obj.hostname].city =
						"Vancouver";
					sails.config.nodes[obj.hostname].latitude =
						49.246292;
					sails.config.nodes[obj.hostname].longitude = -
						123.116226;
					/*options.path = "/json/" + remote.address;
					http.request(options, function(response) {
					  console.log(response);
					});*/
				} else {
					sails.config.nodes[obj.hostname].country = obj.loc
						.country;
					sails.config.nodes[obj.hostname].countryCode =
						obj.loc.countryCode;
					sails.config.nodes[obj.hostname].city = obj.loc.city;
					sails.config.nodes[obj.hostname].latitude = obj.loc
						.lat;
					sails.config.nodes[obj.hostname].longitude = obj.loc
						.lon;
					sails.config.nodes[obj.hostname].org = obj.loc.org;
					sails.config.nodes[obj.hostname].timezone = obj.loc
						.timezone;
				}
				sails.sockets.blast("nodeUpdate", sails.config.nodes[
					obj.hostname]);
				//console.log(sails.config.nodes[obj.hostname]);
			} catch (e) {
				console.log('from : ' + remote.address + ':' +
					remote.port);
				console.log(e);
			}
			//var nodes = JSON.parse(data.toString('utf8', 16));
			//io.emit('nodenamechange', nodes);
			//var buf = new Buffer('active');
			//udpServer.send(buf, 0, buf.length, config.UDPPORT_SEND, '127.0.0.1');
		});

		udpClient.bind(41784);
		udpServer.bind(41170);

		var later = require('later'),
			sched = later.parse.text('every 20 sec'),
			timer = later.setInterval(function() {
				var isUpdated = false;
				for (var hostname in sails.config.nodes) {
					isUpdated = false;
					if (sails.config.nodes.hasOwnProperty(hostname)) {
						if ((new Date()) - sails.config.nodes[hostname].lastReceived >
							30000) {
							sails.config.nodes[hostname].status = false;
							isUpdated = true;
						}
						var diff = sails.config.nodes[hostname].logs.length -
							50;
						if (diff > 0) {
							sails.config.nodes[hostname].logs.splice(0,
								diff);
							isUpdated = true;
						}
						if (isUpdated) {
							sails.sockets.blast("nodeUpdate", sails.config.nodes[
								hostname]);
						}
					}
				}
			}, sched);
	}
};
