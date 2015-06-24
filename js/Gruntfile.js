module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        concat: {
            dist: {
                src: [
                    'extjs/adapter/ext/ext-base.js',
                    'extjs/ext-all.js',
                    'extjs/src/locale/ext-lang-ru.js',
                    'app/init/*.js',
                    'app/form/*.js',
                    'app/panel/*.js',
                    'app/button/*.js',
                    'app/grid/*.js',
                    'app/app.js'
                ],
                dest: 'build/<%= pkg.name %>.js'
            }
        },

        uglify: {
            dist: {
                files: {
                    'build/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>']
                }
            }
        },

        watch: {
            files: [
                'app/**/*.js'
            ],
            tasks: [ 'concat' ],
            options: {
                spawn: false
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify']);
};
