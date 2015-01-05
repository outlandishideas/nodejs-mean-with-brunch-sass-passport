module.exports = function(app, config) {
    var mongoose = require('mongoose'),
        passport = require('passport');

    var LocalStrategy = require('passport-local').Strategy;

    var User = mongoose.model('User');

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    /*******************************************************************************************************************
     * LOCAL AUTH *
     **************/

    passport.use('local_signup', new LocalStrategy({
        // Define what form 'name' fields to use as 'username' and 'password' equivalents:
        usernameField: 'email',
        passwordField: 'password'
    },
    function(email, password, done) {
        process.nextTick(function() {
            // Attempt to find a user with this email:
            User.findOne({
                email: email
            }, function(err, user) {
                if(err) {
                    done(err);
                    return;
                }

                if(user) {
                    done(null, false, { message: 'Email already in use.' });
                    return;
                }

                // User does not exist with this email, so create it:
                var newUser = new User();

                newUser.email = email;
                newUser.password = newUser.generateHash(password); // Call instance method 'generateHash' to produce password hash

                // Save this user to our database and return it to Passport by passing it as the second
                // parameter of the 'done' callback:
                newUser.save(function(err) {
                    if(err) {
                        done(err);
                        return;
                    }

                    done(null, newUser);
                });
            })
        });
    }));

    passport.use('local_signin', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
        function(email, password, done) {
            User.findOne({
                email: email
            }, function(err, user) {
                if(err) {
                    done(err);
                    return;
                }

                if(!user) {
                    done(null, false, {message: 'User not found.'});
                    return;
                }

                if(!user.validPassword(password)) {
                    done(null, false, {message: 'Invalid password.'});
                    return;
                }

                done(null, user);
            });
        }));

    app.post('/auth/local/signup', function(req, res) {
        function handleError(status) {
            res.status(status).send();
        }

        // Call on Passport to authenticate using our 'local_signup' strategy. The second parameter will
        // be called on completion of the user creation, etc.
        passport.authenticate('local_signup', function(err, user) {
            if(err) {
                handleError(500);
                return;
            }

            if(!user) {
                handleError(401);
                return;
            }

            // Authentication was successful, 'login' this new user by creating a session with `req.login`:
            req.login(user, function(err) {
                if(err) {
                    handleError(500);
                    return;
                }

                res.send({ success: true });
            });
        })(req, res);
    });

    app.post('/auth/local/signin', function(req, res) {
        function handleError(status) {
            res.status(status).send();
        }

        passport.authenticate('local_signin', function(err, user) {
            if(err) {
                handleError(500);
                return;
            }

            if(!user) {
                handleError(401);
                return;
            }

            req.login(user, function(err) {
                if(err) {
                    handleError(500);
                    return;
                }

                res.send({ success: true });
            });
        })(req, res);
    });

    /*******************************************************************************************************************
     * UTILITY *
     ***********/

    /**
     * Find a user in the database. If it does not exist, create a document for that user.
     * @param profile social network profile
     * @param done
     */
    function findOrCreate(profile, done) {
        if(!profile.email) {
            done('No email provided.');
            return;
        }

        User.findOne({
            email: profile.email
        }, function(err, res) {
            if(err) {
                done(err);
                return;
            }

            if(res) {
                // Return found user:
                done(null, res);
            } else {
                // Create new user:
                var user = new User({
                    email: profile.email,
                    socialNetworkProfile: profile
                });

                user.save(function(err, user) {
                    if(err) {
                        done(err);
                        return;
                    }

                    done(null, user);
                });
            }
        });
    }
};