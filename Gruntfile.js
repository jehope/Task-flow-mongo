/* jslint node : true */
'use strict';

var DEBUG_PORT = 8000;

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app        : 'app',
        dist       : 'dist'
    };

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yeoman: yeomanConfig,

/***********
 *  Watch  *
 ***********/

        watch: {
            options: {
                nospawn    : true,
                livereload : true
            },
            data: {
                files: ['<%= yeoman.app %>/data/{,*/}*.{json,txt,csv}']
            },
            html: {
                files: ['<%= yeoman.app %>/{,*/}*.html']
            },
            js: {
                files: ['{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js'],
                tasks: ['browserify:debug']
            },
            server : {
                files: ['server/{,*/}*.js'],
                tasks: ['develop']
            },
            img: {
                files: ['<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}']
            },
            modules: {
                files: ['<%= yeoman.app %>/views/{,*/}*.{hbs,js,scss,json,html}',
                        '<%= yeoman.app %>/models/{,*/}*.{js,json}'],
                tasks: ['compass:server', 'browserify:debug']
            },
            compass: {
                files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}',
                        '<%= yeoman.app %>/views/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            }
        },

/************************
 *  Development Server  *
 ************************/

        develop: {
            dev: {
                file     : 'server/server.js',
                nodeArgs : ['--debug'],
                env      : { NODE_ENV: 'development'}
            },
            dist: {
                file : 'server/server.js',
                env  : { NODE_ENV: 'production'}
            }
        },

/***********************
 *  Browser Launching  *
 ***********************/

        open: {
            server: {
                path: 'http://localhost:' + DEBUG_PORT
            }
        },

/**********************
 *  File Maintenance  *
 **********************/

        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*'
                    ]
                }]
            },
            server: '.tmp',
            deploy: '<%= yeoman.app %>'
        },

        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.app %>',
                    dest: '<%= yeoman.dist %>',
                    src: [
                        '*.*',
                        'images/{,*/}*.{webp,gif}',
                        'styles/fonts/*'
                    ]
                },
                {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/images',
                    src: [
                        'generated/*'
                    ]
                }]
            }
        },

/******************
 *  Test & Debug  *
 ******************/

        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/{,*/}*.js',
                '!<%= yeoman.app %>/scripts/vendor/*',
                'test/spec/{,*/}*.js'
            ]
        },
        mocha: {
            all: {
                options: {
                    run: true,
                    urls: ['http://localhost:<%= connect.options.port %>']
                }
            }
        },

/***********************
 *  Style Precompiler  *
 ***********************/

        compass: {
            options: {
                require                 : 'sass-globbing',
                sassDir                 : '<%= yeoman.app %>/styles',
                cssDir                  : '.tmp/styles',
                generatedImagesDir      : '.tmp/images/generated',
                imagesDir               : '<%= yeoman.app %>/images',
                javascriptsDir          : '<%= yeoman.app %>/scripts',
                fontsDir                : '<%= yeoman.app %>/styles/fonts',
                httpImagesPath          : '/images',
                httpGeneratedImagesPath : '/images/generated',
                relativeAssets          : false
            },
            dist: {},
            server: {
                options: {
                    debugInfo: true
                }
            }
        },

/***************************
 *  Dependency Management  *
 ***************************/

        browserify: {
            options : {
                transform : ['hbsfy'],
                aliasMappings: [
                    {
                        cwd     : '<%= yeoman.app %>/views',
                        src     : ['**/*.js'],
                        dest    : 'views',
                        flatten : true
                    }
                ]
            },
            dist: {
                src  : ['<%= yeoman.app %>/scripts/main.js'],
                dest : '<%= yeoman.dist %>/scripts/index.js'
            },
            debug: {
                src     : ['<%= yeoman.app %>/scripts/main.js'],
                dest    : './.tmp/index.js',
                options : {
                    debug : true
                }
            }
        },

/***********************
 *  Manifest Appcache  *
 ***********************/

        manifest: {
            options : {
                verbose      : false,
                timestamp    : true
            },
            dist: {
                options: {
                    basePath : '<%= yeoman.dist %>'
                },
                src: [
                    '*.html',
                    'styles/*.css',
                    'scripts/{,*/}*.js'
                ],
                dest: '<%= yeoman.dist %>/manifest.appcache'
            }
        },

/****************
 *  Versioning  *
 ****************/

        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/{,*/}*.js',
                        '<%= yeoman.dist %>/styles/{,*/}*.css',
                        '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },

        bump: {
            options: {
                files              : ['package.json', '<%= yeoman.app %>/version.json'],
                updateConfigs      : [],
                commit             : true,
                commitMessage      : 'Release v%VERSION%',
                commitFiles        : ['-a'],
                createTag          : true,
                tagName            : 'v%VERSION%',
                tagMessage         : 'Version %VERSION%',
                push               : true,
                pushTo             : '<%= pkg.repository.url %>',
                gitDescribeOptions : '--tags --always --abbrev=1 --dirty=-d'
            }
        },

/******************
 *  Minification  *
 ******************/

        uglify: {
            dist: {
                files: {
                    'dist/scripts/index.js' : 'dist/scripts/index.js'
                }
            }
        },
        useminPrepare: {
            options: {
                dest: '<%= yeoman.dist %>'
            },
            html: '<%= yeoman.app %>/index.html'
        },
        usemin: {
            options: {
                dirs: ['<%= yeoman.dist %>']
            },
            html: ['<%= yeoman.dist %>/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/styles/{,*/}*.css']
        },
        imagemin: {
            dist: {
                files: [{
                    expand : true,
                    cwd    : '<%= yeoman.app %>',
                    src    : ['images/{,*/}*.{png,jpg,jpeg}', 'data/{,*/}*.{png,jpg,jpeg}'],
                    dest   : '<%= yeoman.dist %>'
                }]
            }
        },
        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: 'images/{,*/}*.svg',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },
        cssmin: {
            dist: {
                files: {
                    '<%= yeoman.dist %>/styles/main.css': [
                        '.tmp/styles/{,*/}*.css',
                        '<%= yeoman.app %>/styles/{,*/}*.css'
                    ]
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    /*removeCommentsFromCDATA: true,
                    // https://github.com/yeoman/grunt-usemin/issues/44
                    //collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    useShortDoctype: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true*/
                },
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.app %>',
                    src: '*.html',
                    dest: '<%= yeoman.dist %>'
                }]
            }
        },

/***********************
 *  Build Environment  *
 ***********************/

        concurrent: {
            server: [
                'compass:server'
            ],
            test: [
                'compass'
            ],
            dist: [
                'compass:dist',
                'imagemin',
                'svgmin',
                'htmlmin'
            ]
        },
        env : {
            dev : {
                TASK_PATH : 'http://localhost:8000'
            },
            build : {
                TASK_PATH : 'http://test-mongodb-3357-staging.herokuapp.com'
            }
        },
        notify : {
            deploy: {
                options: {
                    title: 'Deployment Complete',
                    message: 'Your app was successfully deployed'
                }
            }
        },
        preprocess : {
            options : {
                context : {
                    DIST : true
                }
            },
            html : {
                src : 'app/index.html',
                dest : 'dist/index.html'
            }
        },
        shell : {
            options: {
                stdout: true,
                failOnError : true,
                stderr : true
            },
            develop : {
                command : 'foreman start --procfile Procfile_dev'
            },
            herokuDeploy : {
                command : function (target) {
                    return 'git push ' + target + ' master';
                }
            }
        }
    });

/*****************
 *  Grunt Tasks  *
 *****************/

    grunt.registerTask('server', function (target) {

        target = target === 'dist' ? 'dist' : 'dev';

        grunt.task.run([
            'jshint',
            'clean:server',
            'browserify:debug',
            'concurrent:server',
            'develop:' + target,
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('foreman', function (port) {

        // Subtract 100 because of the way foreman assigns consecutive processes
        // port values in increments of 100. As long as the 'grunt' process comes immediately
        // after the 'web' process, this should work...
        port = Number(port) - 100 || DEBUG_PORT;
        grunt.config('open.server.path', 'http://localhost:' + port);

        grunt.task.run([
            'jshint',
            'clean:server',
            'browserify:debug',
            'concurrent:server',
            'open',
            'watch'
        ]);
    });

    grunt.registerTask('dev', ['shell:develop']);

    // grunt.registerTask('test', [
    //     'jshint',
    //     'clean:server',
    //     'concurrent:test',
    //     'connect:test',
    //     'mocha'
    // ]);

    grunt.registerTask('build', [
        'jshint',
        'clean:dist',
        'useminPrepare',
        'concurrent:dist',
        'browserify:dist',
        'copy:dist',
        'preprocess',
        'cssmin',
        'uglify',
        'usemin',
        'manifest:dist'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);

    grunt.registerTask('release', [
        'build',
        'bump'
    ]);

    grunt.registerTask('deploy', function (target) {
        target = target || 'staging';

        grunt.task.run([
            'shell:herokuDeploy:' + target,
            'notify:deploy'
        ]);
    });

    grunt.registerTask('heroku', [
        'build',
        'clean:deploy'
    ]);
};
