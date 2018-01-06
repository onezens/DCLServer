/**
 * Created by wz on 2017/11/24.
 */

const redis = require('../lib/db/redis');

function testHmKey(key) {
    redis.createNewHmKey(key, {
        name: 'liming',
        age: 20,
        height: 180,
        weight: 140,
        job: 'ios dev',
        homePage: 'www.baidu.com'
    }, function (err, obj) {
        if (err){
            console.log(err);
        }else {
            console.log(obj);
        }
    });

    redis.getHmObjForKey(key, function (err, obj) {
        if (err){
            console.log(err);
        }else {
            console.log(obj);
        }
    });

    redis.updateHmKey(key, 'job', 'node.js server dev', function (err, obj) {
        if (err){
            console.log(err);
        }else {
            console.log(obj);
        }
    });


    redis.getHmObjForKey(key, function (err, obj) {
        if (err){
            console.log(err);
        }else {
            console.log(obj);
        }
    });

    redis.deleteKey(key, function (err, obj) {
        if (err){
            console.log(err);
        }else {
            console.log(obj);
        }
    });



    redis.getHmObjForKey(key, function (err, obj) {
        if (err){
            console.log(err);
        }else {
            console.log(obj);
        }
    });
}

// testHmKey('user_liming');
redis.testMethod();
redis.setExpireTime('key', 10, function (err, obj) {
    if (err){
        console.log(err);
    }else {
        console.log(obj);
    }
});