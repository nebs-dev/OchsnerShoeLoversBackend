/**
 * TrendsController
 *
 * @description :: Server-side logic for managing trends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment');
module.exports = {
    // method to list all for selected language, used in list views
    'index': function (req, res) {
        Trends.findByLanguage(req.params.language).sort({order: 1}).then(function (trends) {
            var today = moment();
                _.map(trends, function(trend) {
                    if (today.isAfter(trend.endDate)) {
                        trend.status = 'archived';
                    } else if (today.isBefore(trend.endDate) && today.isAfter(trend.startDate)) {
                        trend.status = 'active';
                    } else if (today.isBefore(trend.endDate) && today.isBefore(trend.startDate)) {
                        trend.status = 'planned';
                    } else {
                        trend.status = 4;
                    }
                });

            res.view('trends/index', {trends: trends});
        }).catch(function (err) {
            res.negotiate(err.name);
        });
    },

    // method to show single, or to show create screen
    'view': function (req, res) {

        if (!req.params.id) return res.view('trends/view', {trend: false});

        Trends.findOne(req.params.id).then(function (trend) {
            if (!trend) return res.notFound();

            trend.date = moment(trend.startDate).format('DD.MM.YYYY') + ' - ' + moment(trend.endDate).format('DD.MM.YYYY');

            res.view('trends/view', {trend: trend});

        }).catch(function (err) {
            res.negotiate(err);
        });
    },


    // POST method to save created to db
    'create': function (req, res) {
        var daterange = req.param('daterange');
        var startAndEnd = daterange.split('-');
        var startDate = new Date(moment(startAndEnd[0], 'DD.MM.YYYY').format('MM/DD/YYYY'));
        var endDate = new Date(moment(startAndEnd[1], 'DD.MM.YYYY').format('MM/DD/YYYY'));

        var params = req.params.all();
        params.startDate = startDate;
        params.endDate = endDate;

        Trends.create(params).then(function (trends) {

            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['listImage', 'detailImage'], trends, function (err, uploaded) {
                if (err) return res.json({err: err});

                // we are returning redirect param, so frontend will redirect to list afer creation
                res.json({err: null, redirect: '/trends/' + req.params.language });
            });


        }).catch(function (err) {
            return res.json({err: err});
        });
    },


    // POST method to update db
    'update': function (req, res) {
        var daterange = req.param('daterange');
        var startAndEnd = daterange.split('-');
        var startDate = new Date(moment(startAndEnd[0], 'DD.MM.YYYY').format('MM/DD/YYYY'));
        var endDate = new Date(moment(startAndEnd[1], 'DD.MM.YYYY').format('MM/DD/YYYY'));

        var params = req.params.all();
        params.startDate = startDate;
        params.endDate = endDate;

        Trends.update(req.params.id, params).then(function (trends) {

            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['listImage', 'detailImage'], trends[0], function (err, uploaded) {
                if (err) return res.json({err: err});

                res.json({err: null, redirect: '/trends/' + req.params.language });
            });

        }).catch(function (err) {
            return res.json({err: err});

        });
    }
};

