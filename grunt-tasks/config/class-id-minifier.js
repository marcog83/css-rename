/**
 * Created by mgobbi on 14/10/2015.
 */

module.exports={

    sample: {
        options: {
            jsMapFile: 'sample/minified/map.js',
            jsMapDevFile: 'sample/map.js',
            jsWrapper:"cssr.CLASSES_MAP={{code}};"
        },
        files: [
            {
                expand: true,
                cwd: 'sample',
                src: '*.{html,css}',
                dest: 'sample/minified'
            }
        ]
    }
};