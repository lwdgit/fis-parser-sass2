# fis-parser-scss
A parser plugin for fis to compile scss file.

## install

    $ npm install -g fis-parser-scss

```javascript
//fis-conf.js

fis.config.set('modules.parser.scss', 'scss');
fis.config.set('settings.parser.scss.define', {enable: true, color: '#000'});//you can add your settings
fis.config.set('settings.parser.scss.outputStyle', 'expanded');//the default is expanded
fis.config.set('settings.parser.scss.sourceMap', false);//use sourcemap or not, default is true
fis.config.set('roadmap.ext.scss', 'css');

```
    $ fis release -d ./output

