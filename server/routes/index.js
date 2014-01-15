'use strict';

module.exports = function (server) {

    // Require all scripts in the routes folder
    require('fs').readdirSync(__dirname + '/').forEach(function (file) {
        if (file.match(/.+\.js/g) !== null && file !== 'index.js') {
            var name = file.replace('.js', '');
            exports[name] = require('./' + file)(server);
        }
    });

    // Configure generic routes
    server.get(/^(.*)$/, function (req, res) {
        res.sendfile(process.env.ROOT + '/index.html');
    });
};
