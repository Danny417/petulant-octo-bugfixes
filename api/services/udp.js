var dgram = require('dgram'),
	udpServer = dgram.createSocket('udp4'),
	http = require('http'),
	options = {
		host: "ip-api.com",
		port: 80,
		path: "/json/",
		method: 'GET'
	};
module.exports = {
	adapter: udpServer,
	setup: function() {
		udpServer.on('listening', function() {
			'use strict';
			console.log('UDP Server listening on ' + udpServer.address().address +
				":" + udpServer.address().port);
		});

		udpServer.on('message', function(data, remote) {
			'use strict';
			var obj = JSON.parse(data.toString('utf8'));
			try {
				if (!!sails.config.nodes[obj.hostname]) {
					obj.logs = sails.config.nodes[obj.hostname].logs.concat(obj.logs);
				}
				sails.config.nodes[obj.hostname] = obj;
				sails.config.nodes[obj.hostname].ip = remote.address;
				sails.config.nodes[obj.hostname].status = true;
				sails.config.nodes[obj.hostname].lastReceived = new Date();
				if (obj.loc.status === 'fail') {
					sails.config.nodes[obj.hostname].country = "Canada";
					sails.config.nodes[obj.hostname].countryCode = "CAN";
					sails.config.nodes[obj.hostname].city = "Vancouver";
					sails.config.nodes[obj.hostname].latitude = 49.246292;
					sails.config.nodes[obj.hostname].longitude = -123.116226;
					/*options.path = "/json/" + remote.address;
					http.request(options, function(response) {
					  console.log(response);
					});*/
				} else {
					sails.config.nodes[obj.hostname].country = obj.loc.country;
					sails.config.nodes[obj.hostname].countryCode = obj.loc.countryCode;
					sails.config.nodes[obj.hostname].city = obj.loc.city;
					sails.config.nodes[obj.hostname].latitude = obj.loc.lat;
					sails.config.nodes[obj.hostname].longitude = obj.loc.lon;
					sails.config.nodes[obj.hostname].org = obj.loc.org;
					sails.config.nodes[obj.hostname].timezone = obj.loc.timezone;
				}
				sails.sockets.blast("nodeUpdate", sails.config.nodes[obj.hostname]);
			} catch (e) {
				console.log('from : ' + remote.address + ':' + remote.port);
				console.log(e);
			}
			//var nodes = JSON.parse(data.toString('utf8', 16));
			//io.emit('nodenamechange', nodes);
			//var buf = new Buffer('active');
			//udpServer.send(buf, 0, buf.length, config.UDPPORT_SEND, '127.0.0.1');
		});

		udpServer.bind(41170);

		var later = require('later'),
			sched = later.parse.text('every 30 sec'),
			timer = later.setInterval(function() {
				var isUpdated = false;
				for (var hostname in sails.config.nodes) {
					isUpdated = false;
					if (sails.config.nodes.hasOwnProperty(hostname)) {
						if ((new Date()) - sails.config.nodes[hostname].lastReceived > 30000) {
							sails.config.nodes[hostname].status = false;
							isUpdated = true;
						}
						var diff = sails.config.nodes[hostname].logs.length - 100;
						if (diff > 0) {
							sails.config.nodes[hostname].logs.splice(0, diff);
							isUpdated = true;
						}
						if (isUpdated) {
							sails.sockets.blast("nodeUpdate", sails.config.nodes[hostname]);
						}
					}
				}
			}, sched);
	}
};
