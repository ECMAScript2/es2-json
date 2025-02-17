goog.provide( 'JSON2.stringify' );

goog.require( 'JSON2.DEFINE.USE_REPLACER' );
goog.require( 'JSON2.DEFINE.USE_SPACE' );
goog.require( 'core.all' );

/**
 *  The stringify method takes a value and an optional replacer, and an optional
 *  space parameter, and returns a JSON text. The replacer can be a function
 *  that can replace values, or an array of strings that will select the keys.
 *  A default replacer method can be provided. Use of the space parameter can
 *  produce text that is more easily readable.
 * 
 *  If opt_replacer is invalid, return `undefined`. 
 * @param {*} value 
 * @param {!Function|!Array=} opt_replacer 
 * @param {number|string=} opt_space 
 * @return {string|undefined} 
 */
JSON2.stringify = function( value, opt_replacer, opt_space ){
    /**
     * 
     * @param {*} value 
     * @return {boolean}
     */
    function isArray( value ){
        return value.pop === [].pop;
    };
    function toXX( n ){
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    };
    function toXXX( n ){
        n = '00' + n;
        return n.substr( n.length - 3 );
    };
    function toXXXX( n ){
        n = '000' + n;
        return n.substr( n.length - 4 );
    };
    function toXXXXXX( n ){
        n = '00000' + n;
        return n.substr( n.length - 6 );
    };
    /**
     * 
     * @param {string} str 
     * @return {string} 
     */
    function wrapQuoteAndEscape( str ){
        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.
        var meta = { // table of character substitutions
            // ' '  : ' ',
            '\b' : '\\b',
            '\t' : '\\t',
            '\n' : '\\n',
            '\f' : '\\f',
            '\r' : '\\r',
            '"'  : '\\"',
            '\\' : '\\\\'
        }, i = 0, l = str.length, chr, code, ret = [ '"' ], n = 0;

        for( ; i < l; ++i ){
            chr = str.charAt( i );
            // escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
            if( meta[ chr ] ){
                chr = meta[ chr ];
            } else {
                code = chr.charCodeAt( 0 );
                if (
                    code === 92 || code === 34 || //chr === '\\' || chr === '"' ||
                    code < 31 || ( 126 < code && code < 160 ) ||
                    173 === code ||
                    ( 1535 < code && code < 1541 ) ||
                    6068 === code || 6069 === code ||
                    ( 8203 < code && code < 8208 ) ||
                    ( 8231 < code && code < 8240 ) || // u2028 - u202f
                    ( 8287 < code && code < 8304 ) || // u2060 - u206f
                    65279 === code ||
                    ( 65519 < code && code < 65536 ) // ufff0 - uffff
                ){
                    // chr = '\\u' + ( '0000' + code.toString( 16 ) ).slice( -4 ); // Needs patch!
                    chr = '0000' + code.toString( 16 );
                    chr = '\\u' + chr.substr( chr.length - 4 );
                };
            };
            ret[ ++n ] = chr;
        };
        return ret.join( '' ) + '"';
    };
    /**
     * 
     * @param {string|number} key 
     * @param {!Object|!Array} holder
     * @param {!Function|!Array=} opt_replacer 
     * @param {string=} opt_mind 
     * @param {string=} opt_indent 
     * @return {string|undefined} 
     */
    function toString( key, holder, opt_replacer, opt_mind, opt_indent ){
        // Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            l, gap = opt_mind,
            partial, n = -1,
            value = holder[ key ],
            year, indexOfObjectList;

        // null or 0 or NaN or undefined
        if( value === 0 ) return '0';
        if( value === '' ) return '""';
        if( value == null ) return 'null';

        // If the value has a toJSON method, call it to obtain a replacement value.

        if( typeof value === 'object' ){
            switch( value.constructor ){
                case Date :
                    year = value.getUTCFullYear();

                    return _isFinite( + value ) ? // <= value.valueOf()
                            '"' + (
                                year <= 0 || 1e4 <= year
                                    ? ( year < 0 ? '-' : '+' ) + toXXXXXX( year < 0 ? -year : year )
                                    : toXXXX( year )
                            ) + '-' +
                            toXX( value.getUTCMonth() + 1 ) + '-' +
                            toXX( value.getUTCDate()      ) + 'T' +
                            toXX( value.getUTCHours()     ) + ':' +
                            toXX( value.getUTCMinutes()   ) + ':' +
                            toXX( value.getUTCSeconds()   ) + '.' +
                            toXXX( value.getUTCMilliseconds() ) + 'Z"' : 'null';
                case String :
                    return wrapQuoteAndEscape( '' + value );
                case Number :
                    return _isFinite( value ) ? '' + value : 'null';
                case Boolean :
                    return '' + value;
            };
        };

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if( JSON2.DEFINE.USE_REPLACER ){
            if( typeof opt_replacer === 'function' ){
                value = opt_replacer.apply( holder, [ key, value ] );
            };
        };

        // What happens next depends on the value's type.
        switch( typeof value ){
            case 'string':
                return wrapQuoteAndEscape( value );

            // JSON numbers must be finite. Encode non-finite numbers as null.
            case 'number':
                return _isFinite( value ) ? '' + value : 'null';

            // If the value is a boolean or null, convert it to a string. Note:
            // typeof null does not produce 'null'. The case is included here in
            // the remote chance that this gets fixed someday.
            case 'boolean':
            // case 'null':
                return '' + value;

            // If the type is 'object', we might be dealing with an object or an array or
            // null.
            case 'object':
                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.
                if( JSON2.DEFINE.USE_REPLACER ){
                    if( !value ) return 'null';
                };

                if( objectList.indexOf( value ) === -1 ){
                    objectList.push( value );
                    indexOfObjectList = objectList.length;
                } else {
                    isNestingError = true;
                    return;
                };

                // Make an array to hold the partial results of stringifying this object value.

                gap += opt_indent;
                partial = [];

                // Is the value an array?

                if( isArray( value ) ){
                    value = /** @type {!Array} */ (value);
                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.
                    for( i = 0, l = value.length; i < l; ++i ){
                        if( JSON2.DEFINE.USE_REPLACER ){
                            partial[ i ] = toString( i, value, opt_replacer, /** @type {string} */ (gap), /** @type {string} */ (opt_indent) ) || 'null';
                        } else {
                            partial[ i ] = toString( i, value ) || 'null';
                        };
                        if( isNestingError ){
                            return;
                        };
                        objectList.length = indexOfObjectList;
                    };

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.
                    return l === 0 ?
                            '[]' :
                        JSON2.DEFINE.USE_REPLACER && gap ?
                            '[\n' + gap + partial.join( ',\n' + gap ) + '\n' + opt_mind + ']' :
                            '[' + partial.join( ',' ) + ']';
                };
                value = /** @type {!Object} */ (value);

                // If the replacer is an array, use it to select the members to be stringified.

                if( JSON2.DEFINE.USE_REPLACER && opt_replacer && isArray( opt_replacer ) ){
                    for( i = 0, l = opt_replacer.length; i < l; ++i ){
                        k = opt_replacer[ i ];
                        if( typeof k === 'string' ){
                            v = toString( k, value, opt_replacer, /** @type {string} */ (gap), /** @type {string} */ (opt_indent) );
                            if( isNestingError ){
                                return;
                            };
                            objectList.length = indexOfObjectList;
                            if( v ){
                                partial[ ++n ] = wrapQuoteAndEscape( k ) + ( gap ? ': ' : ':' ) + v;
                            };
                        };
                    };
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for( k in value ){
                        //if( Object.prototype.hasOwnProperty.call( value, k ) ){
                            if( JSON2.DEFINE.USE_REPLACER ){
                                v = toString( k, value, opt_replacer, /** @type {string} */ (gap), /** @type {string} */ (opt_indent) );
                            } else {
                                v = toString( k, value );
                            };
                            if( isNestingError ){
                                return;
                            };
                            objectList.length = indexOfObjectList;
                            if( v ){
                                partial[ ++n ] = wrapQuoteAndEscape( k ) + ( JSON2.DEFINE.USE_REPLACER && gap ? ': ' : ':' ) + v;
                            };
                        //};
                    };
                };

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                return n < 0 ?
                        '{}' :
                    JSON2.DEFINE.USE_REPLACER && gap ?
                        '{\n' + gap + partial.join( ',\n' + gap ) + '\n' + opt_mind + '}' :
                        '{' + partial.join( ',' ) + '}';
        };
    };

    var _isFinite = isFinite, i, indent = '', objectList = [], isNestingError = false;

    // If the space parameter is a number, make an indent string containing that
    // many spaces.

    if( JSON2.DEFINE.USE_REPLACER ){
        if( typeof opt_space === 'number' ){
            for( i = 0; i < opt_space; ++i ){
                indent += ' ';
            };

            // If the space parameter is a string, it will be used as the indent string.
        } else if( typeof opt_space === 'string' ){
            indent = opt_space;
        };

        // If there is a replacer, it must be a function or an array.
        // Otherwise, throw an error.
        if( opt_replacer && typeof opt_replacer !== 'function' && !isArray( opt_replacer ) ){
            //throw new Error('JSON.stringify');
            return;
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.

        // { '' : value }, Empty string object literal key has problem in Opera 7.x!

        return toString( '_', { '_' : value }, opt_replacer, '', indent );
    } else {
        return toString( '_', { '_' : value } );
    };
};
