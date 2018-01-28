/**
 * Created by wz on 2017/11/24.
 */

"use strict";

const redis = require('../../db/redis');
const token = require('../../utils/token');
const util = require('../../utils');
const BisErrCode = require('../sys/BisErrCode');
const mysql = require('../../db/mysql');

//register token expire time
const regTokenExpireTime = util.isDebug ? 60 : 10 * 60; // debug 1min / release 10min
//login token expire time
const loginTokenExpireTime = util.isDebug ? 60 * 10 : 60 * 60 * 24 * 30; // debug 10min / release 1month


function registerUserForDB(userInfo, cb) {

    let regSql = '';
    mysql.execSqlQuery(regSql, cb);
}

//set user password and register user
function setUserPassword(tokenStr, hashPwd, cb) {

    redis.getValueForKey(tokenStr, (err, reply)=>{

        if(err){
            cb(BisErrCode.BAECRedisError.CommonError);
        }else{
            if(token.checkToken(reply)){
                let decodeTokenObj = token.decodeToken(reply);
                let reqInfo = decodeTokenObj.payload.data;
                if(reqInfo.isPassMobileCode){
                    //注册用户，并且入库用户信息，生成session ID
                    registerUserForDB(reqInfo, (err)=>{
                        if(err){
                            cb(BisErrCode.BAECUserLogicError.RegisterUserDBError);
                        }else{
                            let sessionInfo = {};
                            let sessionIdDesInfo = token.createToken(sessionInfo, loginTokenExpireTime);
                            let sessionId = util.md5String(sessionIdDesInfo);
                            redis.setKeyValue(sessionId, sessionIdDesInfo, loginTokenExpireTime);
                            redis.deleteKey(tokenStr);
                            cb(BisErrCode.BaseCode.Success, sessionId);

                        }
                    });

                }else{
                    cb(BisErrCode.BAECLoginLogicError.SetPasswordIllegalRequest);
                }

            }else{
                //token expired
                cb(BisErrCode.BAECLoginLogicError.VerifyImageTokenExpired);
            }
        }
    });
}


//verify mobile num and mobile code
function verifyMobileCode(mobileCode, tokenStr, cb) {

    redis.getValueForKey(tokenStr, (err, reply)=>{

        if(err){
            cb(BisErrCode.BAECRedisError.CommonError);
        }else{
            if(token.checkToken(reply)){
                let decodeTokenObj = token.decodeToken(reply);
                let reqInfo = decodeTokenObj.payload.data;
                if(mobileCode === reqInfo.mobileCode){
                    reqInfo.isPassMobileCode = true;
                    let newToken =  token.createToken(reqInfo, regTokenExpireTime);
                    let newTokenKey = util.md5String(newToken);
                    redis.setKeyValue(newTokenKey, newToken);
                    redis.deleteKey(tokenStr);
                    cb(BisErrCode.BaseCode.Success, newTokenKey);

                    //下一步是设置登录密码，如果登录密码可以跳过，那么这里可以注册用户
                    //TODO: 这里走不可以跳过

                }else{
                    cb(BisErrCode.BAECLoginLogicError.VerifyMobileCodeError);
                }


            }else{
                //token expired
                cb(BisErrCode.BAECLoginLogicError.VerifyImageTokenExpired);
            }
        }
    });
}

function sendVerifyMobileCode(mobileNum, tokenStr, cb) {

    redis.getValueForKey(tokenStr, (err, reply)=>{

        if(err){
            cb(BisErrCode.BAECRedisError.CommonError);
        }else{
            if(token.checkToken(reply)){
                let decodeTokenObj = token.decodeToken(reply);
                let reqInfo = decodeTokenObj.payload.data;
                if(reqInfo.isPassImageCode){
                    //send mobile code
                    let mobileCode = '0000';
                    let sendMobileServerSuccess = true;
                    if(sendMobileServerSuccess){
                        reqInfo.mobileNum = mobileNum;
                        reqInfo.mobileCode = mobileCode;
                        let newToken =  token.createToken(reqInfo, regTokenExpireTime);
                        let newTokenKey = util.md5String(newToken);
                        redis.setKeyValue(newTokenKey, newToken);
                        redis.deleteKey(tokenStr);
                        cb(BisErrCode.BaseCode.Success, newTokenKey);
                    }else{
                        cb(BisErrCode.BAECLoginLogicError.SendMobileCodeServerError);
                    }
                }else {
                    //illegal request , maybe third party fetch data
                    cb(BisErrCode.BAECLoginLogicError.SendMobileCodeIllegalRequest);
                }


            }else{
                //token expired
                cb(BisErrCode.BAECLoginLogicError.VerifyImageTokenExpired);
            }
        }
    });
}

//verify verifyCode
function verifyImageCode(verifyCode, tokenStr, cb) {

    redis.getValueForKey(tokenStr, function(err, reply){

        if(err){
            cb(BisErrCode.BAECRedisError.CommonError);
        }else{
            if(token.checkToken(reply)){
                let decodeTokenObj = token.decodeToken(reply);
                let reqInfo = decodeTokenObj.payload.data;
                if(verifyCode === reqInfo.verifyVal){
                    reqInfo.isPassImageCode = true;
                    let newToken =  token.createToken(reqInfo, regTokenExpireTime);
                    let newTokenKey = util.md5String(newToken);
                    redis.setKeyValue(newTokenKey, newToken);
                    redis.deleteKey(tokenStr);
                    cb(BisErrCode.BaseCode.Success, newTokenKey)
                }else{
                    cb(BisErrCode.BAECLoginLogicError.VerifyImageCodeError);
                }
            }else{
                //token expired
                cb(BisErrCode.BAECLoginLogicError.VerifyImageTokenExpired);
            }
        }
    });
}

//get verifyCode, if resend image code must take previous token
function getImageVerifyCode(reqInfo, preToken, cb) {

    if(preToken){
        //remove unexpired data
        redis.deleteKey(preToken);
    }
    //TODO: verify user submit device info, if not completed res error

    //TODO: generate image verify code
    let verifyUrl = 'http://www.baidu.com';
    reqInfo.verifyId = 'verifyId';
    reqInfo.verifyVal = 'verifyValue';
    reqInfo.verifyUrl = verifyUrl;
    reqInfo.time = util.currentMSecTimeStamp();
    console.log(reqInfo);
    let tokenStr = token.createToken(reqInfo, regTokenExpireTime);
    let md5Key = util.md5String(tokenStr);
    redis.setKeyValue(md5Key, tokenStr, regTokenExpireTime * 1.5); //15min
    cb(BisErrCode.BaseCode.Success,md5Key, verifyUrl);
}

module.exports = {
    getImageVerifyCode: getImageVerifyCode,
    verifyImageCode: verifyImageCode,
    sendMobileCode: sendVerifyMobileCode,
    verifyMobileCode: verifyMobileCode,
    setUserPassword: setUserPassword
};