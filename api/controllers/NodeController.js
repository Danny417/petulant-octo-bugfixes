/**
 * NodeController
 *
 * @description :: Server-side logic for managing nodes
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
function generateUID() {
  var buf = new Buffer(17);
  buf.writeUInt8(12, 0);
  buf.writeUInt8(197, 1);
  buf.writeUInt8(68, 2);
  buf.writeUInt8(54, 3);
  buf.writeUInt16LE(41170, 4);
  buf.writeUInt16LE(0, 6);
  buf.writeUInt32LE(parseInt(Math.random() * 16), 8);
  buf.writeUInt32LE(parseInt(Math.random() * 16), 12);
  buf.writeUInt8(4, 16);
  return buf;
};

module.exports = {
  get: function(req, res) {
    return res.view('nodes', {
      nodes: sails.config.nodes
    });
  },
  getList: function(req, res) {
    return res.view("nodeList", {
      nodes: sails.config.nodes
    });
  },
  shutdown: function(req, res) {
    console.log(req.body);

    udp.adapter.send(generateUID(), 0, 17, 7777, sails.config.nodes[req.body
      .node].ip);
    return res.send("success");
  }
};
