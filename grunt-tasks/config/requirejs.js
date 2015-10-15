/**
 * Created by marco on 10/01/2015.
 */
var cjsRequireRegExp = /(var\s+)*([^'"\s]*\s*=)*[^.\w]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)[^.\w]/g;
var returnRegExp = /module.exports.*[^]*/;
module.exports = {
    compile: {
        options: {
            dir: 'build',
            appDir: '.',
            baseUrl: 'src',
            optimize: 'none',
            optimizeCss: 'none',
            useStrict: true,
            paths: {

                lodash: "empty:",



                'js-init': '../tmp/js-init'
            },
            modules: [{
                'name': 'js-build',
                'include': ['js-init'],
                'create': true
            }],
            fileExclusionRegExp: /^(.git|node_modules|bower_components|grunt-tasks|dist|test|sample)$/,
            wrap: {
                startFile: "src/intro.js",
                endFile: "src/outro.js"
            },
            onBuildWrite: function (id, path, contents) {
                if ((/define\(.*?\{/).test(contents)) {
                    //Remove AMD ceremony for use without require.js or almond.js
                    contents = contents.replace(/define\(.*?\{/, '');

                    contents = contents.replace(/\}\);\s*?$/, '');
                    //remove cjs style
                    contents = contents.replace(cjsRequireRegExp, "");

                    //remove last return statement and trailing })
                    contents = contents.replace(/return.*[^return]*$/, '');
                    contents = contents.replace(returnRegExp, '');
                }
                else if ((/require\([^\{]*?\{/).test(contents)) {
                    contents = contents.replace(/require[^\{]+\{/, '');
                    contents = contents.replace(/\}\);\s*$/, '');
                }

                return contents;
            }
        }
    }
};