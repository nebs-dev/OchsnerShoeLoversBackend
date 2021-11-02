/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
module.exports = {

    // method to list all for selected language, used in list views
    'index': function (req, res) {
        News.findByLanguage(req.params.language).sort({order: 1}).then(function (news) {
            var today = moment();
            _.map(news, function(newsItem) {
                if (today.isAfter(newsItem.endDate)) {
                    newsItem.status = 'archived';
                } else if (today.isBefore(newsItem.endDate) && today.isAfter(newsItem.startDate)) {
                    newsItem.status = 'active';
                } else if (today.isBefore(newsItem.endDate) && today.isBefore(newsItem.startDate)) {
                    newsItem.status = 'planned';
                } else {
                    newsItem.status = 4;
                }
            });

            res.view('news/index', {news: news});
        }).catch(function (err) {
            res.negotiate(err);
        });
    },

    // method to show single, or to show create screen
    'view': function (req, res) {
        if (!req.params.id) return res.view('news/view', {news: false});

        News.findOne(req.params.id).then(function (news) {
            if (!news) return res.notFound();

            news.date = moment(news.startDate).format('DD.MM.YYYY') + ' - ' + moment(news.endDate).format('DD.MM.YYYY');

            res.view('news/view', {news: news});

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

        News.create(params).then(function (news) {

            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['listImage', 'detailImage'], news, function (err, uploaded) {
                if (err) return res.json({err: err});

                // we are returning redirect param, so frontend will redirect to list afer creation
                res.json({err: null, redirect: '/news/' + req.params.language});
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

        News.update(req.params.id, params).then(function (news) {

            // we have 2 images for this model... we need to upload them... read about uploadService...
            uploadService(req, ['listImage', 'detailImage'], news[0], function (err, uploaded) {
                if (err) return res.json({err: err});

                res.json({err: null, redirect: '/news/' + req.params.language });
            });

        }).catch(function (err) {
            return res.json({err: err});

        });
    }

};

