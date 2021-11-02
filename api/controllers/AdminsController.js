/**
 * AdminsController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

    'index': function (req, res) {
        Admins.find().then(function(admins){
            res.view('admins/index', {admins: admins});

        }).catch(function(err){
            return res.serverError(err.name);
        });
    },

    'view': function (req, res) {
        if (!req.params.id) return res.view('admins/view', {admin: false});

        Admins.findOne(req.params.id).then(function (admin) {
            if (!admin) return res.notFound('Admin not found');

            res.view('admins/view', {admin: admin});

        }).catch(function (err) {
            res.negotiate(err);
        });
    },

    'create': function (req, res) {
        var params = req.params.all();
        if(!params.email) return res.serverError('Email is mandatory');

        params.superadmin = params.superadmin || false;

        Admins.create(params).then(function(admin){
            uploadService(req, ['image'], admin, function (err, uploaded) {
                if (err) return res.json({err: err});

                // we are returning redirect param, so frontend will redirect to list afer creation
                var redirect = (req.session.user.superadmin) ? '/admins/list' : '/';
                res.json({err: null, redirect: redirect });
            });

        }).catch(function(err){
            return res.json({err: err});
        });

    },

    'update': function (req, res) {
        var params = req.params.all();

        params.superadmin = params.superadmin || false;
        if(params.password == '') delete params["password"];

        Admins.update(req.params.id, params).then(function (admin) {
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

};

