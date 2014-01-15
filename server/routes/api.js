'use strict';

/******************
 *  Dependencies  *
 ******************/

var express  = require('express');
var cors     = require('cors');
var mongoose = require('mongoose');
var async    = require('async');


/********************
 *  Document Types  *
 ********************/

var Schema = mongoose.Schema;

/**
 * A schema defining a Task
 * @type {Schema}
 */
var taskSchema = new Schema({
    id : Number,
    title  : String,
    user   : String,
    text : String,
    count  : { type : Number, default : 0 }
});

/**
 * A task that holds details
 * @type {Class}
 */
var Task = mongoose.model('Task', taskSchema);

/***************
 *  Constants  *
 ***************/

var API_PATH = '/api';

/***************
 *  Utilities  *
 ***************/

/**
 * Simple error handler function that just throws an error
 * @param  {Error} err An error object
 */
function errHandler(err) {
    if (err) { throw err; }
}

/****************
 *  Sample API  *
 ****************/

/**
 * Returns a function used to return some sample data
 */
function getSample() {
    return function (req, res) {
        res.json('Hello Tavernd!');
    };
}
/**
 * Returns a function for finding a task and passing it on
 * @param {String} id The ID of the task to find
 * @return {Function} A function to use in an async routine
 */
function wfFindTask(id) {
    return function (next) {
        Task
            .findOne({ id : id })
            .exec(function (err, task) {

                // Create the task if it does not exist
                if (!task) {
                    Task.create({
                        id : id
                    },
                    function (err, task) {
                        next(err, task);
                    });
                } else {
                    next(err, task);
                }
            });
    };
}
/**
 * Performs necessary operations to increment trackbacks and post the
 * trackbacks list to the client
 */
function postTask() {
    return function (req, res) {
        var body   = req.body;
        var id    = body.id;
        
        async.waterfall([
            wfFindTask(id)

        ], errHandler);
    };
}
/************
 *  Routes  *
 ************/

/**
 * Configures the API routes
 * @param {Server} server An express.js server instance
 */
function configureRoutes(server) {
    // Prepare middleware
    server.use(API_PATH, express.json());

    // Allow for receiving application/json
    server.options(API_PATH, cors());

    // Post task data
    server.post(API_PATH, cors(), postTask());

    // Get trackbacks data
    server.get(API_PATH, getSample(), errHandler);
}

/*************
 *  Exports  *
 *************/

module.exports = function (server) {
    mongoose.connect(process.env.MONGOLAB_URI);
    configureRoutes(server);
};

