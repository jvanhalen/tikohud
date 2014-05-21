var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var clientSessions = require("client-sessions");
var cors = require('cors');

//var routes = require('./routes/index');
//var users = require('./routes/users');
var irc = require('./routes/irc');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

app.use(cors());   // Enable cross origin access
app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(clientSessions({
    secret: '0GBlJZ9EKBt2Zbi2flRPvztczCewBxXK' // CHANGE THIS!
}));

app.use('/irc', irc);

/*app.get('/irc', function(req, res) {
 console.log("req.session_state:", req.session_state);
 res.send('moi');
 });*/

// Handle login requests
app.get('/', function (req, res) {
    console.log(req.session_state.username + ' requested', req._parsedUrl.path);

    if (req.session_state.username) {
        res.sendfile('./public/index.html');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', function (req, res) {
    console.log(req.session_state.username + ' requested', req._parsedUrl.path);

    req.session_state.username = 'JohnDoe';
    console.log(req.session_state.username + ' logged in.');
    res.send({ username: 'JohnDoe' });
});

app.get('/logout', function (req, res) {
    console.log(req.session_state.username + ' logged out.');
    req.session_state.reset();
    console.log("req.session_state=", req.session_state);
    res.redirect('/api/login');
});

app.post('/api/login', function (req, res) {
    console.log(req.session_state.username + ' requested', req._parsedUrl.path);

    console.log("req.body:", req.body)
    req.session_state.username = req.body.email;
    req.session_state.password = req.body.password;

    res.redirect('/loggedin');
});

app.get('/users', function (req, res) {
    console.log(req.session_state.username + ' requested', req._parsedUrl.path);

    if (req.session_state.username) {
        res.sendfile('./public/users.html');
    } else {
        res.redirect('/login');
    }
});

app.get('/api/users', function (req, res) {
    console.log(req.session_state.username + ' requested', req._parsedUrl.path);

    if (req.session_state.username) {
        mongoose.model('users').find(function (err, users) {
            console.log(users[0]);

            if (!err) {
                res.json(users);
                //res.render('users', { title: 'TikoHUD users', users: users, amount: users.length });
            }
            else {
                res.send('users not found');
            }
        })
    } else {
        console.log("GET /api/users NOT LOGGED IN");
        res.redirect('/login');
    }

});

app.post('/api/users', function (req, res) {
    console.log(req.session_state.username + ' requested', req._parsedUrl.path);

    if (req.session_state.username) {
        mongoose.model('users').create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role

        }, function (err, user) {
            if (err) {
                res.send(err);
            }

            // get and return all the todos after you create another
            mongoose.model('users').find(function (err, users) {
                if (err) {
                    res.send(err)
                }
                res.json(users);
            });
        });
    } else {
        res.redirect('/login');
    }
});

app.delete('/api/users/:id', function (req, res) {
    console.log(req.session_state.username + ' requested', req._parsedUrl.path);

    if (req.session_state.username) {
        mongoose.model('users').remove({
            _id: req.params.id

        }, function (err, user) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            mongoose.model('users').find(function (err, users) {
                if (err)
                    res.send(err)
                res.json(users);
            });
        });
    } else {
        res.redirect('/login');
    }
});

/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Lataa mongoosen mallit /models-hakemistosta
var fs = require('fs');
fs.readdirSync(__dirname + '/models').forEach(function (filename) {
    if (~filename.indexOf('.js')) {
        require(__dirname + '/models/' + filename);
    }
})

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    mongoose.connect('mongodb://localhost:27017/tikohud')
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
