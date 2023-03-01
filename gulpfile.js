const gulp            = require('gulp'),
      ClosureCompiler = require('google-closure-compiler').gulp(),
      externsJs       = './src/js-externs/externs.js';

/* -------------------------------------------------------
 *  gulp dist
 */
gulp.task('dist', gulp.series(
    function(){
        return gulp.src( './src/js/json2.js' )
            .pipe(
                ClosureCompiler(
                    {
                        // env               : 'CUSTOM',
                        externs           : [ externsJs ],
                        define            : [
                            'DEFINE_ES2_JSON__ENABLE_ALL_FURTURES=true'
                        ],
                        compilation_level : 'ADVANCED',
                        //compilation_level : 'WHITESPACE_ONLY',
                        formatting        : 'PRETTY_PRINT',
                        warning_level     : 'VERBOSE',
                        language_in       : 'ECMASCRIPT3',
                        language_out      : 'ECMASCRIPT3',
                        output_wrapper    : 'JSON=null;\n' +
                                            '%output%' +
                                            ';module.exports=JSON;',
                        js_output_file    : 'index.js'
                    }
                )
            ).pipe(gulp.dest( './dist' ));
    }
));