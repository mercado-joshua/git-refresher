/**
 * npm init -y
 * 
 * npm i -D gulp gulp-cli sass gulp-sass gulp-autoprefixer gulp-clean-css gulp-terser browser-sync bootstrap jquery @fortawesome/fontawesome-free gulp-babel babel-preset-env babel-core @babel/core @babel/preset-env babel-polyfill
 */
/**
 * import the required plugins
 */


/**
 * SASS and CSS plugins
 */

/// enables sass
const sass = require( "gulp-sass" )( require( "sass" ) );

// add vendor prefixes to new css properties
const prefix = require( "gulp-autoprefixer" );

// minifies css stylesheets
const minify = require( "gulp-clean-css" );


/**
 * JS plugins
 */

// converts your ES6 js code into ES5
const babel = require( "gulp-babel" );

// minifies js scripts
const terser = require( "gulp-terser" );


/**
 * utilities plugins
 */

// enables gulp functionalities
const gulp = require( "gulp" );

// deals with browser reloading
const browserSync = require( "browser-sync" ).create();



/**
 * paths and configuration setup
 */

const paths = {
    jquery: "./node_modules/jquery/dist/jquery.min.js",
    polyfill: "./node_modules/babel-polyfill/dist/polyfill.min.js",
    bootstrap: {
        sass: "./node_modules/bootstrap/scss/bootstrap.scss",
        js: "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
    },
    fontawesome: {
        sass: "./node_modules/@fortawesome/fontawesome-free/scss/fontawesome.scss",
        js: "./node_modules/@fortawesome/fontawesome-free/js/all.min.js"
    },
    fonts: {
        source: "./src/fonts/**/**.*",
        destination: "./dist/fonts"
    },

    images: {
        source: "./src/images/**/**.*",
        destination: "./dist/images"
    },
    html: {
        source: "./src/*.html",
        destination: "./dist"
    },
    sass: {
        source: "./src/sass/**/*.scss",
        destination: "./dist/css"
    },
    css: {
        source: "./dist/css/**/*.css",
        destination: "./dist/css"
    },
    js: {
        source: "./src/js/**/*.js",
        destination: "./dist/js"
    },
    jsMinify: {
        source: "./dist/js/**/*.js",
        destination: "./dist/js"
    }
};

// create list of stylesheets
const listOfStyles = [ 
    paths.bootstrap.sass, 
    paths.fontawesome.sass, 
    paths.sass.source 
];

// create list of js scripts
const listOfJSVendor = [
    paths.bootstrap.js, 
    paths.fontawesome.js, 
    paths.jquery, 
    paths.polyfill
];

// configuration for browsers
const config = {
    browserList: {
        overrideBrowserslist: [
        "> 1%",
        "ie >= 8",
        "edge >= 15",
        "ie_mob >= 10",
        "ff >= 45",
        "chrome >= 45",
        "safari >= 7",
        "opera >= 23",
        "ios >= 7",
        "android >= 4",
        "bb >= 10"
    ]},
    babel: {
        presets: [ "@babel/preset-env" ]
    },
    browserSync: {
        server: {
            baseDir: "./dist",
            notify: false,
            open: false
        }        
    }
};

// configuration for sourcemaps
const sourcemap = {
    css: {
        enable: true,
        path: "./sourcemaps"
    },
    js: {
        enable: true,
        path: "./sourcemaps"
    }
};



/**
 * tasks for code development
 */

/** [1] compiles bootstrap and custom sass to css */
gulp.task( "build:sass", function() {
    return gulp.src( listOfStyles )
        .pipe( sass().on( "error", sass.logError ))
        .pipe( prefix( config.browserList ))
        .pipe( gulp.dest( paths.sass.destination ));
});

/** [2] compiles js vendors */
gulp.task( "build:vendor", function() {
    return gulp.src( listOfJSVendor )
        .pipe( gulp.dest( paths.js.destination ));
});

/** [3] transforms custom js into ES5 */
gulp.task( "build:js", function() {
    return gulp.src( paths.js.source )
       .pipe( babel({ presets: [ "@babel/preset-env" ] }))
       .pipe( gulp.dest( paths.js.destination ) );
});

/** [4] copies html from .src to .dist */
gulp.task( "build:html", function() {
    return gulp.src( paths.html.source )
        .pipe( gulp.dest( paths.html.destination ));
});

/** [4.1] copies html from .src to .dist */
gulp.task( "build:images", function() {
    return gulp.src( paths.images.source )
        .pipe( gulp.dest( paths.images.destination ));
});

/** [4.2] copies html from .src to .dist */
gulp.task( "build:fonts", function() {
    return gulp.src( paths.fonts.source )
        .pipe( gulp.dest( paths.fonts.destination ));
});

/** [5] starts live serve */
gulp.task( "build:serve", function( cb ) {
    browserSync.init( config.browserSync );
    cb();
});

/** [6] reloads the webpage */
gulp.task( "build:reload", function( cb ) {
    browserSync.reload();
    cb();
});

/** [7] watch task for ./src files */
gulp.task( "build:watch", function() {
    gulp.watch(
        [ paths.images.source, paths.fonts.source, paths.html.source, paths.sass.source, paths.js.source ],
        gulp.series([ "build:images", "build:fonts", "build:html", "build:sass", "build:js", "build:reload" ])
    );
});



/**
 * tasks for code deployment
 */

/** [1] minifies css and generate a sourcemap */
gulp.task( "prod:css", function() {
    return gulp.src( listOfStyles, { sourcemaps: sourcemap.css.enable })
        .pipe( sass().on( "error", sass.logError ))
        .pipe( prefix( config.browserList ))
        .pipe( minify() )
        .pipe( gulp.dest( paths.css.destination, { sourcemaps: sourcemap.css.path }));
});

/** [2] minifies js and generate a sourcemap */
gulp.task( "prod:js", function() {
    return gulp.src( paths.jsMinify.source, { sourcemaps: sourcemap.js.enable })
        .pipe( terser() )
        .pipe( gulp.dest( paths.jsMinify.destination, { sourcemaps: sourcemap.js.path }));
});



/**
 * console gulp commands
 */

/**
 * REMINDER!
 *     Add this script to the "package.json" file before
 *     using below commands:
 * 
       "scripts": {
            "gulp": "gulp",
            "prod": "gulp prod"
       }
 */

/** [1] run "npm run gulp" on terminal: when developing a site */
gulp.task( "default", gulp.parallel( 
    "build:sass", "build:vendor", "build:js", "build:images", 
    "build:fonts", "build:html", "build:serve", "build:watch"
));

/** [2] run "gulp prod" on terminal: when deploying the site */
gulp.task( "prod", gulp.parallel(
    "prod:css", "prod:js"
));

