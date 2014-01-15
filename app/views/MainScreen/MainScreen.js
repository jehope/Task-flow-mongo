'use strict';

var ascot    = require('ascot2');
var template = require('./MainScreen.hbs');
var rest  = require('rest-browser-client');
var client = rest('/api');
// var API_URL    = process.env.TASK_PATH + '/api';
var API_URL   = 'http://localhost:8000/api';
/****************
 *  Controller  *
 ****************/

/**
 * A controller method that serves as the primary entry-point for a particular context
 * @param {Element} element The HTML element associated with this controller
 * @param {Object} options Any options this controller may use
 */
function controller(element) {
    var ctx = ascot(element);

    ctx.merge(template());

    client.get(function (req, res) {
        ctx.add('<div>' + res.body + '</div>');
    });

    registerEvents.call(ctx);
}

function registerEvents () {
	var createTaskBtn = this.select('.create-task');
	var createFn    = createTask.bind(null, this);

	createTaskBtn.addEventListener('click', createFn, false);
}

function createTask(element,evt) {
	console.log('create task');
	console.log(API_URL);
	postTask();
}

function postTask() {
	var req      = new XMLHttpRequest();
    var body     = {
        id : '2'
    };

    req.open('POST', API_URL);
    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(body));
}
/*************
 *  Exports  *
 *************/

module.exports = controller;
