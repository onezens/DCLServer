/**
 * Created by wz on 2017/11/23.
 */
'use strict';

const BaseResult = require('../service/sys/BaseResult');
const utils = require('../utils');
const log = utils.logger;
const BisErrCode = require('../service/sys/BisErrCode');

let res;

function endResponse(resData) {
    res.setHeader('Content-Type', 'application/json');
    res.end(resData);
}

/**
 * 响应数据的方法
 * @type {{success: endResultDefine.success, error: endResultDefine.error, failed: endResultDefine.failed, notFound: endResultDefine.notFound, baseResult: *}}
 */
const endResultDefine = {
    //业务码和可知错误都用success这里----6位数的错误或者业务码
    success: function (code ,data) {
        if(!code){
            this.failed(BisErrCode.BaseCode.ServerError);
            return;
        }
        BaseResult.SUCCESS.setCode(code);
        BaseResult.SUCCESS.setData(data);
        res.statusCode = 200;
        endResponse(BaseResult.SUCCESS.getJson());
    },
    //系统错误自动处理，走下面方法--------3位数的码
    error: function (err) {
        if(err && utils.isDebug){
            BaseResult.ERROR.setMsg(err.message);
            log(err);
        }
        res.statusCode = 500;
        endResponse(BaseResult.ERROR.getJson());
    },
    // code 必须是http status code
    failed:function (statusCode) {
        BaseResult.FAILED.setCode(statusCode);
        res.statusCode = statusCode.code;
        endResponse(BaseResult.FAILED.getJson());
    },
    baseResult: BaseResult
};


module.exports  = function(response) {
    res = response;
    return endResultDefine;
};