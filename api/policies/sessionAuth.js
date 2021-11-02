/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */
module.exports = function (req, res, next) {

    // User is allowed, proceed to the next policy,
    // or if this is the last policy, the controller
    if (req.session.authenticated) {
        var controller = req.options.controller;
        var method = req.route.method;

        if(req.session.user.superadmin) {
            return next();
        } else {
            switch(controller) {
                case 'admins':
                    return res.redirect('/');
                    break;
                case 'base':
                    if(method == 'profile') return res.redirect('/login');

                    return next();
                    break;
                default:
                    return next();
                    break;
            }
        }
    }

    return res.redirect('/login');

    // User is not allowed
    // (default res.forbidden() behavior can be overridden in `config/403.js`)
    return res.forbidden('You are not permitted to perform this action.');
};
