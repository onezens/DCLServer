/**
 * Created by wz on 2017/11/24.
 */

const token = require('../lib/utils/token');
const util = require('../lib/utils');

let newToken = token.createToken({name:'xiaoming', age:20}, 3);
console.log('newToken: ' + newToken);

console.log('md5 new token: ' + util.md5String(newToken));

var time = 0;
let timer = setInterval(function () {

    time++;
    if(time >= 10){
        if(token.checkToken(newToken)){
            console.log('no timerout token :' + time + ' invalidate: ' + JSON.stringify(token.decodeToken(newToken)));

        }else{
            console.log('timerout token' + time + ' invalidate: ' + JSON.stringify(token.decodeToken(newToken)));
            clearInterval(timer);
        }
    }

}, 1000);

