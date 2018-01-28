/**
 * Created by wz on 2018/1/13.
 */

'use strict'

const http = require("http");
const https = require("https");
const zlib = require('zlib');
const debugLog = require('debug')("DCL::fetch");
const { URL } = require('url');
const iconv = require('iconv-lite')
const BufferHelper = require('bufferhelper');

function netSpiderEngine(fetchInfo) {
    if(fetchInfo && fetchInfo.indexOf("https")!=-1){
        return https;
    }
    return http;
}


function fetch(fetchSpider,fetchUrl,headers,cb) {

    const url = new URL(fetchUrl);
    const options={
        hostname: url.hostname,
        port: url.port,
        path: url.pathname+url.search,
        headers: headers,
    }


    var req=fetchSpider.request(options,function(res){
        if(res.statusCode == 200){
            //success fetch data
            const contentEncode = res.headers['content-encoding'];
            if(contentEncode && contentEncode.indexOf('gzip') != -1){
                var resDataGzip = [];
                res.on("data",function(chunk){
                    resDataGzip.push(chunk);
                });
                res.on("end",function(){
                    var buffer = Buffer.concat(resDataGzip);
                    zlib.gunzip(buffer, function(err, decoded) {
                        fetchResponse(decoded, res.headers,cb);
                    })
                });

            }else{
                var bufferHelper = new BufferHelper();
                res.on("data",function(chunk){
                    bufferHelper.concat(chunk);
                });
                res.on("end",function(){

                    fetchResponse(bufferHelper, res.headers,cb);

                });
            }
        }else {
            //fetch data failed
            //TODO: operate 302/301 redirect
            cb(null, res.statusCode);
            debugLog('http statusCode: ', res.statusCode, res.headers);
        }


    });

    req.on("error",function(err){
        debugLog('error: '+err.message);
        cb(err, null);
    });
    req.write('');
    req.end();
    req.keepAliveTimeout = 60;
    debugLog('start fetch url: %s \n headers: %O', fetchUrl, req.output);
}

function fetchResponse(dataBuffer, resHeaders,cb){
    debugLog('[fetchResponse] headers %O', resHeaders);
    var data = dataBuffer;
    if(dataBuffer.toString().indexOf('gbk') != -1 || dataBuffer.toString().indexOf('GBK') != -1 ){
        debugLog('detect gbk start convert!');
        data = iconv.decode(dataBuffer.toBuffer(),'GBK');
    }else{
        data = data.toString();
    }
    cb(null,data);
}


module.exports.fetch = fetch;
module.exports.netSpiderEngine = netSpiderEngine;