/**
 * 500 (Server Error) Response
 *
 */

module.exports = function serverError(err) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(500);

    res.json(err);

};
