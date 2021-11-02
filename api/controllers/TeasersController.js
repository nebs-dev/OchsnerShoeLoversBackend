/**
 * TeasersController
 *
 * @description :: Server-side logic for managing trends
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment');

module.exports = {

    // method to list all for selected language, used in list views
    'index': function (req, res) {
        Teasers.findByLanguage(req.params.language).sort({order: 1}).then(function (teasers) {
            res.view('teasers/index', {teasers: teasers});
        }).catch(function (err) {
            res.negotiate(err);
        });
    },

    // method to show single, or to show create screen
    'view': function (req, res) {
        if (!req.params.id) return res.view('teasers/view', {teaser: false, viewDateTime: false});

        Teasers.findOne(req.params.id).then(function (teaser) {
            if (!teaser) return res.notFound();

            // If teaser's section has items return them for selectbox
            if(teaser.linkSection) {
                var model = sails.models[teaser.linkSection];
                if(model) {
                    model.find({}).then(function (items) {
                        return res.view('teasers/view', {
                            teaser: teaser,
                            items: items
                        });
                    });
                } else {
                    return res.view('teasers/view', {
                        teaser: teaser,
                        items: false
                    });
                }
            } else {
                return res.view('teasers/view', {
                    teaser: teaser,
                    items: false
                });
            }

        }).catch(function (err) {
            res.negotiate(err);
        });
    },

    // POST method to update db
    'update': function (req, res) {
        var params = req.params.all();

        if(params.linkType > 0) {
            params.linkType = true;
            params.link = 'shoelovers://content/' +params.linkSection+'/'+params.linkItem;
            params.linkItem = (params.linkItem == '') ? null : params.linkItem;
        } else {
            params.linkType = false;
            params.linkSection = null;
            params.linkItem = null;
        }

        Teasers.update(req.params.id, params).then(function (teasers) {
            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['image'], teasers[0], function (err, uploaded) {
                if (err) return res.json({err: err});

                res.json({err: null, redirect: '/teasers/' + req.params.language});
            });

        }).catch(function (err) {
            return res.json({err: err});

        });
    },


    'getLinkItems': function (req, res) {
        var params = req.params.all();
        var model = sails.models[params.section];
        var today = moment();

        // show only active items
        var options = {
            startDate: {'<=': new Date(today)},
            endDate: {'>=': new Date(today)},
            language: params.language
        };

        if(model) {
            model.find(options).then(function(items){

                return res.view('teasers/items', {items: items, layout: null});

            }).catch(function(err){
                if (err) return res.json({err: err});
            });

        } else {
            return res.view('teasers/items', {items: false, layout: null});
        }
    }
};

