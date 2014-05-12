var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//var routes = require('./routes/index');
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

app.get('/users', function(req, res) {
    res.sendfile('./public/users.html');
});

app.get('/api/users', function(req, res) {
    mongoose.model('users').find(function(err, users) {
        console.log(users[0]);

        if(!err) {
            res.json(users);         
            //res.render('users', { title: 'TikoHUD users', users: users, amount: users.length });
        }
        else {
            res.send('users not found');
        }
    })
});

app.post('/api/users', function(req, res) {

    // create a todo, information comes from AJAX request from Angular
    mongoose.model('users').create({
        firstname : req.body.firstname,
        lastname : req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role

    }, function(err, user) {
        if (err) {
            res.send(err);
        }

        // get and return all the todos after you create another
        mongoose.model('users').find(function(err, users) {
            if (err) {
                res.send(err)
            }
            res.json(users);
        });
    });

});

app.delete('/api/users/:id', function(req, res) {
    mongoose.model('users').remove({
        _id : req.params.id

    }, function(err, user) {
        if (err)
            res.send(err);

        // get and return all the todos after you create another
        mongoose.model('users').find(function(err, users) {
            if (err)
                res.send(err)
            res.json(users);
        });
    });
});

// Handle login requests
app.post('/api/login', function(req, res) {
    console.log("req.body:", req.body)
    res.send("success");
});

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Lataa mongoosen mallit /models-hakemistosta
var fs = require('fs');
fs.readdirSync(__dirname + '/models').forEach(function(filename) {
    if (~filename.indexOf('.js')) {
        require(__dirname + '/models/' + filename);
    }
})

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    mongoose.connect('mongodb://localhost:27017/tikohud')
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
