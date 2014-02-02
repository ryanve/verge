module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // gruntjs.com/configuring-tasks#globbing-patterns
      // **/** matches in current and sub dirs
      all: ['./'], // current dir and sub dirs
      sub: ['*/'], // sub dirs
      dir: ['*.js'], // current dir
      src: ['src/'],
      test: ['test/'],
      grunt: ['GruntFile.js'],
      build: ['<%= pkg.name %>.js'],
      options: {
        ignores: ['**/**/node_modules/', '**/**/vendor/', '**/**.min.js'],
        debug:true, expr:true, sub:true, boss:true, supernew:true, node:true, 
        undef:true, unused:true, devel:true, evil:true, laxcomma:true, eqnull:true, 
        browser:true, globals:{ender:true}, jquery:true, maxerr:10
      }
    },
    concat: {
      options: {
        banner: [
          '/*!',
          ' * <%= pkg.name %> <%= pkg.version %>+<%= grunt.template.today("UTC:yyyymmddHHMM") %>',
          ' * <%= pkg.homepage %>',
          ' * MIT License 2013 <%= pkg.author %>',
          ' */\n\n'
        ].join('\n')
      },
      build: {
        files: {
          '<%= pkg.name %>.js': ['src/<%= pkg.name %>.js']
        }
      }
    },
    uglify: {
      options: {
        report: 'gzip',
        preserveComments: 'some'
      },
      build: {
        files: {
          '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.registerTask('default', ['jshint:grunt', 'jshint:sub', 'concat', 'jshint:build', 'uglify']);
};