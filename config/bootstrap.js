/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function (cb) {

    Cards.find().then(function (cards) {
        if (!cards.length) {
            var demoCards = [];
            for (var i = 0; i <= 3000; i++) {
                demoCards.push({cardNumber: 100000000000000 + i});
            }

            Cards.create(demoCards).then(function (cards) {
                console.log("demo cards created");
            }).catch(function (err) {
                console.log("demo cards failed", err);
            });
        }
    });

    Teasers.find().then(function (teasers) {
        if (!teasers.length) {

            var teasers = [
                {
                    language: 'de',
                    link: 'google.com',
                    linkSection: null,
                    linkItem: null,
                    linkType: 0,
                },
                {
                    language: 'de',
                    link: 'google.com',
                    linkSection: null,
                    linkItem: null,
                    linkType: 0,
                },
                {
                    language: 'fr',
                    link: 'google.com',
                    linkSection: null,
                    linkItem: null,
                    linkType: 0,
                },
                {
                    language: 'fr',
                    link: 'google.com',
                    linkSection: null,
                    linkItem: null,
                    linkType: 0,
                },
                {
                    language: 'it',
                    link: 'google.com',
                    linkSection: null,
                    linkItem: null,
                    linkType: 0,
                },
                {
                    language: 'it',
                    link: 'google.com',
                    linkSection: null,
                    linkItem: null,
                    linkType: 0,
                },
            ];

            Teasers.create(teasers).then(function (teasers) {
                console.log("demo teasers created");
            }).catch(function (err) {
                console.log("demo teasers failed", err);
            });
        }
    });


    // It's very important to trigger this callback method when you are finished
    // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
    cb();
};
