var fs = require('fs');
var url = require('url');
var path = require('path');
var https = require('https');

var oschina = 'https://git.oschina.net/lwdos/reasy-parser-sass/raw/reasy/binary/';
var github = 'https://raw.githubusercontent.com/lwdgit/fis-parser-sass2/reasy/binary/';

var file_url = [process.platform, process.arch, process.versions.modules].join('-') /*win32-ia32-11*/ + '_binding.node';
var vendorDir = 'node-sass/vendor/' + [process.platform, process.arch, process.versions.modules].join('-');
var file_path = './' + vendorDir + '/binding.node';



var downloadFile = function(file_url, file_path) {
    var file_name = url.parse(file_url).pathname.split('/').pop();
    var file = fs.createWriteStream(file_path);

    console.log('start downloading ' + file_url);
    https.get(file_url, function(res) {

        //console.log(res);
        var len = parseInt(res.headers['content-length'], 10);
        var body = '';
        var cur = 0;
        var info = '';
        if (total < 0.01) {
          throw new Error('file not exist'); 
        }
        //var obj = document.getElementById('js-progress');
        var total = len / 1048576; //1048576  bytes in 1Megabyte
        res.on('data', function(chunk) {
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
            console.log('\r\n' + file_name + ' downloaded success!');
        }).on('error', function(e) {
            throw new Error(e);
        });
    });
};

function createDir(dir, callback) {
    dir = path.resolve(dir);
    var originDir = dir;

    try {
        if (fs.existsSync(dir)) return;

        while (!fs.existsSync(path.join(dir, '/..'))) { 
            dir += '/..';
        }

        while (originDir.length <= dir.length) { 
            fs.mkdirSync(path.resolve(dir), '0777');
            dir = dir.substring(0, dir.length - 3);
        }
        if (callback) callback();
    } catch (e) {
        console.log(e);
    }
}

createDir(vendorDir);

try {
    downloadFile(oschina + file_url, file_path);
} catch (e) {
    console.log('download binding failed! change to github retry!');
    downloadFile(github + file_url, file_path);
}
