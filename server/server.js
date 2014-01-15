'use strict';

var express = require('express');
var server  = express();
var port    = process.env.PORT || 8000;

require('./config')(server);
require('./routes')(server);

server.listen(port);
console.log('listening on port ' + port);

module.exports = server;