/**
 * ApiController
 *
 * @description :: Server-side logic for managing apis
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var sha1 = require("sha1");
var moment = require("moment");

module.exports = {

    signUp: function (req, res) {
        var params = req.params.all();
        // check if we can continue
        if (!params.token || !params.udid || !params.clubCardNumber) return res.badRequest('Please send all required data');

        // Register with facebook / twitter
        if ((params.facebookID && params.facebookEmail) || (params.twitterID)) {

            // Facebook
            if (params.facebookID) {
                Cards.findOneByCardNumber(params.clubCardNumber).then(function (card) {
                    if (!card) return res.notFound('Card not found');
                    if (!card.user) return res.notFound('User not found');

                    // find card's user
                    Users.findOne(card.user).populate('cards').populate('facebook').populate('twitter')
                        .then(function (user) {
                            if (!user) return res.notFound('User not found');

                            facebookObj = {
                                facebookID: params.facebookID,
                                facebookEmail: params.facebookEmail
                            };

                            return Facebook.create(facebookObj).then(function (twitter) {
                                user.facebook = twitter;
                                user.udid = params.udid;

                                // save everything
                                user.save(function (err) {
                                    if (err) return res.serverError(err);

                                    user.twitter = (user.twitter) ? user.twitter : {};
                                    user.facebook = (user.facebook) ? user.facebook : {};
                                    res.json(user);
                                });
                            }).catch(function (err) {
                                return res.serverError(err);
                            })
                    })
                });

            // Twitter
            } else if (params.twitterID) {
                Cards.findOneByCardNumber(params.clubCardNumber).then(function (card) {
                    if (!card) return res.notFound('Card not found');
                    if (!card.user) return res.notFound('User not found');

                    // find card's user
                    Users.findOne(card.user).populate('cards').populate('facebook').populate('twitter')
                        .then(function (user) {
                            if (!user) return res.notFound('User not found');

                            twitterObj = {
                                twitterID: params.twitterID,
                                twitterEmail: params.twitterEmail ? params.twitterEmail : null
                            };

                            return Twitter.create(twitterObj).then(function (twitter) {
                                user.twitter = twitter;
                                user.udid = params.udid;

                                // save everything
                                user.save(function (err) {
                                    if (err) return res.serverError(err);

                                    user.twitter = (user.twitter) ? user.twitter : {};
                                    user.facebook = (user.facebook) ? user.facebook : {};
                                    res.json(user);
                                });
                            }).catch(function(err){
                                return res.serverError(err);
                            })
                    })

                }).catch(function (err) {
                    return res.serverError(err);
                });
            }

        // Register form data
        } else {
            // check if we can continue
            if (typeof params.firstname == 'undefined' || typeof params.lastname == 'undefined' || typeof params.email == 'undefined' || typeof params.address == 'undefined' || typeof params.addressNum == 'undefined' || typeof params.postcode == 'undefined' || typeof params.town == 'undefined' || typeof params.birthDate == 'undefined') {
                return res.badRequest('Please send all required data');
            }
            if (!moment(params.birthDate, 'DD.MM.YYYY', true).isValid()) return res.badRequest('Invalid date format');

            Cards.findOneByCardNumber(params.clubCardNumber).then(function (card) {
                if (!card) return res.notFound('Card not found');
                if (!card.user) return res.notFound('User not found');

                // find card's user
                Users.findOne(card.user).populate('cards').populate('facebook').populate('twitter').
                    then(function (user) {
                        if (!user) return res.notFound('User not found');

                        user.firstname = params.firstname;
                        user.lastname = params.lastname;
                        user.email = params.email;
                        user.address = params.address;
                        user.addressNum = params.addressNum;
                        user.postcode = params.postcode;
                        user.town = params.town;
                        user.birthDate = moment(params.birthDate, 'DD.MM.YYYY').toDate();
                        user.udid = params.udid;

                        user.save(function (err) {
                            if (err) return res.serverError(err);

                            user.twitter = (user.twitter) ? user.twitter : {};
                            user.facebook = (user.facebook) ? user.facebook : {};
                            return res.json(user);
                        });
                })

            }).catch(function (err) {
                res.serverError(err);
            });

        }
    },


    signIn: function (req, res) {
        var params = req.params.all();

        // check if we can continue
        if (!params.card) return res.badRequest('Please send all required data');

        // check card existing
        Cards.findOneByCardNumber(params.card).then(function (card) {
            if (!card) return res.notFound('Card not found');
            if(!card.user) return res.notFound('User with that card not found');

            // find card's user
            return Users.findOne(card.user).populate('cards').populate('facebook').populate('twitter')
                .then(function(user){
                    if (!user) return res.notFound('User with that card not found');

                    // update udid
                    user.udid = params.udid;
                    user.save(function(err){
                        if(err) return res.serverError(err);

                        user.twitter = (user.twitter) ? user.twitter : {};
                        user.facebook = (user.facebook) ? user.facebook : {};
                        res.json(user);
                    });
            });

        }).catch(function (err) {
            res.serverError(err);
        });
    },


    newCard: function (req, res) {
        var params = req.params.all();
        if (!params.udid) return res.badRequest('Please send all required data');

        Users.findOne({udid: params.udid}).populate('cards').then(function (user) {
            Cards.findOneByAvailable(true).then(function (card) {
                if (!card) return res.notFound('No more cards!');

                // set status of card
                card.available = false;

                return card.save().then(function () {

                    // If user found by udid
                    if(user) {
                        user.cards.add(card);

                        // save everything
                        return user.save(function (err) {
                            if (err) {
                                // something broke, return card to available
                                card.available = true;
                                card.save();
                                return res.serverError(err);
                            }

                            // return only new card
                            user.cards = [];
                            user.cards.push(card);
                            user.email = null;
                            res.json(user);
                        });

                    // If new user
                    } else {
                        // new user Object
                        var usrObj = {
                            udid: params.udid,
                            source: 'newCard'
                        };

                        return Users.create(usrObj).populate('cards').then(function (user) {
                            user.cards.add(card);

                            // save everything
                            user.save(function (err) {
                                if (err) {
                                    // something broke, return card to available
                                    card.available = true;
                                    card.save();
                                    return res.serverError(err);
                                }

                                Users.findOne(user.id).populate('cards').then(function(user){
                                    // return only new card
                                    user.cards = [];
                                    user.cards.push(card);
                                    user.email = null;
                                    res.json(user);
                                });
                            });
                        });
                    }
                });
            });

        }).catch(function (err) {
            return res.serverError(err);
        });
    },


    list: function (req, res) {
        if (!sails.models[req.params.model]) return res.notFound();
        var today = moment();
        var params = req.params.all();
        var options = {};

        // pagination options
        var paginate = {
            page: req.param('page') || '0',
            limit: req.param('limit') || '0'
        };

        // language options
        if (req.param("language")) {
            options.language = req.param("language");
        }

        // Options to filter only active items
        if(params.model != 'teasers') {
            options.startDate = {'<=': new Date(today)};
            options.endDate = {'>=': new Date(today)};
        }

        sails.models[req.params.model].find(options).paginate(paginate).then(function (feed) {

            // set count to error at start :)
            var total = 'error while counting';

            sails.models[req.params.model].count(options).exec(function (err, count) {
                total = count;

                // map all image links so it has base url
                _.map(feed, function (item) {
                    if(req.params.model == 'teasers') {
                        item.image = item.image ? req.baseUrl + item.image : '';
                    } else {
                        item.listImage = item.listImage ? req.baseUrl + item.listImage : '';
                        item.detailImage = item.detailImage ? req.baseUrl + item.detailImage : '';
                    }
                    return item;
                });

                res.json({feed: feed, total: total});
            });
        }).catch(function (err) {
            res.serverError(err);
        });
    },

    'homeFeed': function (req, res) {
        var today = moment();
        var options = {};

        // language options
        if (req.param("language")) {
            options.language = req.param("language");
        }

        // Find 2 teasers
        Teasers.find(options).limit(2).then(function (teasers) {

            // Options to filter only active items
            options.startDate = {'<=': new Date(today)};
            options.endDate = {'>=': new Date(today)};

            // Get 2 news, offers, trends, competitions
            var query = [];
            query.push(News.find(options, {sort: 'createdAt DESC'}).limit(2));
            query.push(Offers.find(options, {sort: 'createdAt DESC'}).limit(2));
            query.push(Trends.find(options, {sort: 'createdAt DESC'}).limit(2));
            query.push(Competitions.find(options, {sort: 'createdAt DESC'}).limit(2));
            query.push(teasers);

            return query;

        }).spread(function (news, offers, trends, competitions, teasers) {
            // map all image links so it has base url
            _.map(news, function (item) {
                item.listImage = item.listImage ? req.baseUrl + item.listImage : '';
                item.detailImage = item.detailImage ? req.baseUrl + item.detailImage : '';
                return item;
            });
            _.map(offers, function (item) {
                item.listImage = item.listImage ? req.baseUrl + item.listImage : '';
                item.detailImage = item.detailImage ? req.baseUrl + item.detailImage : '';
                return item;
            });
            _.map(trends, function (item) {
                item.listImage = item.listImage ? req.baseUrl + item.listImage : '';
                item.detailImage = item.detailImage ? req.baseUrl + item.detailImage : '';
                return item;
            });
            _.map(competitions, function (item) {
                item.listImage = item.listImage ? req.baseUrl + item.listImage : '';
                item.detailImage = item.detailImage ? req.baseUrl + item.detailImage : '';
                return item;
            });
            _.map(teasers, function (item) {
                item.image = item.image ? req.baseUrl + item.image : '';
                return item;
            });

            // Union all to find last created item
            var allFeeds = _.union(news, offers, trends, competitions);

            allFeeds = _.sortBy(allFeeds, function(value) {return new Date(value.createdAt);});

            var topTeaser = allFeeds.pop();

            var homeFeed = {
                topTeaser: topTeaser,
                news: news,
                offers: offers,
                trends: trends,
                competitions: competitions,
                teasers: teasers
            };

            return res.json(homeFeed);

        }).catch(function (err) {
            return res.serverError(err);
        });

    },


    'addUser': function (req, res) {
        var params = req.params.all();

        // check if we can continue
        if (typeof params.user_id == 'undefined' || typeof params.competition_id == 'undefined' || typeof params.clubCardNumber == 'undefined' || typeof params.firstname == 'undefined' || typeof params.lastname == 'undefined' || typeof params.email == 'undefined' || typeof params.address == 'undefined' || typeof params.addressNum == 'undefined' || typeof params.postcode == 'undefined' || typeof params.town == 'undefined' || typeof params.phone == 'undefined')
            return res.badRequest('Please send all required data');

        // Find competition by ID
        Competitions.findOneById(req.param('competition_id')).populateAll().then(function (competition) {
            if (!competition) return res.notFound();

            // Check is user is already participating on competition
            var userEntries = _.filter(competition.entries, function (entry) {
                return entry.user == req.param('user_id');
            });

            // User can register on competition only one time
            if (userEntries.length) return res.json('User already registered for competition');

            // updated user object
            var userObj = {
                firstname: req.param('firstname'),
                lastname: req.param('lastname'),
                email: req.param('email'),
                address: req.param('address'),
                postcode: req.param('postcode'),
                town: req.param('town'),
                phone: req.param('phone')
            };

            // Update user with req data
            Users.update(req.param('user_id'), userObj).populateAll().then(function (user) {
                if (!user) return res.notFound();

                var entryObj = {
                    textFieldName: req.param('textFieldName'),
                    textFieldValue: req.param('textFieldValue')
                };

                // Create new entry and link it to user and competition
                CompetitionEntry.create(entryObj).then(function (entry) {

                    user[0].entries.add(entry);
                    competition.entries.add(entry);

                    return [user[0].save(), competition.save()];

                }).spread(function (user, competition) {

                    var protocol = req.connection.encrypted ? 'https' : 'http';
                    var baseUrl = protocol + '://' + req.headers.host + '/';

                    // Send email on user submission
                    EmailService.sendEmail({
                        template: 'competitionSubmit',
                        to: 'nebojsa@smartfactory.ch, roger@smartfactory.ch, martino@smartfactory.ch',
                        subject: 'New user submission'
                    }, {
                        user: user,
                        competition: competition,
                        baseUrl: 'http://46.101.193.252:1337/'
                    }, function (err, msg) {
                        if (err) console.warn('MAIL NOT SENT');
                    });

                    return res.json(user);
                });
            });

        }).catch(function (err) {
            return res.serverError(err);
        });
    },


    contactForm: function (req, res) {
        var params = req.params.all();

        // check if we can continue
        if (typeof params.textFieldValue == 'undefined' || typeof params.user_id == 'undefined' || typeof params.clubCardNumber == 'undefined' || typeof params.firstname == 'undefined' || typeof params.lastname == 'undefined' || typeof params.email == 'undefined' || typeof params.address == 'undefined' || typeof params.addressNum == 'undefined' || typeof params.postcode == 'undefined' || typeof params.town == 'undefined' || typeof params.phone == 'undefined')
            return res.badRequest('Please send all required data');

        Competitions.find(params.competition_id).then(function (competition) {
            var protocol = req.connection.encrypted ? 'https' : 'http';
            var baseUrl = protocol + '://' + req.headers.host + '/';

            // Send email on user submission
            EmailService.sendEmail({
                template: 'contactForm',
                to: 'nebojsa@smartfactory.ch, roger@smartfactory.ch, martino@smartfactory.ch',
                subject: 'New email from Ochsner shoe lovers'
            }, {
                params: params,
                competition: competition,
                baseUrl: 'http://46.101.193.252:1337/'
            }, function (err, msg) {
                if (err) console.warn('MAIL NOT SENT');
            });

            return res.json('Email successfully sent');

        }).catch(function (err) {
            return res.serverError(err);
        });
    },


    single: function (req, res) {
        var params = req.params.all();

        // find model by section
        var model = sails.models[params.section];
        if(!model) return res.notFound('Section not found');

        // find item by ID
        model.findOne(params.id).then(function(item){
            if(!item) return res.notFound('item not found');

            if(params.section == 'teasers') {
                item.image = item.image ? req.baseUrl + item.image : '';
            } else {
                item.listImage = item.listImage ? req.baseUrl + item.listImage : '';
                item.detailImage = item.detailImage ? req.baseUrl + item.detailImage : '';
            }

            return res.json(item);
        });
    }

};

