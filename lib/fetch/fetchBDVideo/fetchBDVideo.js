
const {fetch, netSpiderEngine} = require('../fetch');
const debugLog = require('debug')('DCL::fetch::fetchBDVideo'),
cheerio = require('cheerio');
const {URL} = require('url');
const fs = require('fs');
const path = require('path');

let results = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json')).toString());


//start to fetch
function fetchData() {
    const headers = {
        'Connection' : 'keep-alive',
        'User-Agent' : 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Mobile Safari/537.36'
    };
    const fetchListUrl = "https://sv.baidu.com/#dongman";
    const netSpider = netSpiderEngine(fetchListUrl);
    fetch(netSpider, fetchListUrl, headers, function (err, data) {
        if (err){
            debugLog(err);
        }else{
            try{
                analysisVideoTabList(err, data);
            }catch(e){
                // debugLog(e);
                // setInterval(function () {
                //     fetchData();
                // },3000);
            }

        }
    });
}

function analysisVideoTabList(err, data) {

    if (err){
        debugLog('[analysisVideoTabList] error: ' + err);
    }else {

        debugLog(data);
    }
}

function analysisVideoList(err, data) {
    if (err || !data){
        debugLog('[analysisVideoList] error: %s  data: %s', err, data);
        return;
    }
    let $ = cheerio.load(data);
    $('.video-list-inner li .video-list-item').each(function (_, val) {
        // debugLog($(val).html());
        let playUrl = $(val).attr('data-vsrc');
        let title = $(val).attr('data-title');
        let extObj = JSON.parse($(val).attr('data-ext'));
        // var vid = extObj['vid'];
        var image = extObj["image"];
        var tab = extObj['tab_id'];

        let fetchResult = {
            title : title,
            playUrl : playUrl,
            image: image ? image : "",
            tab: tab
        };

        if(fetchResult.title && fetchResult.playUrl && fetchResult.image && fetchResult.tab){
            debugLog("[analysisVideoList] fetch data success: %O", fetchResult);
            //prepare to insert db
            results.push(fetchResult);
            fs.writeFileSync(path.join(__dirname, 'db.json'), JSON.stringify(results));

        }else{
            debugLog('[analysisVideoList] fetch data error: %O', fetchResult);
        }
    });
    setInterval(function () {
        fetchData();
    },3000);
}


function analysisVideoDetail(err,fetchUrl, data) {

    let url = new URL(fetchUrl);
    let queryObj = JSON.parse(url.searchParams.get('context'));
    const $ = cheerio.load(data);
    $('script').each(function (_, val) {
        let valStr = $(val).html();
        if(valStr && valStr.indexOf('window.VdDev') != -1){
            //create DOM object
            let window = {
                curVideoMeta : null,
                VdDev: null
            };
            eval(valStr); //exec js
            let fetchResult = {
                vid : window.curVideoMeta.id,
                title : window.curVideoMeta.title,
                playUrl : window.curVideoMeta.playurl,
                image: queryObj.poster_big,
                category: window.curVideoMeta.ext_log.pd

            }
            debugLog('[analysisVideoDetail] fetch data completed:\n %O ',fetchResult);
        }

    });
}

fetchData();