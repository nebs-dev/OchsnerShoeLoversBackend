/**
 * 400 (Bad Request) Handler
 *
 */

module.exports = function badRequest(msg, err) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(400);

    res.json({err: msg});

};

