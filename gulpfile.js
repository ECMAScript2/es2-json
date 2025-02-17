const gulp            = require('gulp'),
      ClosureCompiler = require('google-closure-compiler').gulp(),
      externsJs       = './src/js-externs/externs.js';

/* -------------------------------------------------------
 *  gulp dist
 */
gulp.task('dist', gulp.series(
    function(){
        return gulp.src(
                [ './src/closure-primitives/base.js', '../es2-core/src/js/**/*.js', './src/js/**/*.js' ]
            ).pipe(
                ClosureCompiler(
                    {
                        // env               : 'CUSTOM',
                        dependency_mode   : 'PRUNE',
                        entry_point       : 'goog:JSON2.all',
                        // externs           : [ externsJs ],
                        compilation_level : 'ADVANCED',
                        //compilation_level : 'WHITESPACE_ONLY',
                        formatting        : 'PRETTY_PRINT',
                        warning_level     : 'VERBOSE',
                        language_in       : 'ECMASCRIPT3',
                        language_out      : 'ECMASCRIPT3',
                        output_wrapper    : 'JSON=null;\n' +
                                            '(function(Function, Array, String, Number, Boolean, Date){\n' +
                                            '%output%\n' +
                                            '})(Function, Array, String, Number, Boolean, Date);\n' +
                                            ';module.exports=JSON;',
                        js_output_file    : 'index.js'
                    }
                )
            ).pipe(
                gulp.dest( './dist' )
            );
    }
));