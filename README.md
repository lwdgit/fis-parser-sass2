# reasy-parser-sass ![NPM version](https://badge.fury.io/js/reasy-parser-sass.png)

[![NPM Download](https://nodei.co/npm-dl/reasy-parser-sass.png?months=1)](https://www.npmjs.org/package/reasy-parser-sass)

A parser plugin for reasy to compile sass file.

（基于node-sass的fis插件，支持expanded,及预定义变量。本插件基于fis官方插件修改，不过依赖库由```fis-sass```更改为```node-sass```）

## install

    $ npm install -g reasy-parser-sass


```javascript
//reasy-conf.js
fis.match('**.scss', {
    parser: fis.plugin('sass', {
        define: {
            'enable': true,
            '$bgcolor': '#d8222d',
            'color': 'black'
        }
    }),
    rExt: 'css'
})
```

```scss
//example a.scss
@if ($enable) {
    body {
        background: $bgcolor;
        color: $color;
    }
}
```



    $ reasy release -d ./output

