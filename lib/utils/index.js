/**
 * Created by wz on 2017/11/23.
 */
'use strict'


const isDebug = process.env.NODE_ENV != 'production';
const crypto = require('crypto');
const log = require('debug')('api::utils');

function logger(obj) {
    log(obj);
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


function aesEncrypt(data, key) {
    if(data.length==0) return "";
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted, key) {
    if(encrypted.length==0) return "";
    const decipher = crypto.createDecipher('aes192', key);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function aes256encryptBase64(data, key) {
    if(data.length==0) return "";
    const md5Key = md5String(key);
    const iv = new Buffer(16);
    iv.fill(0);
    const cipher = crypto.createCipheriv('aes-256-cbc', md5Key, iv);
    const output = cipher.update(data, 'utf8', 'base64');
    output += cipher.final('base64');
    return output;
}

function aes256DecryptBase64(data, key) {
    if(data.length==0) return "";
    const md5Key = md5String(key);
    const iv = new Buffer(16);
    iv.fill(0);
    const cipher = crypto.createDecipheriv('aes-256-cbc', md5Key, iv);
    const output = cipher.update(data,'base64', 'utf8');
    output += cipher.final('utf8');
    return output;
}


module.exports = {
    isDebug: isDebug,
    logger: logger,
    isEmptyObj: isEmptyObj,
    currentSecTimeStamp: currentSecTimeStamp,
    currentMSecTimeStamp: currentMSecTimeStamp,
    md5String: md5String,
    aesEncrypt: aesEncrypt,
    aesDecrypt: aesDecrypt,
    aes256encryptBase64: aes256encryptBase64,
    aes256DecryptBase64: aes256DecryptBase64

}