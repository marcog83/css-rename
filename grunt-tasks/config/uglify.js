/**
 * Created by marco on 10/01/2015.
 */
module.exports={
    options: {
        compress: {
            drop_console: true
        },
        sourceMap: true,
        stripbanners: true,
        banner: '<%= banner.compact %>',
        mangle: {
            except: ['cssr']
        }
    },
    dist: {
        src: ['dist/css-rename.js'],
        dest: 'dist/css-rename.min.js'
    }
};