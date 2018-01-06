/**
 * Created by wz on 2017/11/23.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.get('/', function (req, res) {
    res.endResult.success(200, {name: 'zhang', id: 2000, age: 20});
});

router.post('/', function (req, res) {
    console.log(JSON.stringify(req.body));
    res.end('success');
})



module.exports = router;