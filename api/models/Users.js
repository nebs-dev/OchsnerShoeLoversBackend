/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
    schema: true,

    attributes: {
        firstname: {
            type: 'string',
            defaultsTo: null
        },
        lastname: {
            type: 'string',
            defaultsTo: null
        },
        gender: {
            type: 'string',
            defaultsTo: null
        },
        birthDate: {
            type: 'date',
            defaultsTo: null
        },
        email: {
            type: 'email',
            unique: true
        },
        address: {
            type: 'string',
            defaultsTo: null
        },
        addressNum: {
            type: 'integer',
            defaultsTo: null
        },
        postcode: {
            type: 'integer',
            minLength: 4,
            maxLength: 4,
            defaultsTo: null
        },
        town: {
            type: 'string',
            defaultsTo: null
        },
        phone: {
            type: 'string',
            defaultsTo: null
        },
        source: {
            type: 'string',
            enum: ['signIn', 'signUp', 'newCard'],
            required: true
        },
        cards: {
            collection: 'cards',
            via: 'user'
        },
        pushToken: {
            type: 'string'
        },
        udid: {
            type: 'string',
            required: true
        },
        entries: {
            collection: 'competitionEntry',
            via: 'user'
        },
        facebook: {
            model: 'facebook'
        },
        twitter: {
            model: 'twitter'
        }
    }
};


