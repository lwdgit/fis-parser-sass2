# fis-parser-sass2 ![NPM version](https://badge.fury.io/js/fis-parser-sass2.png)

[![NPM Download](https://nodei.co/npm-dl/fis-parser-sass2.png?months=1)](https://www.npmjs.org/package/fis-parser-sass2)

A parser plugin for fis to compile sass file.

（基于node-sass的fis插件，支持expanded,及预定义变量。本插件基于fis官方插件修改，不过依赖库由```fis-sass```更改为```node-sass```）

## install

    $ npm install -g fis-parser-sass2

```javascript
//fis-conf.js

fis.config.set('modules.parser.scss', 'sass2');
fis.config.set('settings.parser.sass2.define', {enable: true, color: '#000'});
//you can add your settings to control the varible in the sass file
//你可以通过设置该属性来控制sass文件里的的变量

fis.config.set('settings.parser.sass2.outputStyle', 'expanded');
//the default is expanded，默认为expanded,你可以手动设置其他属性

fis.config.set('settings.parser.sass2.sourceMap', false);
//use sourcemap or not, default is true，是否启用sourceMap,默认为开启

fis.config.set('roadmap.ext.scss', 'css');

```

```javascript
//fis3-conf.js
fis.match('**.scss', {
    rExt: '.css', // from .scss to .css
    parser: fis.plugin('sass2')
});

```

    $ fis release -d ./output

