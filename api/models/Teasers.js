/**
 * Teasers.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {

    schema: true,

    attributes: {
        //startDate: {
        //    type: 'date',
        //    required: true
        //},
        //endDate: {
        //    type: 'date',
        //    required: true
        //},
        image: {
            type: 'string'
        },
        language: {
            type: 'string',
            enum: ['de', 'fr', 'it'],
            required: true
        },
        linkSection: {
            type: 'string',
            defaultsTo: null
        },
        linkItem: {
            type: 'integer',
            defaultsTo: null
        },
        linkType: {
            type: 'boolean',
            defaultsTo: false
        },
        link: {
            type: 'string',
            defaultsTo: null
        }
    }

};