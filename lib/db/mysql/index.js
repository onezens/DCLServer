/**
 * Created by wz on 2017/11/22.
 */

'use strict';

const mysql = require('mysql');
const config = require('../../config');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const log = require('../../utils').logger;


function getMysqlCon() {
    return mysql.createConnection({
        host     : config.mysql.host,
        user     : config.mysql.user,
        password : config.mysql.password,
        database : config.mysql.database
    });
}

function execSqlQuery(queryStr, cb) {

    const connection = getMysqlCon();
    connection.connect();
    if(typeof queryStr == 'string'){
        connection.query(queryStr, function (err, result, fields) {
            cb(err, result, fields);
            connection.end();
        });
    }else{
        const errStr = 'Error sql type: \nQuery: ' + queryStr + 'Query Type: ' + typeof queryStr;
        log(errStr);
        cb(new Error(errStr), null, null);
    }
}


function initDatabase() {

    const sqlQueryPath = path.join(__dirname, 'query.sql');

    const rl = readline.createInterface({
        input: fs.createReadStream(sqlQueryPath)
    });

    let sqlCount = 0;
    let errorCount = 0;
    let successCount = 0;

    rl.on('line', (line) => {
        //filter sql query
        if(line.length>0 && line.indexOf('/') == -1 ){
            execSqlQuery(line,(err)=>{
                sqlCount += 1;
                if(err){
                    errorCount += 1;
                    log('current sqlCount: ' + sqlCount + ' current errCount: ' +  errorCount + ' successCount: ' + successCount + '\ninit Sql Error: ' + err);
                }else{
                    successCount += 1;
                    log('current sqlCount: ' + sqlCount + ' current errCount: ' +  errorCount + ' successCount: ' + successCount);
                }
            });
        }
    });


}

module.exports = {
    connection: getMysqlCon,
    initDatabase: initDatabase,
    execSqlQuery: execSqlQuery,
}