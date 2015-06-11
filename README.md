# fis-parser-nsass
A parser plugin for fis to compile sass file.

## install

    $ npm install -g fis-parser-nsass

```javascript
//fis-conf.js

fis.config.set('modules.parser.scss', 'sass2');
fis.config.set('settings.parser.sass2.define', {enable: true, color: '#000'});//you can add your settings
fis.config.set('settings.parser.sass2.outputStyle', 'expanded');//the default is expanded
fis.config.set('settings.parser.sass2.sourceMap', false);//use sourcemap or not, default is true
fis.config.set('roadmap.ext.scss', 'css');

```
    $ fis release -d ./output

