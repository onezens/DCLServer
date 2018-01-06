/**
 * Created by wz on 2017/11/24.
 */
"use strict";
const redis = require('redis');
const config = require('../config');



function createClient() {
    const client = redis.createClient(config.redis.port, config.redis.host, {});

    //error
    client.on('error', function (error) {
        console.log(error);
    });
    //redis auth
    if(config.redis.password.length>0){
        client.auth(config.redis.password);
    }

    return client;
}


function deleteKey(key, cb) {
    let client = createClient();
    client.del(key, function (err, obj) {
        cb && cb(err, obj);
        client.quit();
    });
}


function getAllKeys() {
    let client = createClient();
    client.hkeys('user_liming', function (err, replies) {
        if (err) {
            return console.error('error response - ' + err);
        }

        console.log(replies.length + ' replies:');
        replies.forEach(function (reply, i) {
            console.log('    ' + i + ': ' + reply);
        });
    });
}

function getHmObjForKey(key, cb) {
    let client = createClient();
    client.hgetall(key, function (err, obj) {
        cb && cb(err, obj);
        client.quit();
    });
}


function createNewHmKey(key, obj, cb) {
    let client = createClient();
    client.hmset(key, obj, function (err, obj) {
        cb && cb(err, obj);
        client.quit();
    });
}

function updateHmKey(key, filed, value, cb) {
    let client = createClient();
    client.hmset(key, filed, value, function (err, obj) {
        cb && cb(err, obj);
        client.quit();
    });
}


function testMethod() {
    let client = createClient();
    client.hmset("key", "test keys 1", "test val 1", "test keys 2", "test val 2", 'EX', 10, function (err, res) {
        if (err){
            console.log(err);
        }else{
            console.log(res);
        }
    });
}

function setExpireTime(key, expireTime, cb) {
    let client = createClient();
    client.expire(key, expireTime, (err, obj)=>{
        cb && cb(err, obj);
        client.quit();
    });
}

//client.set('key', 'value!', 'EX', 10);
function setKeyValue(key, value, exTime, cb) {
    let client = createClient();
    if(exTime>0){
        client.set(key, value, 'EX', exTime, (err, obj)=>{
            cb && cb(err, obj);
            client.quit();
        });
    }else{
        client.set(key, value,(err, obj)=>{
            cb && cb(err, obj);
            client.quit();
        });
    }
}

function getValueForKey(key, cb) {
    let client = createClient();
    client.get(key, (err, reply)=>{
        cb && cb(err, reply);
    });
}

module.exports = {
    getHmObjForKey: getHmObjForKey,
    createNewHmKey: createNewHmKey,
    deleteKey: deleteKey,
    updateHmKey: updateHmKey,
    testMethod: testMethod,
    setExpireTime: setExpireTime,
    setKeyValue: setKeyValue,
    getValueForKey: getValueForKey
}
