/**
 * CompetitionEntry.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    attributes: {

        textFieldName: {
            type: 'string'
        },

        textFieldValue: {
            type: 'string'
        },

        competition: {
            model: 'competitions'
        },

        user: {
            model: 'users'
        }
    }
};

