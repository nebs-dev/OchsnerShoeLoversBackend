/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    // __________BASE CONTROLLER_____________
    'GET /': {
        controller: 'Base',
        action: 'home'
    },

    'GET /login': {
        controller: 'Base',
        action: 'login'
    },

    'POST /login': {
        controller: 'Base',
        action: 'login'
    },

    'GET /logout': {
        controller: 'Base',
        action: 'logout'
    },

    'GET /profile': {
        controller: 'Base',
        action: 'profile'
    },

    'POST /profile': {
        controller: 'Base',
        action: 'profileSubmit'
    },

    // ________ API ________
    'POST /api/signUp': {
        controller: 'Api',
        action: 'signUp'
    },

    'POST /api/signIn': {
        controller: 'Api',
        action: 'signIn'
    },

    'POST /api/newCard': {
        controller: 'Api',
        action: 'newCard'
    },


    'POST /api/addUser': {
        controller: 'Api',
        action: 'addUser'
    },

    'POST /api/contactForm': {
        controller: 'Api',
        action: 'contactForm'
    },

    'GET /api/homeFeed': {
        controller: 'Api',
        action: 'homeFeed'
    },

    'GET /api/:model': {
        controller: 'Api',
        action: 'list'
    },

    'GET /api/single/:section/:id': {
        controller: 'Api',
        action: 'single'
    },

    // __________ADMINS___________
    'GET /admins/list': {
        controller: 'Admins',
        action: 'index'
    },

    'GET /admins/create': {
        controller: 'Admins',
        action: 'view'
    },

    'POST /admins/create': {
        controller: 'Admins',
        action: 'create'
    },

    'GET /admins/:id': {
        controller: 'Admins',
        action: 'view'
    },

    'POST /admins/:id': {
        controller: 'Admins',
        action: 'update'
    },

    'POST /admins/destroy/:id': {
        controller: 'Admins',
        action: 'destroy'
    },

    // ________ NEWS ________
    'GET /news/:language': {
        controller: 'News',
        action: 'index'
    },

    'GET /news/:language/create': {
        controller: 'News',
        action: 'view'
    },

    'GET /news/:language/:id': {
        controller: 'News',
        action: 'view'
    },

    'POST /news/:language/create': {
        controller: 'News',
        action: 'create'
    },

    'POST /news/:language/:id': {
        controller: 'News',
        action: 'update'
    },

    'POST /news/:language/:id/destroy': {
        controller: 'News',
        action: 'destroy'
    },

    // ________ TRENDS ________
    'GET /trends/:language': {
        controller: 'Trends',
        action: 'index'
    },

    'GET /trends/:language/create': {
        controller: 'Trends',
        action: 'view'
    },

    'GET /trends/:language/:id': {
        controller: 'Trends',
        action: 'view'
    },

    'POST /trends/:language/create': {
        controller: 'Trends',
        action: 'create'
    },

    'POST /trends/:language/:id': {
        controller: 'Trends',
        action: 'update'
    },

    'POST /trends/:language/:id/destroy': {
        controller: 'Trends',
        action: 'destroy'
    },

    // ________ OFFERS ________
    'GET /offers/:language': {
        controller: 'Offers',
        action: 'index'
    },

    'GET /offers/:language/create': {
        controller: 'Offers',
        action: 'view'
    },

    'GET /offers/:language/:id': {
        controller: 'Offers',
        action: 'view'
    },

    'POST /offers/:language/create': {
        controller: 'Offers',
        action: 'create'
    },

    'POST /offers/:language/:id': {
        controller: 'Offers',
        action: 'update'
    },

    'POST /offers/:language/:id/destroy': {
        controller: 'Offers',
        action: 'destroy'
    },

    // ________ COMPETITIONS ________
    'GET /competitions/:language': {
        controller: 'Competitions',
        action: 'index'
    },

    'GET /competitions/:language/create': {
        controller: 'Competitions',
        action: 'view'
    },

    'GET /competitions/:language/:id': {
        controller: 'Competitions',
        action: 'view'
    },

    'POST /competitions/:language/create': {
        controller: 'Competitions',
        action: 'create'
    },

    'POST /competitions/:language/:id': {
        controller: 'Competitions',
        action: 'update'
    },

    'POST /competitions/:language/:id/destroy': {
        controller: 'Competitions',
        action: 'destroy'
    },

    // ________ TEASERS ________
    'GET /teasers/:language': {
        controller: 'Teasers',
        action: 'index'
    },

    'GET /teasers/:language/:id': {
        controller: 'Teasers',
        action: 'view'
    },

    'POST /teasers/:language/:id': {
        controller: 'Teasers',
        action: 'update'
    },

    'POST /teasers/:language/:id/destroy': {
        controller: 'Teasers',
        action: 'destroy'
    },

    'POST /teasers/linkItems': {
        controller: 'Teasers',
        action: 'getLinkItems'
    }

};
