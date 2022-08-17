let mix = require('laravel-mix');

mix.js('src/js/app.js', 'js/protonGroup')
    .sass('src/scss/all.scss', 'css')
    .postCss('css/all.css', 'css/protonGroup')
    .options({
        postCss: [
            require('postcss-sort-media-queries')
        ],
        processCssUrls: false
    })
    .browserSync({
        proxy: 'http://proton.local',
        files: "css/protonGroup/all.css, js/app.js, index.html"
    });

