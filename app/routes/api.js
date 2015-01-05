module.exports = function(app) {
    var mongoose = require('mongoose'),
        User = mongoose.model('User');

    app.get('/api/user', function(req, res) {
        // Check if user is authenticated. If not, disallow access to the API:
        if(!req.isAuthenticated()) {
            res.status(401).send();
            return;
        }

        // User is authenticated so send them their `req.user` session object:
        res.send(req.user);
    });
};