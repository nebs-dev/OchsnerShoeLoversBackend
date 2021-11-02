/**
 * CompetitionsController
 *
 * @description :: Server-side logic for managing competitions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment');
module.exports = {
    // method to list all for selected language, used in list views
    'index': function (req, res) {
        Competitions.findByLanguage(req.params.language).sort({order: 1}).then(function (competitions) {
            var today = moment();
            _.map(competitions, function(competition) {
                if (today.isAfter(competition.endDate)) {
                    competition.status = 'archived';
                } else if (today.isBefore(competition.endDate) && today.isAfter(competition.startDate)) {
                    competition.status = 'active';
                } else if (today.isBefore(competition.endDate) && today.isBefore(competition.startDate)) {
                    competition.status = 'planned';
                } else {
                    competition.status = 4;
                }
            });
            
            res.view('competitions/index', {competitions: competitions});
        }).catch(function (err) {
            res.negotiate(err);
        });
    },

    // method to show single, or to show create screen
    'view': function (req, res) {

        if (!req.params.id) return res.view('competitions/view', {competition: false});

        Competitions.findOne(req.params.id).then(function (competition) {
            if (!competition) return res.notFound();

            competition.date = moment(competition.startDate).format('DD.MM.YYYY') + ' - ' + moment(competition.endDate).format('DD.MM.YYYY');

            res.view('competitions/view', {competition: competition});

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
        params.add_input_field = params.add_input_field || false;

        Competitions.create(params).then(function (competition) {

            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['listImage', 'detailImage'], competition, function (err, uploaded) {
                if (err) return res.json({err: err});

                // we are returning redirect param, so frontend will redirect to list afer creation
                res.json({err: null, redirect: '/competitions/' + req.params.language });
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
        params.add_input_field = params.add_input_field || false;

        Competitions.update(req.params.id, params).then(function (competition) {

            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['listImage', 'detailImage'], competition[0], function (err, uploaded) {
                if (err) return res.json({err: err});

                res.json({err: null, redirect: '/competitions/' + req.params.language});
            });

        }).catch(function (err) {
            return res.json({err: err});

        });
    }

};

