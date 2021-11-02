/**
 * tokenAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
var sha1 = require("sha1");
module.exports = function(req, res, next) {
    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller

    var params = req.params.all();

    // GET methods don't need token authentication
    if (req.method == 'GET') {
        return next();
    }

    if(typeof params.udid != 'undefined' && typeof params.token != 'undefined') {
        // generate token
        var token = sha1('MIDGET' + params.udid + 'NINJA');

        // check token
        if (token == params.token) return next();
    }

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    return res.forbidden('You are not permitted to perform this action.');
};
