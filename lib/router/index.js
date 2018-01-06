/**
 * Created by wz on 2017/11/22.
 */
'use strict';

const BisErrCode = require('../service/sys/BisErrCode');

module.exports = function (app) {

    //server host
    app.get('/', function (req, res) {
        const data = 'Api Server: ' + app.locals.api.serverUrl;
        res.end(data);
    });

    //router
    app.use('/user', require('./user'));

    //router
    app.use('/profile', require('./profile'));

    //404 not found
    app.use(function (req, res) {
        res.endResult.failed(BisErrCode.BaseCode.NotFound);
    });
};