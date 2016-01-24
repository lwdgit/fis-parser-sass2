var fs = require('fs');
var url = require('url');
var path = require('path');
var https = require('https');

var libSassVer = 'v3.4.2';//set libssass version

var downloadPath = {
	oschina: 'https://git.oschina.net/lwdos/node-sass-installer/raw/master/binary/',
    github: 'https://raw.githubusercontent.com/lwdgit/node-sass-installer/master/binary/',
	origin: 'https://github.com/sass/node-sass/releases/download/'
};

var file_url = [process.platform, process.arch, process.versions.modules].join('-') + '_binding.node';
var vendorDir = 'node-sass/vendor/' + [process.platform, process.arch, process.versions.modules].join('-');
var file_path = './' + vendorDir + '/binding.node';



var downloadFile = function(file_url, file_path) {
    var file_name = url.parse(file_url).pathname.split('/').pop();
    var file = fs.createWriteStream(file_path);

    console.log('start downloading ' + file_url);
    https.get(file_url, function(res) {
        var len = parseInt(res.headers['content-length'], 10);
        var body = '';
        var cur = 0;
        var info = '';

        var total = len / 1048576; //1048576 bytes in 1Megabyte
		if (total && total < 0.3) {//mirror file server not exist this file
			console.log('Mirror file not exists! Auto change mirror to retry!!!');
			testDownload();
			return;
		}
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
			if (cur < 1000000) {
				console.log('\r\nYour network may has some problem!!!');
			} else {
            	console.log('\r\n' + file_name + ' downloaded success!');
			}
        }).on('error', function(e) {
            console.log(e.stack || e);
			testDownload();
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

function testDownload() {
	var isEmpty = true;
	for(var path in downloadPath) {
		var p = downloadPath[path];
		delete downloadPath[path];
		downloadFile(p + file_url, file_path);
		isEmpty = false;
		break;	
	}
	if (isEmpty) {
		console.log('Download binding.node error!');
	}
}
testDownload();
