/**
 * News.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var fs = require('fs-extra');
module.exports = {

    schema: true,

    attributes: {
        title: {
            type: 'string',
            required: true
        },
        description: {
            type: 'string',
            required: true
        },
        detailImage: {
            type: 'string'
        },
        listImage: {
            type: 'string'
        },
        language: {
            type: 'string',
            enum: ['de', 'fr', 'it'],
            required: true
        },
        startDate: {
            type: 'date',
            required: true
        },
        endDate: {
            type: 'date',
            required: true
        }
    },

    afterDestroy: function (destroyedRecords, cb) {
        var listImage = destroyedRecords[0].listImage;
        var detailImage = destroyedRecords[0].detailImage;

        fs.remove(__dirname + '/../../' + listImage, function (err) {
            if (err) return console.error(err)
        });

        fs.remove(__dirname + '/../../' + detailImage, function (err) {
            if (err) return console.error(err)
        });

        cb();
    }
};