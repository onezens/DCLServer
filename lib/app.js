/**
 * Created by wz on 2017/11/22.
 */
'use strict';

const express = require('express');
const router = require('./router');
const utils = require('./utils');
const config = require('./config');
const pkg = require('../package.json');
const response = require('./middleware/response');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('./db/mysql');
const BisErrCode = require('./service/sys/BisErrCode');
const debugLog = require('debug')('DCL::index');

//create a server app
const app = express();

//set global var
app.locals.api = {
    name: pkg.name,
    version: pkg.version,
    apiVer: config.apiVer,
    serverUrl: config.serverUrl
};


// config logger for console
if (config.logging !== false) {
    if (!utils.isDebug) {
        app.use(morgan('combined', config.logging));
        // create a write stream (in append mode)
        const accessLogStream = fs.createWriteStream(path.join(__dirname,'../','access.log'), {flags: 'a'});
        // setup the logger
        app.use(morgan('combined', {stream: accessLogStream}));
    } else {
        app.use(morgan('dev', config.logging));
    }
}

//set some middleware
app.use(function (req, res, next) {
   res.endResult = response(res);
   next();
});

//post body parser
app.use(bodyParser.json());

app.use(function (req, res, next) {
    if(req.method === 'POST'){
        if(utils.isEmptyObj(req.body)){
            res.endResult.failed(BisErrCode.BaseCode.BadRequest);
            return;
        }
    }
    next();
});

//set router
router(app);

//error handler
app.use(function (err, req, res, next) {
    res.endResult.error(err);
});

//start server
app.listen(config.port, function () {
    mysql.initDatabase();
    debugLog('api server start success! server url : ' + config.serverUrl);
    debugLog('environment: isDebug ' + utils.isDebug);
});

