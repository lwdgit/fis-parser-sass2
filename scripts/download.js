var fs = require('fs');
var url = require('url');
var https = require('https');

var oschina = 'https://git.oschina.net/lwdos/reasy-parser-sass/raw/reasy/binary/';
var github = 'https://raw.githubusercontent.com/lwdgit/fis-parser-sass2/master/binary/';

var file_url = oschina + [process.platform, process.arch, process.versions.modules].join('-')/*win32-ia32-11*/ + '_binding.node';
var vendorDir = 'node-sass/vendor/' + [process.platform, process.arch, process.versions.modules].join('-');
var file_path = './' + vendorDir + '/binding.node';



var downloadFile = function(file_url, file_path) {
    var file_name = url.parse(file_url).pathname.split('/').pop();
    var file = fs.createWriteStream(file_path);

    https.get(file_url, function(res) {
        //console.log(res);
        var len = parseInt(res.headers['content-length'], 10);
        var body = '';
        var cur = 0;
        var info = '';
        //var obj = document.getElementById('js-progress');
        var total = len / 1048576; //1048576 ¡V bytes in 1Megabyte
        res.on('data', function(chunk) {
            body += chunk;
            cur += chunk.length;
            if (total) {
                info = '  Downloading ' + (100.0 * cur / len).toFixed(2) + '% ' + (cur / 1048576).toFixed(2) + ' Mb/' + 'Total size: ' + total.toFixed(2) + ' Mb';
            } else {
                info = '  Downloading ' + (cur / 1048576).toFixed(2) + ' Mb';
            }


            process.stdout.clearLine();  // clear current text
            process.stdout.cursorTo(0);
            process.stdout.write(info);
            file.write(chunk);
        }).on('end', function() {
            file.end();
            console.log('\r\n' + file_name + ' downloaded success!');
        }).on('error', function(e) {
            console.error(e);
        });
    });
};

var createDir = function(start, dir) {
    var rdir = dir.split('/');
    try {
      for (var i = 0, l = rdir.length; i < l; i++) {
        if (rdir[i]) {
          start = start + '/' + rdir[i];
          if (!fs.existsSync(start)) {
            fs.mkdirSync(start, '0777');
          }
        }
      }
      downloadFile(file_url, file_path);
    } catch (e) {
      console.log(e);
    }
};

createDir(process.cwd(), vendorDir);

