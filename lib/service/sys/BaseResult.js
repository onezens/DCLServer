/**
 * Created by wz on 2017/11/23.
 */

'use strict';

const BisErrCode = require('./BisErrCode');
const util = require('../../utils');

class BaseResult{
    /**
     * StatusCode
     * @param statusCode StatusCode class identify
     * @param data Json data / Json object
     */
    constructor(statusCode,data){
        this.setCode(statusCode);
        this.setData(data);
    }
    setCode(statusCode){
        this.code = statusCode.code;
        //env==production have no msg
        if(util.isDebug) this.setMsg(statusCode.message);
    }
    setMsg(msg){
        this.msg = msg;
    }
    setData(data){
        if(util.isEmptyObj(data)) {
            this.data = null;
        }else {
            this.data = data;
        }
    }
    getJson(){
        return JSON.stringify(this);
    }
}

module.exports = {
    SUCCESS: new BaseResult(BisErrCode.BaseCode.Success, {}),
    ERROR: new BaseResult(BisErrCode.BaseCode.ServerError,  {}),
    FAILED: new BaseResult(BisErrCode.BaseCode.Error, {})
}