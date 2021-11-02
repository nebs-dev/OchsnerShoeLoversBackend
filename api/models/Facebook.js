/**
 * Facebook.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {
        facebookID: {
            type: 'integer',
            required: true,
            unique: true
        },

        facebookEmail: {
            type: 'email',
            unique: true
        },

        user: {
            model: 'users'
        }
    }
};

