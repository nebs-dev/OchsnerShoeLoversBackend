/**
 * Users.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

var sha1 = require("sha1");
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
        email: {
            type: 'email',
            unique: true
        },
        password: {
            type: 'string'
        },
        image: {
            type: 'string'
        },
        superadmin: {
            type: 'boolean',
            defaultsTo: false
        }
    },

    beforeCreate: function (values, cb) {
        var encryptedPass = sha1('MIDGET' + values.password + 'NINJA');
        values.password = encryptedPass;
        cb();
    },

    beforeUpdate: function (values, cb) {
        if(values.password) {
            var encryptedPass = sha1('MIDGET' + values.password + 'NINJA');
            values.password = encryptedPass;
        }
        cb();
    }
};


