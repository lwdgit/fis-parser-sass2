# fis-parser-nsass
A parser plugin for fis to compile sass file.

## install

    $ npm install -g fis-parser-nsass

```javascript
//fis-conf.js

fis.config.set('modules.parser.scss', 'nsass');
fis.config.set('settings.parser.nsass.define', {enable: true, color: '#000'});//you can add your settings
fis.config.set('settings.parser.nsass.outputStyle', 'expanded');//the default is expanded
fis.config.set('settings.parser.nsass.sourceMap', false);//use sourcemap or not, default is true
fis.config.set('roadmap.ext.scss', 'css');

```
    $ fis release -d ./output

