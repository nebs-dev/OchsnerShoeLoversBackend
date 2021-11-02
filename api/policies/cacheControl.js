/*
*
* policy that is used mostly on API routes
* adds cache-control header
*
 */

module.exports = function (req, res, next) {
    res.header('Cache-Control', 'public, max-age=60');
    next();
};