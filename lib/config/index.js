/**
 * Created by wz on 2017/11/22.
 */
'use strict';

const utils = require('../utils');
var config;

if(utils.isDebug){
    config = require('./development');
}else{
    config = require('./production');
}

config.serverUrl = 'http://' + config.host + ':' + config.port;

module.exports = config;