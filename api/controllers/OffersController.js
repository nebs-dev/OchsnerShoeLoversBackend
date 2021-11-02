/**
 * offersController
 *
 * @description :: Server-side logic for managing offers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
module.exports = {

    // method to list all for selected language, used in list views
    'index': function (req, res) {
        Offers.findByLanguage(req.params.language).sort({order: 1}).then(function (offers) {
            var today = moment();
            _.map(offers, function(offer) {
                if (today.isAfter(offer.endDate)) {
                    offer.status = 'archived';
                } else if (today.isBefore(offer.endDate) && today.isAfter(offer.startDate)) {
                    offer.status = 'active';
                } else if (today.isBefore(offer.endDate) && today.isBefore(offer.startDate)) {
                    offer.status = 'planned';
                } else {
                    offer.status = 4;
                }
            });
            
            res.view('offers/index', {offers: offers});
        }).catch(function (err) {
            res.negotiate(err.name);
        });
    },

    // method to show single, or to show create screen
    'view': function (req, res) {

        if (!req.params.id) return res.view('offers/view', {offer: false});

        Offers.findOne(req.params.id).then(function (offer) {
            if (!offer) return res.notFound();

            offer.date = moment(offer.startDate).format('DD.MM.YYYY') + ' - ' + moment(offer.endDate).format('DD.MM.YYYY');

            res.view('offers/view', {offer: offer});

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

        Offers.create(params).then(function (offers) {

            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['listImage', 'detailImage'], offers, function (err, uploaded) {
                if (err) return res.json({err: err});

                // we are returning redirect param, so frontend will redirect to list afer creation
                res.json({err: null, redirect: '/offers/' + req.params.language });
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

        Offers.update(req.params.id, params).then(function (offers) {

            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['listImage', 'detailImage'], offers[0], function (err, uploaded) {
                if (err) return res.json({err: err});

                res.json({err: null, redirect: '/offers/' + req.params.language});
            });

        }).catch(function (err) {
            return res.json({err: err});

        });
    },

    'destroy': function (req, res) {
        if (!req.params.id) return res.json({err: 'No ID'});

        Offers.destroy(req.params.id).then(function() {
            return res.json({err: null});

        }).catch(function(err) {
            return res.json({err: err});
        });
    }

};

