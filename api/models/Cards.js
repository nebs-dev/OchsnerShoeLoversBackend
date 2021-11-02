/**
 * Cards.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {

        cardNumber: {
            type: 'integer',
            required: true,
            unique: true,
            minLength: 15,
            maxLength: 15
        },

        user: {
            model: 'users'
        },

        available: {
            type: 'boolean',
            defaultsTo: true
        }

    }
};
