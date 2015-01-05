module.exports.startServer = function(PORT, PATH, CALLBACK) {
    var ENV = process.env.NODE_ENV || 'prod'; // Assume production env. for safety

    var config = require('./app/config.js')[ENV];

    var express = require('express'),
        session = require('express-session'),
        bodyParser = require('body-parser'),
        passport = require('passport'),
        mongoose = require('mongoose'),
        path = require('path'),
        fs = require('fs'),
        MongoStore = require('connect-mongo')(session),
        app = express(),
        server = app.listen(PORT, CALLBACK),
        cookieParser = require('cookie-parser')(config.sessionSecret),
        sessionStore = new MongoStore({db: config.db.name, auto_reconnect: true});

    /*******************************************************************************************************************
     * MONGOOSE CONFIG *
     *******************/

    var connect = function() {
        var db = config.db;
        var conn = 'mongodb://' + db.username + ':' + db.password + '@' + db.host;
        (ENV === 'dev') ? mongoose.connect(db.host, db.name) : mongoose.connect(conn);
    };
    connect();

    mongoose.connection.on('error', function (err) {
        console.log(err);
    });

    if(ENV === 'prod') {
        mongoose.connection.on('disconnected', function () {
            connect();
        });
    }

    // 'require' all of our Mongo models:
    var models = __dirname + '/app/models';
    fs.readdirSync(models).forEach(function (model) {
        if (model.indexOf('.js') > -1) {
            require(models + '/' + model);
        }
    });

    /*******************************************************************************************************************
     * EXPRESS CONFIG *
     ******************/

    var sessionOpts = {
        secret: config.sessionSecret,
        resave: true,
        saveUninitialized: true,
        store: sessionStore
    };

    // Define where our static files will be fetched from:
    app.use(express.static(path.join(__dirname, 'public')));

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser);
    app.use(session(sessionOpts));

    // Push Passport middleware into flow:
    app.use(passport.initialize());
    app.use(passport.session());

    // Tell Express where our server views (Jade files) are kept.
    // Then we can do render('NAME_OF_VIEW') inside an Express route request. e.g. render('index')
    app.set('views', path.join(__dirname, 'app/views'));
    app.set('view engine', 'jade');

    /*******************************************************************************************************************
     * ROUTE CONFIG *
     ****************/

    require('./app/routes/passport')(app, config);
    require('./app/routes/api')(app);

    app.get('/log-out', function(req, res) {
        req.logout(); // Log the user out
        res.redirect('/login'); // Send them back to the login page
    });

    app.get('/*', function (req, res) {
        // Render index and pass route handling to Angular
        res.render('index');
    });

    app.all('/*', function(req, res) {
        // Client is lost... render error page!
        res.render('error');
    });

    console.log('Application running in ' + ENV + ' environment...');
};