/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * Only applies to HTTP requests (not WebSockets)
 *
 * For more information on configuration, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.http.html
 */

var formidable = require('formidable');

module.exports.http = {

    // custom middleware for thumbnails on the fly
    customMiddleware: function (app) {
        var qt = require('quickthumb');
        app.use('/uploads', qt.static(sails.config.appPath + '/uploads'));
    },

    /****************************************************************************
     *                                                                           *
     * Express middleware to use for every Sails request. To add custom          *
     * middleware to the mix, add a function to the middleware config object and *
     * add its key to the "order" array. The $custom key is reserved for         *
     * backwards-compatibility with Sails v0.9.x apps that use the               *
     * `customMiddleware` config option.                                         *
     *                                                                           *
     ****************************************************************************/

    middleware: {

        /***************************************************************************
         *                                                                          *
         * The order in which middleware should be run for HTTP request. (the Sails *
         * router is invoked by the "router" middleware below.)                     *
         *                                                                          *
         ***************************************************************************/

        order: [
            'startRequestTimer',
            'cookieParser',
            'session',
            'bodyParser',
            'handleBodyParserError',
            'compress',
            'methodOverride',
            'poweredBy',
            '$custom',
            'router',
            'www',
            'favicon',
            '404',
            '500'
        ]
    },

    /****************************************************************************
     *                                                                           *
     * Example custom middleware; logs each request to the console.              *
     *                                                                           *
     ****************************************************************************/

    // myRequestLogger: function (req, res, next) {
    //     console.log("Requested :: ", req.method, req.url);
    //     return next();
    // }


    // added custom bodyparser using formidable... skipper (default sails) cant handle our crop image uploads :(
    bodyParser: function () {
        return function (req, res, next) {
            req.form = new formidable.IncomingForm();
            req.form.keepExtensions = true;
            req.form.uploadDir = sails.config.appPath + '/uploads/tmp';
            req.form.maxFieldsSize = 5 * 1024 * 1024; // 5mb

            req.form.parse(req, function (err, fields, files) {
                if (err) return next(err);

                req.body = fields;
                req.files = files;
                next();
            });

        }
    }

    /***************************************************************************
     *                                                                          *
     * The number of seconds to cache flat files on disk being served by        *
     * Express static middleware (by default, these files are in `.tmp/public`) *
     *                                                                          *
     * The HTTP static cache is only active in a 'production' environment,      *
     * since that's the only time Express will cache flat-files.                *
     *                                                                          *
     ***************************************************************************/

    // cache: 31557600000
};