/**
 * Created by wz on 2017/11/23.
 */

'use strict';

const BisErrCode = require('../../service/sys/BisErrCode');
const loginService = require('../../service/user/login');


module.exports = function (router) {

    //login
    router.get('/login', function (req, res) {

        res.endResult.success(BisErrCode.BaseCode.Success, req.query);
    });

    router.post('/reg/getImageVerifyCode', function (req, res) {

        let did = req.body['did'];
        let device = req.body['device'];
        let preToken = req.body['token'];

        if(did && device && did.length>0 && device.length>0){
            loginService.getImageVerifyCode(req.body, preToken, function (code, token, imgCodeUrl) {
                res.endResult.success(code, {token: token, imageCode: imgCodeUrl});
            });
        }else {
            res.endResult.success(BisErrCode.BAECUserParamError.IllegalError);
        }
    });

    router.post('/reg/verifyImageCode', function (req, res) {

        let imageCode = req.body['imageCode'];
        let token = req.body['token'];
        if(imageCode && token && imageCode.length>0 && token.length>0){
            loginService.verifyImageCode(imageCode, token, function(code, newToken){
                res.endResult.success(code, {token: newToken});
            });
        }else {
            res.endResult.success(BisErrCode.BAECUserParamError.IllegalError);
        }
    });


    router.post('/reg/sendMobileCode', function (req, res) {
        let token = req.body['token'];
        let mobileNum = req.body['mobileNum'];
        if(token && mobileNum && token.length >0 && mobileNum.length>0){
            loginService.sendMobileCode(mobileNum, token, (code, newToken)=>{
                res.endResult.success(code, {token: newToken});
            });
        }else {
            res.endResult.success(BisErrCode.BAECUserParamError.IllegalError);
        }
    });

    router.post('/reg/verifyMobileCode', function (req, res) {
        let token = req.body['token'];
        let mobileCode = req.body['mobileCode'];
        if(token && mobileCode && token.length>0 && mobileCode.length>0){
            loginService.verifyMobileCode(mobileCode, token, (code, newToken)=>{
                res.endResult.success(code, {token: newToken});
            });
        }else{
            res.endResult.success(BisErrCode.BAECUserParamError.IllegalError);
        }
    });


    router.post('/reg/setPassword', function (req, res) {
        let token = req.body['token'];
        let decryptPwd = req.body['password'];
        if(token && decryptPwd && token.length>0 && decryptPwd.length>0){
            loginService.setUserPassword(token, decryptPwd, (code, sid)=>{
                res.endResult.success(code, {sid: sid});
            });
        }else{
            res.endResult.success(BisErrCode.BAECUserParamError.IllegalError);
        }
    });


};
