'use strict';

var LIVERELOAD_PORT = 35729;
var express         = require('express');
var devRoot         = 'app';
var distRoot        = 'dist';
var tmp             = '.tmp';

module.exports = function (server) {

    // Configure middleware for the development environment
    server.configure('development', function () {
        var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});

        process.env.ROOT = devRoot;

        // Enable live reload
        server.use(lrSnippet);

        // Prepare static paths
        server.use(express.static(devRoot));
        server.use(express.static(tmp));
    });

    // Configure middleware for a runtime environment
    server.configure('production', function () {
        process.env.ROOT = distRoot;

        server.use(express.static(distRoot));
    });
};
