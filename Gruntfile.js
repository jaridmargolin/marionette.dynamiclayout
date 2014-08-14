/*!
 * Gruntfile.js
 * 
 * Copyright (c) 2014
 */


// ----------------------------------------------------------------------------
// GRUNT
// ----------------------------------------------------------------------------

module.exports = function (grunt) {


// Load all grunt tasks
require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);


// Browsers
var browsers = [
  // Latest Versions
  { browserName: 'firefox', platform: 'WIN8' },
  { browserName: 'chrome', platform: 'WIN8' },
  // { browserName: 'opera', platform: 'WIN7' },

  // Internet Explorer
  { browserName: 'internet explorer', platform: 'WIN8', version: '10' },
  { browserName: 'internet explorer', platform: 'VISTA', version: '9' },
  { browserName: 'internet explorer', platform: 'XP', version: '8' }
];


// Config
grunt.initConfig({

  // --------------------------------------------------------------------------
  // PKG CONFIG
  // --------------------------------------------------------------------------

  'pkg': grunt.file.readJSON('package.json'),


  // --------------------------------------------------------------------------
  // JSHINT
  // --------------------------------------------------------------------------

  'jshint': {
    src: [
      'Gruntfile.js',
      'src/**/*.js',
      'test_*/**/*.js'
    ],
    options: {
      jshintrc: '.jshintrc',
      force: true
    }
  },


  // --------------------------------------------------------------------------
  // CLEAN (EMPTY DIRECTORIES)
  // --------------------------------------------------------------------------

  'clean': {
    js: ['dist/js'],
    build: ['dist/*.*']
  },


  // --------------------------------------------------------------------------
  // CREATE COMMONJS VERSION IN DIST
  // --------------------------------------------------------------------------

  'nodefy': {
    all: {
      expand: true,
      src: ['**/*.js'],
      cwd: 'src/',
      dest: 'dist/common'
    }
  },


  // --------------------------------------------------------------------------
  // Copy Parts
  // --------------------------------------------------------------------------

  'copy': {
    js: {
      expand: true,
      src: ['**/*.js'],
      cwd: 'src',
      dest: 'dist/amd'
    }
  },


  // --------------------------------------------------------------------------
  // WATCH FILES
  // --------------------------------------------------------------------------

  'watch': {
    options: {
      spawn: true
    },
    grunt: {
      files: ['Gruntfile.js'],
      tasks: ['build'],
      options: { livereload: true }
    },
    tests: {
      files: ['test_*/**/*.*'],
      options: { livereload: true }
    },
    js: {
      files: ['src/**/*.js'],
      tasks: ['build:js'],
      options: { livereload: true }
    }
  },


  // --------------------------------------------------------------------------
  // SERVER
  // --------------------------------------------------------------------------

  'connect': {
    server: {
      options: { base: '', port: 9999 }
    },
  },


  // --------------------------------------------------------------------------
  // TEST PLATFORM (SAUCELABS) - PUBLIC
  // --------------------------------------------------------------------------

  'saucelabs-mocha': {
    all: {
      options: {
        urls: ['http://127.0.0.1:9999/test/_runner.html'],
        build: process.env.TRAVIS_JOB_ID || '<%= pkg.version %>',
        tunnelTimeout: 5,
        concurrency: 3,
        browsers: browsers,
        testname: 'marionette.dynamiclayout'
      }
    }
  },


  // --------------------------------------------------------------------------
  // TEST LOCAL - PUBLIC
  // --------------------------------------------------------------------------

  'mocha_phantomjs': {
    all: ['test/_runner.html']
  }

});


// DEFAULT
grunt.registerTask('default', ['build']);

// BUILD
grunt.registerTask('build', ['build:js']);
grunt.registerTask('build:js', ['clean:js', 'jshint', 'copy:js']);

// TEST
grunt.registerTask('test', ['test-local']);
grunt.registerTask('test-local', ['build', 'mocha_phantomjs']);
grunt.registerTask('test-sauce', ['build', 'connect', 'saucelabs-mocha']);

// DEVELOP
grunt.registerTask('dev', ['build', 'connect', 'watch']);


};