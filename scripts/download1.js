var fs = require('fs');
var url = require('url');
var path = require('path');
var https = require('https');

var host = [
  'https://raw.githubusercontent.com/lwdgit/fis-parser-sass2/reasy/binary1/',
  'https://git.oschina.net/lwdos/reasy-parser-sass/raw/reasy/binary/',
  'https://github.com/sass/node-sass/releases/download/v3.3.2/'
];


var file_url = [process.platform, process.arch, process.versions.modules].join('-') /*win32-ia32-11*/ + '_binding.node';
var vendorDir = 'node-sass/vendor/' + [process.platform, process.arch, process.versions.modules].join('-');
var file_path = './' + vendorDir + '/binding.node';


var timeoutTick = null;
var timeoutErr = function(timeout, callback) {
    timeoutTick = clearTimeout(timeoutTick);
    if (timeout === 0)return;

    timeoutTick = setTimeout(function() {
        if (callback) callback.call(this);
        else testDownload();
    }, timeout || 10000);
}

var downloadFile = function(file_url, file_path) {
    var file_name = url.parse(file_url).pathname.split('/').pop();
    var file = fs.createWriteStream(file_path);
    

    console.trace('start downloading ' + file_url);
    
    timeoutErr(10000, function() {
        console.log('connect ' + file_url + ' error!');
        testDownload();
    });
    
    https.get(file_url, function(res) {  
        var len = parseInt(res.headers['content-length'], 10);
        var body = '';
        var cur = 0;
        var info = '';
        //var obj = document.getElementById('js-progress');
        var total = len / 1048576; //1048576  bytes in 1Megabyte
        res.on('data', function(chunk) {
            timeoutErr(10000, function() {
                console.log('connect ' + file_url + ' error!');
                testDownload();
            });

            body += chunk;
            cur += chunk.length;
            if (total) {
                info = '  Downloading ' + (100.0 * cur / len).toFixed(2) + '% ' + (cur / 1048576).toFixed(2) + ' Mb/' + 'Total size: ' + total.toFixed(2) + ' Mb';
            } else {
                info = '  Downloading ' + (cur / 1048576).toFixed(2) + ' Mb';
            }

            process.stdout.clearLine(); // clear current text
            process.stdout.cursorTo(0);
            process.stdout.write(info);
            file.write(chunk);
            
            
        }).on('end', function() {
            file.end();
            if (file._writableState.length > 1000) {//如果文件大小大于10000
                console.log('\r\n' + file_name + ' downloaded success!');
                fs.unlinkSync(file_path + '.downloading');
                timeoutErr(0);
            } else if (file.{
                testDownload();
            }
            
        }).on('error', function(e) {
            console.log(e);
            testDownload();
        });
    });
};



function createDir(dir, callback) {
    dir = path.resolve(dir);
    var originDir = dir;
    try {
        if (!path.isAbsolute(dir)) {
            dir = path.join(process.cwd(), dir);
        }
        if (fs.existsSync(dir)) return;

        while (!fs.existsSync(dir + '/..')) { //检查父目录是否存在
            dir += '/..';
        }

        while (originDir.length <= dir.length) { //如果目录循环创建完毕，则跳出循环
            fs.mkdirSync(dir, '0777');
            dir = dir.substring(0, dir.length - 3);
        }

        if (callback) callback();
    } catch (e) {
        console.log(e);
    }
}


var downloadIndex = 0;
function testDownload() {
    var url = host[downloadIndex++];
    if (url) {
        fs.writeFile(file_path + '.downloading', '');
        downloadFile(url + file_url, file_path);
    } else {
        //fs.unlink(file_path);
        //throw new Error('download node-sass binary error');
    }
}


if (!fs.existsSync(file_path) || fs.existsSync(file_path + '.downloading')) {
    createDir(vendorDir);
    testDownload();
} else {
    console.log(file_path + ' already exists!');
}




