/**
 * NodeController
 *
 * @description :: Server-side logic for managing nodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var PythonShell = require('python-shell');
PythonShell.defaultOptions = {
  scriptPath: 'C:/python'
};

function addUID(buf) {
  buf.writeUInt8(12, 0);
  buf.writeUInt8(197, 1);
  buf.writeUInt8(68, 2);
  buf.writeUInt8(54, 3);
  buf.writeUInt16LE(41170, 4);
  buf.writeUInt16LE((Math.random() * Math.pow(2, 16)) >>> 0, 6);
  var t = Date.now();
  buf.writeUInt32LE(((t & 0xffffffff) >>> 0), 8);
  buf.writeUInt32LE(((t / Math.pow(2, 32)) >>> 0), 12);
  return buf.toString('hex', 0, 16);
};

function get(host, key) {
  var buf = new Buffer(49);
  buf.fill('');
  var uidStr = addUID(buf);
  buf.writeUInt8(2, 16);
  buf.write(key, 17, key.length);
  udp.cache[uidStr] = {
    count: 0,
    data: buf
  };
  udp.client.send(buf, 0, 49, 7777, host.ip);
  retry(uidStr, host.ip, "get " + key + " from " + host.hostname);
};

function put(host, key, value) {
  var len = 51 + value.length;
  var buf = new Buffer(len);
  buf.fill('');
  var uidStr = addUID(buf);
  buf.writeUInt8(1, 16);
  buf.write(key, 17, key.length);
  if (!!value) {
    buf.writeUInt16LE(value.length, 49);
    buf.write(value, 51, value.length);
  }
  udp.cache[uidStr] = {
    count: 0,
    data: buf
  };
  udp.client.send(buf, 0, len, 7777, host.ip);
  retry(uidStr, host.ip, "put (" + key + ", " + value + ") to " + host.hostname);
};

function retry(uid, ip, msg, timeout) {
  if (!timeout) timeout = 600;
  setTimeout(function() {
    if (!!udp.cache[uid]) {
      udp.cache[uid].count++;
      if (udp.cache[uid].count >= 3) {
        sails.sockets.blast("logUpdate", "timeout on " + msg);
        delete udp.cache[uid];
      } else {
        udp.client.send(udp.cache[uid].data, 0, udp.cache[uid].data.length,
          7777,
          ip);
        retry(uid, ip, msg, timeout * 2);
      }
    }
  }, timeout);
};

function remove(host, key) {
  var buf = new Buffer(49);
  buf.fill('');
  var uidStr = addUID(buf);
  buf.writeUInt8(3, 16);
  buf.write(key, 17, key.length);
  udp.cache[uidStr] = {
    count: 0,
    data: buf
  };
  udp.client.send(buf, 0, 49, 7777, host.ip);
  retry(uidStr, host.ip, "remove key " + key + " from " + host.hostname);
};

module.exports = {
  get: function(req, res) {
    return res.view('nodes', {
      nodes: sails.config.nodes,
      title: "map",
      sets: []
    });
  },
  getList: function(req, res) {
    return res.view("nodeList", {
      nodes: sails.config.nodes,
      title: "list",
      sets: udp.sets
    });
  },
  shutdown: function(req, res) {
    var buf = new Buffer(17);
    addUID(buf);
    buf.writeUInt8(4, 16);
    udp.client.send(buf, 0, 17, 7777, sails.config.nodes[req.body
      .node].ip);
    return res.send("success");
  },
  getTest: function(req, res) {
    return res.view('test', {
      nodes: sails.config.nodes,
      title: "test",
      sets: []
    });
  },
  testAction: function(req, res) {
    try {
      for (var i = 0; i < req.body.length; i++) {
        if (!sails.config.nodes[req.body[i].hostname].ip) {
          throw err(req.body[i].hostname + " is not reporting to monitor server");
        }
        if (req.body[i].name === 'get') {
          get(sails.config.nodes[req.body[i].hostname], req.body[i].key);
        } else if (req.body[i].name === 'put') {
          put(sails.config.nodes[req.body[i].hostname], req.body[i].key,
            req.body[
              i].value);
        } else if (req.body[i].name === 'remove') {
          remove(sails.config.nodes[req.body[i].hostname], req.body[i].key);
        } else {
          throw err;
        }
      }
      return res.send("success");
    } catch (err) {
      sails.sockets.blast("logUpdate", err.toString());
      return res.badRequest(err);
    }
  },
  uploadPython: function(req, res) {
    req.file('uploadFile').upload({
        dirname: require('path').resolve("..", '/python'),
        maxBytes: 1000000
      },
      function whenDone(err, uploadedFiles) {
        if (err) {
          console.log(err);
          return res.negotiate(err);
        }
        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }

        var n = uploadedFiles[0].fd.lastIndexOf('\\');
        var result = uploadedFiles[0].fd.substring(n + 1);
        /*	PythonShell.run(result, {
						args: []
					}, function(err, results) {
						if (err) {
							console.log(err);
							return res.send(err);
						} else {
							return res.send(results);

						}
					});*/
        var pyshell = new PythonShell(result);

        pyshell.on('message', function(message) {
          // received a message sent from the Python script (a simple "print" statement)
          console.log(message);
        });

        // end the input stream and allow the process to exit
        pyshell.end(function(err, result) {
          if (err) {
            res.send(err.stack);
          } else {
            res.send(result);
          }
        });
      });
  },
  clearUpload: function(req, res) {
    udp.sets = [];
    res.redirect("/");
  },
  uploadSet: function(req, res) {
    req.file('uploadFile').upload({
        maxBytes: 1000000
      },
      function whenDone(err, uploadedFiles) {
        if (err) {
          console.log(err);
          return res.negotiate(err);
        }
        // If no files were uploaded, respond with an error.
        if (uploadedFiles.length === 0) {
          return res.badRequest('No file was uploaded');
        }
        var fs = require('fs');
        fs.readFile(uploadedFiles[0].fd,
          function(err, data) {
            if (err) {
              console.log(err);
              return res.negotiate(err);
            }
            udp.sets.push(data.toString().split(/\r?\n/));
            res.view("nodeList", {
              nodes: sails.config.nodes,
              title: "list",
              sets: udp.sets
            });
          });
      });
  }
};
