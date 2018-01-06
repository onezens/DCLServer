/**
 * Created by wz on 2017/11/23.
 */
'use strict'


const isDebug = process.env.NODE_ENV != 'production';
const crypto = require('crypto');

function logger(obj) {
    console.log(obj);
}

function isEmptyObj(obj) {

    if(!obj) return true;
    const strObj = JSON.stringify(obj);
    if (strObj.length == 0 || strObj == '[]' || strObj =='{}'){
        return true;
    }
    return false;
}

function currentSecTimeStamp() {
    let time = new Date().getTime();
    time = time / 1000;
    return Math.floor(time);
}

function currentMSecTimeStamp() {
    const time = new Date().getTime();
    return time;
}


function md5String(str) {
    const md5 = crypto.createHash("md5");
    md5.update(str);
    return md5.digest('hex');
}


module.exports = {
    isDebug: isDebug,
    logger: logger,
    isEmptyObj: isEmptyObj,
    currentSecTimeStamp: currentSecTimeStamp,
    currentMSecTimeStamp: currentMSecTimeStamp,
    md5String: md5String
}