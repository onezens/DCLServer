/**
 * Created by wz on 2017/11/25.
 */
'use strict';

const BaseCode = require('./BaseCode');
const StatusCode = BaseCode.StatusCode;

/**
 * api server 业务码和错误码定义规范 (Business and Error Code Define Standard)
 *  0. 服务器内部相关服务已知的错误，异常 ，请求错误以：500开头，往后累增。（服务器报错，为系统错误，未知的 sysError：502 ）
 *  1. 用户提交参数错误，请求错误以：4001开头，具体错误，后面三位定义（其中POST参数为空 sysError：400 中间件过滤）
 *  2. 登录注册相关 -> 业务逻辑以：2001开头， 错误以：2011开头
 *  3. 用户操作相关 -> 业务逻辑以：2002开头， 错误以：2012开头
 *
 */

/**
 *  database error 5001
 */
const BAECDatabaseError = {
    CommonError : new StatusCode(500100, 'database error'),
    ConnectError : new StatusCode(500101, 'database connection error')
};

/**
 *  redis error 5002
 */
const BAECRedisError = {
    CommonError : new StatusCode(500200, 'redis error'),
    ConnectError : new StatusCode(500201, 'redis connection error')
};

/**
 *  submit parameter or data error 4001
 */
const BAECUserParamError = {
    MissingError : new StatusCode(400101, 'missing parameters'),
    TypeError : new StatusCode(400102, 'parameter type error'),
    IllegalError : new StatusCode(400103, 'illegal parameter')
};

/**
 *  login business logic code 2001
 */
const BAECLoginLogicCode = {
    200100 : 'success',
    200101 : 'error',
    200102 : 'server error',
    200104 : 'not found',
    200105 : 'request error'
};

/**
 *  login business error code 2011
 */
const BAECLoginLogicError = {
    VerifyImageTokenExpired : new StatusCode(201101, 'verify image token expired or not exist'),
    VerifyImageCodeError : new StatusCode(2011012, 'verify image code error'),
    VerifyMobileCodeError : new StatusCode(2011013, 'verify mobile code error'),
    SendMobileCodeServerError : new StatusCode(2011014, 'send mobile code server error'),
    SendMobileCodeIllegalRequest : new StatusCode(2011015, 'send mobile code illegal request'),
    SetPasswordIllegalRequest : new StatusCode(2011016, 'first set user password illegal request'),
    RegisterUserDBError : new StatusCode(2011017, 'register user database error'),
};

/**
 *  user business logic code 2002
 */
const BAECUserLogicCode = {
    200200 : 'success',
    200201 : 'error',
    200202 : 'server error',
    200204 : 'not found',
    200203 : 'request error'
};

/**
 *  user business error code 2012
 */
const BAECUserLogicError = {
    201200 : 'success',
    201201 : 'error',
    201202 : 'server error',
    201204 : 'not found',
    201203 : 'request error'
};


module.exports = {
    StatusCode: StatusCode,
    BaseCode: BaseCode.BaseCode,
    BAECDatabaseError: BAECDatabaseError,
    BAECRedisError: BAECRedisError,
    BAECUserParamError: BAECUserParamError,
    BAECLoginLogicCode: BAECLoginLogicCode,
    BAECLoginLogicError: BAECLoginLogicError,
    BAECUserLogicCode: BAECUserLogicCode,
    BAECUserLogicError: BAECUserLogicError
};