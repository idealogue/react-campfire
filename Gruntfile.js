/*
 * Assemble, component generator for Grunt.js
 * https://github.com/assemble/
 *
 * Copyright (c) 2013 Upstage
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),
 
    // Night gathers, and now my grunt watch begins...
    watch: {

      options: {
        livereload: true,
      },

      html: { 
        // watch the handlebars files for HTML changes
        files: 'project/**/*.{html,hbs,json}',
        tasks: ['clean:html', 'assemble:dev', 'assemble:production']
      },

      jsx: {
        // copy and concat js files
        options: { event: 'changed' },
        files: '_admin/jsx/**/*.jsx',
        tasks: ['react']
      },

      js: {
        // copy and concat js files
        options: { event: 'changed' },
        files: 'assets/js/**/*.js',
        tasks: ['concat:js', 'copy:js']
      },

      new_js: {
        // copy, concat and run assemble when js files are added
        options: { event: ['added', 'deleted'] },
        files: 'assets/js/**/*.js',
        tasks: ['concat:js', 'copy:js','clean:html', 'assemble:dev', 'assemble:production']
      },

      css: {
        // compile sass
        files: 'assets/sass/**/*',
        tasks: ['compass:dev', 'copy:css']
      },

      assets: {
        // copy all the asset files that are left
        files: ['assets/**/*', '!assets/sass/**/*', '!assets/js/**/*'],
        tasks: ['copy:assets', 'copy:production_assets']
      }
    },
 
  // --------------------------------------------------------------------------------- \\

    compass: {
      dev: {
        options: {
          sassDir: 'assets/sass',
          cssDir: 'public/dev/assets/css'
        }
      }
    },

  // --------------------------------------------------------------------------------- \\

    concat: {
      js: {
        src: ["assets/js/libs/*.js", "assets/js/*.js"],
        dest: "public/production/assets/js/app.js"
      },
    },

  // --------------------------------------------------------------------------------- \\

    copy: {
      js: {
        files: [
          {
            expand: true, 
            flatten: true, 
            cwd: 'assets/js/',
            src: ['**'], 
            dest: 'public/dev/assets/js/', 
            filter: 'isFile'
          }
        ]
      },
      assets: {
        files: [
          {
            expand: true, 
            cwd: 'assets/', 
            src: ['**', '!sass/**/*', '!js/**/*'], 
            dest: 'public/dev/assets/', 
            filter: 'isFile'
          }
        ]
      },
      production_assets: {
        files: [
        {
            expand: true, 
            cwd: 'public/dev/assets/', 
            src: ['**', '!css/**/*', '!js/**/*'], 
            dest: 'public/production/assets/', 
            filter: 'isFile'
          }
        ]
      },
      css: {
        files: [
          {
            expand: true, 
            cwd: 'public/dev/assets/css', 
            src: ['**'], 
            dest: 'public/production/assets/css/', 
            filter: 'isFile'
          }
        ]
      }
    },

  // --------------------------------------------------------------------------------- \\

    assemble: {
      
      options: {
        helpers: '_admin/helpers/helper-*.js',
        data: 'project/data/**/*.{json,yml}',
        production: false
      },

      dev: {
        // Assemble project HTML files
        options: {
          flatten: false,
          partials: 'project/partials/**/*.hbs',
          layout: 'project/_layouts/project-default.hbs',
          helpers: '_admin/helpers/helper-*.js'
        },

        files: [
          { expand: true, 
            cwd: 'project/pages', 
            src: '**/*.hbs', 
            dest: 'public/dev/' 
          },
        ]
      },
      
      production: {
        // Assemble project HTML files
        options: {
          flatten: false,
          partials: 'project/partials/**/*.hbs',
          layout: 'project/_layouts/project-default.hbs',
          helpers: '_admin/helpers/helper-*.js',
          production: true
        },

        files: [
          { expand: true, 
            cwd: 'project/pages', 
            src: '**/*.hbs', 
            dest: 'public/production/' 
          },
        ]
      }
    },
 
  // --------------------------------------------------------------------------------- \\

    clean: {
      all: ['public/dev/', 'public/production/'],
      html: ['public/dev/**/*.html', 'public/production/**/*.html']
    },

  // --------------------------------------------------------------------------------- \\

    react: {
      single_file_output: {
        files: {
          'assets/js/app.js': '_admin/jsx/app.jsx'
        }
      },
    }

  });

  // --------------------------------------------------------------------------------- \\
  // ---------------------------------- load tasks ----------------------------------- \\
  // --------------------------------------------------------------------------------- \\

  // Load npm plugins to provide necessary tasks.
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-react');

  // Default task to be run.
  grunt.registerTask('default', ['clean:all', 'assemble', 'compass', 'react', 'concat', 'copy']);
};
