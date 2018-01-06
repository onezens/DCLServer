/**
 * Created by wz on 2017/11/24.
 */

const express = require('express');
const router = express.Router();
const BisErrCode = require('../../service/sys/BisErrCode');

//import sub module
require('./login')(router);
require('./register')(router);


//user
router.get('/', function (req, res) {
    res.endResult.success(BisErrCode.BaseCode.Success, req.query);
});


module.exports = router;