/**
 * 404 (Not Found) Handler
 *
 */

module.exports = function notFound(msg, err) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(404);

    res.json({err: msg});

};

