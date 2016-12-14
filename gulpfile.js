(function(){
    'use strict';

    var gulp                = require('gulp'),
        babelify            = require('babelify'),
        browserify          = require('browserify'),
        vinylSourceStream   = require('vinyl-source-stream'),
        vinylBuffer         = require('vinyl-buffer'),
        sass                = require('gulp-sass'),
        nodemon             = require('gulp-nodemon'),
        watch               = require('gulp-watch'),
        jshint              = require('gulp-jshint'),
        livereload          = require('gulp-livereload'),
        _paths              = ['app/**/*.js'],
        plugins             = require('gulp-load-plugins')();

    var src = {
        html: 'public/views/*.html',
        //libs: 'src/libs/**',
        sass: 'public/scss/styles.scss',
        scripts: {
            all: 'public/js/**/*.js',
            app: 'public/js/angular.app.js'
        }
    };

    var build = 'public/build/',
        out = {
            libs: build + 'libs/',
        	scripts: {
        		file: 'app.min.js',
        		folder: build
        	}
        }

    gulp.task('sass', function() {
        return gulp.src(src.sass)
                   .pipe(sass())
                   .pipe(gulp.dest('./public/build/'));
    });

    //register nodemon task
    gulp.task('nodemon', function(){
        nodemon({
            script: 'server.js',
            env: {
                'NODE_ENV': 'development'
            }
        })
        .on('restart');
        var sources = browserify({
            entries: src.scripts.app,
            debug: true // Build source maps
        })
        .transform(babelify.configure({
            // You can configure babel here!
            // https://babeljs.io/docs/usage/options/
            presets: ["es2015"]
        }));

        return sources.bundle()
            .pipe(vinylSourceStream(out.scripts.file))
            .pipe(vinylBuffer())
            .pipe(plugins.sourcemaps.init({
                loadMaps: true // Load the sourcemaps browserify already generated
            }))
            .pipe(plugins.ngAnnotate())
            //.pipe(uglify({ mangle: false }))
            .pipe(plugins.sourcemaps.write('./', {
                includeContent: true
            }))
            .pipe(gulp.dest(out.scripts.folder))
    });

    gulp.task('watch', function() {
        gulp.watch(src.sass, ['sass']);
    	gulp.watch(src.scripts.all, ['lint', 'script']);

        console.log("gulp-watch detected: files changed")
    });



    //lint js files
    gulp.task('lint', function(){
        gulp.src(_paths)
            .pipe(jshint())
    		.pipe(plugins.jshint({
    			esnext: true // Enable ES6 support
    		}))
    		.pipe(plugins.jshint.reporter('jshint-stylish'));
    });

    gulp.task('script', function(){
        var sources = browserify({
    		entries: src.scripts.app,
    		debug: true // Build source maps
    	})
    	.transform(babelify.configure({
    		// You can configure babel here!
    		// https://babeljs.io/docs/usage/options/
    		presets: ["es2015"]
    	}));

        return sources.bundle()
    		.pipe(vinylSourceStream(out.scripts.file))
    		.pipe(vinylBuffer())
    		.pipe(plugins.sourcemaps.init({
    			loadMaps: true // Load the sourcemaps browserify already generated
    		}))
    		.pipe(plugins.ngAnnotate())
    		//.pipe(uglify({ mangle: false }))
    		.pipe(plugins.sourcemaps.write('./', {
    			includeContent: true
    		}))
    		.pipe(gulp.dest(out.scripts.folder))
    });

    //The default task (called when you run gulp from cli)
    gulp.task('start', ['lint', 'script', 'sass', 'watch', 'nodemon']);
}());
