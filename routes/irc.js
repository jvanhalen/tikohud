var Users = require('../models/users');
var express = require('express');

var client = require('../bin/irc');
var router = express.Router();

// Keep track of connected irc clients
var connections = {};

router.get('/', function(req, res) {

    var token = {};

    if (req.session_state.username) {

        Users.find({email: req.session_state.username}, function(err, user) {
            if (err) {
                res.send(err)
            }
            //var irc = new client(user[0]);
            res.send("keep up the good work!");        
        });
    } 
    else {
        res.send('You need to <a href="/login">login</a> first.');
    }

});

router.post('/api/:token', function(req, res) {
    console.log("req.body.command:", req.body.command);
    console.log("token:", req.params.token);

    res.send("success / kaikki okei!");
});

router.post('/api', function(req, res) {
    //console.log("req.body.command:", req.body.command);
    //console.log("token:", req.params.token);

    res.send("success / kaikki okei! ou jee");
});

module.exports = router;