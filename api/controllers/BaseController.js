/**
 * BaseController
 *
 * @description :: Server-side logic for managing competitions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment');
var sha1 = require('sha1');

module.exports = {

    // Homepage
    'home': function(req, res) {
        //res.view('homepage');
        return res.redirect('/profile');
    },


    'login': function(req, res) {
        res.locals.layout = 'layout_login.ejs'

        if (req.method == 'GET') {
            return res.view('login');
        }

        var params = req.params.all();
        if(!params.email || !params.password) {
            req.flash('message', 'Email and password are required');
        }

        params.password = sha1('MIDGET' +params.password+ 'NINJA');

        Admins.findOne(params).then(function(admin){
            if(!admin) {
                req.flash('message', 'Wrong email/password');
                return res.redirect('/login');
            }

            req.session.authenticated = true;
            req.session.user = admin;
            return res.redirect('/profile');
        });
    },


    'logout': function (req, res) {
        req.session.destroy(function(err) {
            res.redirect('/login');
        });
    },

    'profile': function (req, res) {
        Admins.findOne(req.session.user.id).then(function (admin) {
            if (!admin) return res.notFound('User not found');

            res.view('profile', {admin: admin});

        }).catch(function (err) {
            res.negotiate(err);
        });
    },

    'profileSubmit': function (req, res) {
        var params = req.params.all();
        if(params.password == '') delete params["password"];

        Admins.update(req.session.user.id, params).then(function (admin) {
            uploadService(req, ['image'], admin[0], function (err, uploaded) {
                if (err) return res.json({err: err});

                // we are returning redirect param, so frontend will redirect to list afer creation
                var redirect = (req.session.user.superadmin) ? '/admins/list' : '/';
                res.json({err: null, redirect: redirect });
            });

        }).catch(function (err) {
            return res.json({err: err});
        });
    }

}