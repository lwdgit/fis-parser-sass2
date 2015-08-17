var fs = require('fs');
var url = require('url');
var https = require('https');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

// App variables
//var file_url = 'http://upload.wikimedia.org/wikipedia/commons/4/4f/Big%26Small_edit_1.jpg';
var file_url = 'https://raw.githubusercontent.com/lwdgit/fis-parser-sass2/master/binary/' + [process.platform, process.arch, process.versions.modules].join('-')/*win32-ia32-11*/ + '_binding.node';
var DOWNLOAD_DIR = 'vendor';

// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
var mkdir = 'mkdir ' + DOWNLOAD_DIR;
var child = exec(mkdir, function(err, stdout, stderr) {
    if (err) throw err;
    else download_file_httpget(file_url);
});


// Function to download file using HTTP.get
var download_file_httpget = function(file_url) {


    var file_name = url.parse(file_url).pathname.split('/').pop();
    var file = fs.createWriteStream('./vendor/' + file_name);

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
            info = 'Downloading ' + (100.0 * cur / len).toFixed(2) + '% ' + (cur / 1048576).toFixed(2) + ' mb\\' + 'Total size: ' + total.toFixed(2) + ' mb';

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
/*
http.get(options, function(res) {
    res.on('data', function(data) {
            file.write(data);
        }).on('end', function() {
            file.end();
            console.log(file_name + ' downloaded to ');
        });
    });
};*/

