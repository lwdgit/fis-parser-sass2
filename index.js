/*
 * fis
 * modify by fis-parser-sass
 * https://github.com/fex-team/fis-parser-sass
 */

'use strict';


var path = require('path');
var sass = require('node-sass');
var util = require('util');
var root;

function resolve_and_load(filename, dir) {
    // Resolution order for ambiguous imports:
    // (1) filename as given
    // (2) underscore + given
    // (3) underscore + given + extension
    // (4) given + extension
    //

    var basename = path.basename(filename);
    var dirname = path.dirname(filename);
    var files = [];

    files.push(path.join(dirname, basename));
    files.push(path.join(dirname, '_' + basename));
    files.push(path.join(dirname, '_' + basename + '.scss'));
    files.push(path.join(dirname, basename + '.scss'));

    var found = null;

    files.every(function(url) {
        var file = fis.util(dir, url);

        if( file && fis.util.isFile(file)  ) {
            found = fis.file(file);
            return false;
        }

        return true;
    });

    return found;
}

function find(filename, paths) {
    var found = null;

    paths.every(function(dir) {
        var file;

        if ((file = resolve_and_load(filename, dir))) {
            found = file;
            return false;
        }

        return true;
    });

    return found;
}

function fixSourcePath(content, file) {
    // 处理，解决资源引用路径问题。
    content = fis.compile.extCss(content);

    return content.replace(fis.compile.lang.reg, function(all, type, depth, value) {

        // 判断是否为 fis2
        if (!fis.match) {
            value = depth;
        }

        var info = fis.uri(value, file.dirname);

        if (info.file && info.file.subpath) {
            value = info.quote + info.file.subpath + info.query + info.quote;
        }

        return value;
    });
}

function fixImport(content) {
    var reg = /((?:\/\/.*?\n)|(?:\/\*[\s\S]*?\*\/))|(?:@import\s([\s\S]*?)(?:\n|$)(?!\s+[^{@]*\n))/ig;

    return content.replace(reg, function(all, comments, value) {

        if (!comments && value && !/;$/.test(value)) {
            all += ';';
        }

        return all;
    });
}

function handlerDefine(conf) {
    var ret = '';
    var line = 0;//记录添加了多少行
    if (conf && typeof conf === 'object') {
        for (var c in conf) {
            if (conf.hasOwnProperty(c)) {
                var key = c.indexOf('$') !== 0 ? '$' + c : c;//如果没有加$,则自动添加
                ret += key + ': ' + conf[c] + ';\n';
                line++;
            }
        }
    }
    return {
      scss: ret,
      line: line
    }
}

module.exports = function(content, file, conf) {

    if (!content || !content.trim()) {
        return content;
    }

    content = fixImport(content);

    root = root || fis.project.getProjectPath();
    var opts = fis.util.clone(conf);

    // 读取私有配置。
    if (file.sass) {
        fis.util.map(fis.sass, opts, true);
    }

    opts.includePaths = opts.include_paths || opts.includePaths || [];
    file.dirname !== root && opts.includePaths.unshift(file.dirname);
    opts.includePaths.push(root);

    opts.includePaths = opts.includePaths.map(function( dir ) {

        if (path.resolve( dir ) != path.normalize( dir ) || fis.util.exists(path.join(root, dir))) {
            dir = path.join(root, dir);
        }

        return dir;
    });

    opts.file = file.origin;
    var scssDefine = handlerDefine(opts.define);
    opts.data = scssDefine.scss + content;

    var includePaths = opts.includePaths;
    var sources = [file.subpath];
    opts.importer = function(url, prev, done) {
        prev = prev.replace(/^\w+\:/, ''); // windows 里面莫名加个盘符。

        if (!prevFile) {
            throw new Error('Can\'t find `' + prev +'`');
        }
        var  dirname = path.dirname(prev);
        // 如果已经在里面
        var idx = stacks.indexOf(dirname);
        if (~idx) {
            stacks.splice(idx, 1);
        }
        stacks.unshift(dirname);

        var target = find(url, stacks.concat(includePaths, path.join(root, dirname)));

        if (!target) {
            throw new Error('Can\'t find `' + url +'` in `' + prev + '`');
        }

        var content = target.getContent();
        content = fixSourcePath(content, target);

        if (file.cache) {
            file.cache.addDeps(target.realpath);
        }
        //解决include_path 内import导致subpath为空报错问题
        if(!target.subpath){
            target.subpath = path.relative(root, target.realpath);
        }
        ~sources.indexOf(target.subpath) || sources.push(target.subpath);

        return {
            file: target.subpath,
            contents: content
        };
    };

    if (opts.sourceMap) {

        var mapping = fis.file.wrap(file.dirname + '/' + file.filename + file.rExt + '.map');

        mapping.useDomain = true;
        mapping.useHash = false;

        opts.sourceMap = mapping.getUrl(fis.compile.settings.hash, fis.compile.settings.domain);
        file.release && (opts.outFile = file.getUrl(fis.compile.settings.hash, fis.compile.settings.domain));
    }

    var ret;
    try {
        ret = sass.renderSync(opts);
    } catch (e) {
        fis.log.error(util.format("%s".red + " [`%s` %s:%s]".yellow, e.message, e.file, e.line - scssDefine.line, e.column));
    }


    // if (file.cache && ret.stats.includedFiles.length) {
    //     ret.stats.includedFiles.forEach(function(dep) {
    //         file.cache.addDeps(dep);
    //     });
    // }

    if (mapping) {
        var sourceMap = ret.map;

        // 修复 sourceMap 中文件路径错误问题
        // 等 node-sass 修复后，可以删除。
        // ---------------------------------------------
        var sourceMapObj = JSON.parse(sourceMap);
        sourceMapObj.sources = sources;
        sourceMap = JSON.stringify(sourceMapObj, null, 4);
        // -----------------------------------------------


        mapping.setContent(sourceMap);

        file.extras = file.extras || {};
        file.extras.derived = file.extras.derived || [];
        file.extras.derived.push(mapping);
    }

    return ret.css.toString();
};

module.exports.defaultOptions = {
    outputStyle: 'expanded',
    sourceMapContents: true,
    sourceMap: true,
    omitSourceMapUrl: false
};
