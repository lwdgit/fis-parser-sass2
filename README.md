# fis-parser-sass2
A parser plugin for fis to compile sass file.

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
    $ fis release -d ./output

