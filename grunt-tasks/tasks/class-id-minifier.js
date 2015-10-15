/*
 * class-id-minifier
 * https://github.com/yiminghe/grunt-class-id-minifier
 *
 * Copyright (c) 2013 yiminghe
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  var defaultEncoding = 'utf-8';

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  var classIdMinifier = require('class-id-minifier');

  function endsWith(str, suffix) {
    var ind = str.length - suffix.length;
    return ind >= 0 && str.indexOf(suffix, ind) == ind;
  }

  grunt.registerMultiTask('class-id-minifier', 'minify class and id from html', function () {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options();

    var classIdMap = {};

    var moduleName = options.moduleName;
    var jsWrapper = options.jsWrapper;
    var encoding = options.encoding || defaultEncoding;

    var css = [];

    // Iterate over all specified file groups.
    this.files.forEach(function (f) {
      var src = f.src[0];
      var dest = f.dest;

      var srcContent = grunt.file.read(src, {
        encoding: encoding
      });
      if (endsWith(src, '.css')) {
        css.push({
          content: srcContent,
          dest: dest
        });
        return;
      }
      var transformContent = classIdMinifier.minify(srcContent, classIdMap, options.minifyFilter);
      grunt.file.write(dest, transformContent.html, {
        encoding: encoding
      });
    });

    css.forEach(function (c) {
      grunt.file.write(c.dest, classIdMinifier.getCssCode(classIdMap, c.content), {
        encoding: encoding
      });
    });

    grunt.file.write(options.jsMapFile,
      classIdMinifier.getJsCode(classIdMap, moduleName, options.jsMapFilter,jsWrapper), {
        encoding: encoding
      });

    grunt.file.write(options.jsMapDevFile,
      classIdMinifier.getDevJsCode(classIdMap, moduleName,jsWrapper), {
        encoding: encoding
      });
  });

};
