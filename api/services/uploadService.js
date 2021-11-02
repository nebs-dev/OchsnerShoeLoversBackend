/*
 *
 * files are automatically uploaded to /uploads/tmp using custom body parser (config/http.js)
 * this service just attaches file to model if everything is ok
 * if file is not sent in request, its ignored...
 *
 */

var fs = require('fs-extra');
var path = require('path');

module.exports = function moveFromTemp(req, files, model, callback) {

    // go through all files needed to move from temp
    async.map(files, function (fileName, cb) {

        var file = req.files[fileName];

        // if we dont have file inside request, go next
        if (!file) return cb();

        var fileInfo = {};
        fileInfo.path = file.path;
        fileInfo.basename = path.basename(file.path);

        // new path is same like old if existed in model, so we overwrite
        fileInfo.newPath = (model && model[fileName]) ? path.join(sails.config.appPath, model[fileName]) : path.join(sails.config.appPath, '/uploads', fileInfo.basename);

        // move the file (clobber: true so it overwrites)
        fs.move(fileInfo.path, fileInfo.newPath, {clobber: true}, function (err) {
            if (err) return cb(err);

            // move succeeded, update model if needed
            if (!model || model[fileName]) return cb(null, fileInfo.basename);

            // set model fileName to new value
            model[fileName] = '/uploads/' + fileInfo.basename;

            model.save(function (err) {
                if (err) {
                    // this shouldn't happen but lets handle it...
                    // model update failed, put file back to temp
                    fs.move(fileInfo.newPath, fileInfo.path, {clobber: true}, function () {
                        return cb(err);
                    });
                } else {
                    // file move / model update = done :)
                    cb(null, fileInfo.basename);
                }
            });

        });

    }, function allDone(err, movedFiles) {
        if (err) return callback(err);

        callback(null, movedFiles);
    });
};