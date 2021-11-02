/**
 * Facebook.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        twitterID: {
            type: 'integer',
            required: true,
            unique: true
        },

        twitterEmail: {
            type: 'email',
            unique: true
        },

        user: {
            model: 'users'
        }
    }
};

