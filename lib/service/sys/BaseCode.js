/**
 * Created by wz on 2017/11/25.
 */
'use strict';

/**
 *  这里主要处理错误的情况
 *
 *  HTTP Status Code Standard
 *  https://baike.baidu.com/item/HTTP%E7%8A%B6%E6%80%81%E7%A0%81/5053660
 *  1 消息
 *  2 成功 200 OK 201 Created  202 Accepted  203 Non-Authoritative Information  204 No Content 205 Reset Content 206 Partial Content 207 Multi-Status
 *  3 重定向 300 Multiple Choices 301 Moved Permanently 302 Move temporarily
 *  4 请求错误 ▪ 400 Bad Request  401 Unauthorized 402 Payment Required 403 Forbidden 404 Not Found 405 Method Not Allowed
 *  5 服务器错误 ▪ 500 Internal Server Error  501 Not Implemented 502 Bad Gateway  503 Service Unavailable 504 Gateway Timeout
 */


class StatusCode {
    constructor(code, msg){
        this.code = code;
        this.message = msg;
    }
}


/**
 *  sys error define
 */
const BaseCode = {
    Error: new StatusCode(1, 'Unknown Server Error'),
    Success: new StatusCode(200, 'OK'),
    BadRequest: new StatusCode(400, 'Bad Request'),
    NotFound: new StatusCode(404, 'Not Found'),
    ServerError: new StatusCode(500, 'Internal Server Error')
};



module.exports = {
    StatusCode: StatusCode,
    BaseCode: BaseCode,
};