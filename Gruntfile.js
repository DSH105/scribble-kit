var config = {
    app: 'app',
    dist: 'dist',
    dev: 'dev',
    styles: 'styles',
    scripts: 'scripts',
    grunt_tasks: 'grunt-tasks'
};

module.exports = function(grunt) {
    grunt.option('config', config);

    grunt.initConfig({
        config: config,

        pkg: grunt.file.readJSON('./package.json'),

        bower: grunt.file.readJSON('./.bowerrc'),

        banner: '/* <%= pkg.name %> - v<%= pkg.version %>' +
        '\n' +
        ' * <%= pkg.description %>' +
        '\n * \n' +
            ' * Copyright (c) <%= pkg.author %> <%= grunt.template.today("yyyy") %>' +
        '\n * \n' +
        ' * <%= pkg.description %>' +
        '\n */\n',

        watch: {
            styles: {
                files: [
                    '**/*.sass',
                    '**/*.scss'
                ],
                tasks: ['sass']
            },
            dist: {
                files: [
                    '<%= config.app %>/**/*.html',
                    '<%= config.app %>/**/*.js',
                    '<%= config.app %>/**/vendor/components/*'
                ],
                tasks: ['dev']
            },
            bower: {
                files: [
                    '<%= bower.directory %>/**/*'
                ],
                tasks: ['bower']
            }
        },

        sass: {
            dist: {
                options: {
                    sourcemap: 'none',
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/<%= config.styles %>/sass',
                    src: [
                        '**/*.sass',
                        '**/*.scss'
                    ],
                    dest: '<%= config.app %>/<%= config.styles %>/css',
                    ext: '.css'
                }]
            }
        },

        clean: {
            dist: {
                src: ['<%= config.dist %>']
            },
            bower: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: [
                        '**/vendor/components/*',
                        '<%= config.styles %>/fonts'
                    ]
                }]
            }
        },

        concat: {
            scripts: {
                src: ['<%= config.app %>/<%= config.scripts %>/**/*.js', '!<%= config.app %>/<%= config.scripts %>/vendor/**/*.js'],
                dest: '<%= config.dist %>/<%= config.scripts %>/<%= pkg.name %>.js'
            },
            styles: {
                src: ['<%= config.app %>/<%= config.styles %>/css/**/*.css', '!<%= config.app %>/<%= config.styles %>/css/vendor/**/*.css'],
                dest: '<%= config.dist %>/<%= config.styles %>/css/<%= pkg.name %>.css'
            }
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= config.app %>',
                        src: [
                            '**/*.html',
                            '**/*.txt',
                            '<%= config.scripts %>/vendor/**/*.js',
                            '!<%= config.scripts %>/vendor/components/**/*.js',
                            '<%= config.styles %>/css/vendor/**/*.css',
                            '!<%= config.styles %>/css/vendor/components/**/*.css'
                        ],
                        dest: '<%= config.dist %>'
                    }
                ]
            },

            bower: {
                files: [
                    // scripts
                    {
                        expand: true,
                        cwd: '<%= bower.directory %>',
                        src: [
                            'jquery/dist/jquery.js'
                        ],
                        dest: '<%= config.app %>/<%= config.scripts %>/vendor/components'
                    }
                ]
            }
        },

        uglify: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>/<%= config.scripts %>',
                    src: ['**/*.js', '!**/*.min.js'],
                    dest: '<%= config.dist %>/<%= config.scripts %>',
                    ext: '.min.js'
                }]
            }
        },

        cssmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.dist %>/<%= config.styles %>/css',
                    src: ['**/*.css', '!**/*.min.css'],
                    dest: '<%= config.dist %>/<%= config.styles %>/css',
                    ext: '.min.css'
                }]
            }
        },

        usebanner: {
            dist: {
                options: {
                    position: 'top',
                    banner: '<%= banner %>'
                },
                files: [{
                    expand: true,
                    cwd: 'dist',
                    src: [
                        '**/*.css',
                        '**/*.js',
                        '!**/vendor/**/*.js',
                        '!**/vendor/**/*.css'
                    ]
                }]

            }
        },

        useminPrepare: {
            dist: {
                files: [{html: '<%= config.dist %>/**/*.html'}],
                options: {
                    dest: '<%= config.dist %>'
                }
            }
        },

        usemin: {
            dist: {
                files: [{html: '<%= config.dist %>/**/*.html'}]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-banner');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.loadTasks('./grunt-tasks');

    grunt.registerTask('bower', ['clean:bower', 'copy:bower']);

    grunt.registerTask('env', ['bower', 'watch']);

    grunt.registerTask('prepare-dist', [
        // clean the directory
        'clean:dist',

        // copy over bower components
        //'bower',

        // concatenate all project files and bower components
        'concat-components',

        // copy anything else over
        'copy:dist'
    ]);

    grunt.registerTask('dev', [
        'prepare-dist'
    ]);

    grunt.registerTask('prod', [
        'prepare-dist',

        'useminPrepare',

        // prepare for distribution
        'uglify',
        'cssmin',
        'usebanner',

        // ensure all 'prod' variables are prepared for distribution
        'usemin'
    ]);

};