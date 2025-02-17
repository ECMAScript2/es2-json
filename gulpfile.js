const gulp            = require('gulp'),
      ClosureCompiler = require('google-closure-compiler').gulp();

/* -------------------------------------------------------
 *  gulp dist
 */
gulp.task('dist', gulp.series(
    function(){
        return gulp.src(
                [ './src/closure-primitives/base.js', './.submodules/es2-core/src/js/**/*.js', './src/js/**/*.js' ]
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
                        output_wrapper    : '(function(Function, Array, Date, isFinite){\n' +
                                            '%output%\n' +
                                            '})(Function, Array, Date, isFinite);\n'
                    }
                )
            ).pipe(
                ClosureCompiler(
                    {
                        //compilation_level : 'WHITESPACE_ONLY',
                        formatting        : 'PRETTY_PRINT',
                        warning_level     : 'VERBOSE',
                        language_in       : 'ECMASCRIPT3',
                        language_out      : 'ECMASCRIPT3',
                        output_wrapper    : 'JSON=null;\n' +
                                            '%output%\n' +
                                            ';module.exports=JSON;',
                        js_output_file    : 'index.js'
                    }
                )
            ).pipe(
                gulp.dest( './dist' )
            );
    }
));