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