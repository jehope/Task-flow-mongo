'use strict';

/******************
 *  Dependencies  *
 ******************/

var ascot = require('ascot2');
var page  = require('page');
var dir   = require('page-directives');
var rest  = require('rest-browser-client');
var MainScreen = require('views/MainScreen');

/*****************
 *  REST Client  *
 *****************/

var client = rest('/api');

client.use(rest.json());

/*********
 *  App  *
 *********/

var main = ascot(function (element) {
    var ctx = ascot(element);

    ctx.use(MainScreen);
});

/************
 *  Routes  *
 ************/

page('/',
    dir.clear(document.body),
    dir.load(main)
);

// Initialize the app
page();

/*************
 *  Exports  *
 *************/

module.exports = 'Test Mongodb';
