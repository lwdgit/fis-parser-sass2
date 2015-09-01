# reasy-parser-sass ![NPM version](https://badge.fury.io/js/reasy-parser-sass.png)

[![NPM Download](https://nodei.co/npm-dl/reasy-parser-sass.png?months=1)](https://www.npmjs.org/package/reasy-parser-sass)

A parser plugin for reasy to compile sass file.

（基于node-sass的fis插件，支持expanded,及预定义变量。本插件基于fis官方插件修改，不过依赖库由```fis-sass```更改为```node-sass```）

## install

    $ npm install -g reasy-parser-sass


```javascript
//reasy-conf.js
reasy.match('**.scss', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('sass')
}

```

    $ reasy release -d ./output

