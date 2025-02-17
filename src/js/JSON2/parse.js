goog.provide( 'JSON2.parse' );

goog.require( 'JSON2.DEFINE.USE_REVIVER' );
goog.require( 'core.all' );

/**
 * @private
 * @enum {number} */
var EnumPhase = {
    START_TO_PARSE          : 0,
    END_TO_PARSE            : 1,
    IN_STRING_VALUE         : 2,
    IN_NUMERIC_VALUE        : 3,
    
    ENTER_OBJECT            : 4,
    BEFORE_OBJECT_KEY       : 5,
    ENTER_OBJECT_KEY        : 6,
    BEFORE_OBJECT_CORON     : 7,
    BEFORE_OBJECT_VALUE     : 8,
    AFTER_OBJECT_VALUE      : 9,
    IN_OBJECT_STRING_VALUE  : 10,
    IN_OBJECT_NUMERIC_VALUE : 11,
    
    ENTER_ARRAY             : 12,
    BEFORE_ARRAY_VALUE      : 13,
    AFTER_ARRAY_VALUE       : 14,
    IN_ARRAY_STRING_VALUE   : 15,
    IN_ARRAY_NUMERIC_VALUE  : 16,
    
    LEAVE_OBJECT            : 17,
    LEAVE_ARRAY             : 18,
    PARSE_ERROR             : 19
};

/**
 * @private
 * @const {!Array.<!Object.<string, number>>} */
var PARSING_RULES = [
    /* 0 : START_TO_PARSE */ {
        '{' : EnumPhase.ENTER_OBJECT,
        '[' : EnumPhase.ENTER_ARRAY,
        '"' : EnumPhase.IN_STRING_VALUE,
        valueIsBooleanOrNull : EnumPhase.END_TO_PARSE,
        valueIsNumeric       : EnumPhase.IN_NUMERIC_VALUE
    },
    /* 1 : END_TO_PARSE */ {},
    /* 2 : IN_STRING_VALUE */ {
        '"' : EnumPhase.END_TO_PARSE
    },
    /* 3 : IN_NUMERIC_VALUE */ {},

    /* 4 : ENTER_OBJECT */ {
        '"' : EnumPhase.ENTER_OBJECT_KEY, // key の開始
        '}' : EnumPhase.LEAVE_OBJECT  // 即終わり(Empty Object)
    },
    /* 5 : BEFORE_OBJECT_KEY */ {
        '"' : EnumPhase.ENTER_OBJECT_KEY // key の開始
    },
    /* 6 : ENTER_OBJECT_KEY */ {
        '"' : EnumPhase.BEFORE_OBJECT_CORON // key の終わり
    },
    /* 7 : BEFORE_OBJECT_CORON */ {
        ':' : EnumPhase.BEFORE_OBJECT_VALUE // これ以外は error
    },
    /* 8 : BEFORE_OBJECT_VALUE */ {
        '{' : EnumPhase.ENTER_OBJECT,
        '[' : EnumPhase.ENTER_ARRAY,
        '"' : EnumPhase.IN_OBJECT_STRING_VALUE,
        valueIsBooleanOrNull : EnumPhase.AFTER_OBJECT_VALUE,
        valueIsNumeric       : EnumPhase.IN_OBJECT_NUMERIC_VALUE
        // true, false, null -> 6, 数値 -> 8
    },
    /* 9 : AFTER_OBJECT_VALUE */ {
        ',' : EnumPhase.BEFORE_OBJECT_KEY,
        '}' : EnumPhase.LEAVE_OBJECT
    },
    /* 10 : IN_OBJECT_STRING_VALUE */ {
        '"' : EnumPhase.AFTER_OBJECT_VALUE // 値の終わり
    },
    /* 11 : IN_OBJECT_NUMERIC_VALUE */ {
        ',' : EnumPhase.BEFORE_OBJECT_KEY,
        '}' : EnumPhase.LEAVE_OBJECT
    },

    /* 12 : ENTER_ARRAY */ {
        '{'  : EnumPhase.ENTER_OBJECT,
        '['  : EnumPhase.ENTER_ARRAY,
        '"'  : EnumPhase.IN_ARRAY_STRING_VALUE,
        ']'  : EnumPhase.LEAVE_ARRAY, // 即終わり(Empty Array)
        valueIsBooleanOrNull : EnumPhase.AFTER_ARRAY_VALUE,
        valueIsNumeric       : EnumPhase.IN_ARRAY_NUMERIC_VALUE
    },
    /* 13 : BEFORE_ARRAY_VALUE */ {
        '{' : EnumPhase.ENTER_OBJECT,
        '[' : EnumPhase.ENTER_ARRAY,
        '"' : EnumPhase.IN_ARRAY_STRING_VALUE,
        valueIsBooleanOrNull : EnumPhase.AFTER_ARRAY_VALUE,
        valueIsNumeric       : EnumPhase.IN_ARRAY_NUMERIC_VALUE
    },
    /* 14 : AFTER_ARRAY_VALUE */ {
        ',' : EnumPhase.BEFORE_ARRAY_VALUE,
        ']' : EnumPhase.LEAVE_ARRAY
    },
    /* 15 : IN_ARRAY_STRING_VALUE */ {
        '"' : EnumPhase.AFTER_ARRAY_VALUE
    },
    /* 16 : IN_ARRAY_NUMERIC_VALUE */ {
        ',' : EnumPhase.BEFORE_ARRAY_VALUE,
        ']' : EnumPhase.LEAVE_ARRAY
    }
];

/**
 *  The parse method takes a text and an optional reviver function, and returns
 *  a JavaScript value if the text is a valid JSON text.
 *
 *  If parse error, return `undefined`. 
 * @param {string} text 
 * @param {!Function=} opt_reviver 
 * @return {*} */
JSON2.parse = function( text, opt_reviver ){
    /**
     * 
     * @param {!Function} reviver 
     * @param {!Object | !Array} holder 
     * @param {string|number} key 
     * @return {*} */
    function walk( reviver, holder, key ){
        // The walk method is used to recursively walk the resulting structure so
        // that modifications can be made.

        var value = holder[ key ], i, l, v, k;

        if( core.isArray( value ) ){
            value = /** @type {!Array} */ (value);
            for( i = 0, l = value.length; i < l; ++i ){
                v = walk( reviver, value, i );
                if( v !== undefined ){
                    value[ i ] = v;
                } else {
                    delete value[ i ];
                };
            };
        } else if( core.isObject( value ) ){
            for( k in value ){
                //if( Object.prototype.hasOwnProperty.call( value, k ) ){
                    v = walk( reviver, /** @type {!Object} */ (value), k );
                    if( v !== undefined ){
                        value[ k ] = v;
                    } else {
                        delete value[ k ];
                    };
                //}
            };
        };
        return reviver.apply( holder, [ key, value ] );
    };

    /**
     * @param {string} text 
     * @return {boolean} */
    function validateJSONString( text ){
        function isNumericChar( chr ){
            return [ true, true, true, true, true, true, true, true, true, true ][ chr ];
        };

        function isValidNumericExpression( flag ){
            return flag === 0 || ( flag & 5 ) !== 1 && ( flag & 10 ) !== 2;
        };

        /** @const */
        var meta = { // table of character substitutions
                ' '  : true,
                '\b' : true,
                '\t' : true,
                '\n' : true,
                // '\f' : '\\f',
                '\r' : true,
                // '"'  : true,
                '\\' : true
            };
        var hierarchy = /** @const {!Array.<boolean>} */ ([]);
        var phase = EnumPhase.START_TO_PARSE,
            i = 0, l = text.length;
        var inArray = false, escape = false, whiteSpaceAfterNumber;
        var chr, chr1, chr2, str;
        var rule;
        var flag;
        
        for( ; i < l; ++i ){
            chr2 = chr1;
            chr1 = chr;
            chr = text.charAt( i );

            if( !meta[ chr ] || escape && chr === '\\' ){
                if( chr.charCodeAt( 0 ) < 32 ){
                    return false;
                };
                rule = PARSING_RULES[ phase ];

                switch( phase ){
                    case EnumPhase.END_TO_PARSE        : 
                    case EnumPhase.ENTER_OBJECT        : // object に入った
                    case EnumPhase.BEFORE_OBJECT_KEY   : // object の key の開始
                    case EnumPhase.BEFORE_OBJECT_CORON : // object の key に続く : を待つ
                    case EnumPhase.AFTER_OBJECT_VALUE  : // object の 値の終わり
                    case EnumPhase.AFTER_ARRAY_VALUE   : // Array の値の終わり
                        phase = rule[ chr ] || EnumPhase.PARSE_ERROR;
                        break;
                    case EnumPhase.IN_STRING_VALUE        :
                    case EnumPhase.IN_OBJECT_STRING_VALUE : // object のメンバーの文字列の終わり " を待つ
                    case EnumPhase.IN_ARRAY_STRING_VALUE  : // Array メンバーの文字列値の終わり
                    case EnumPhase.ENTER_OBJECT_KEY       : // object の key 名
                        if( isNumericChar( chr ) ){
                            if( escape ){
                                return false; // \の後
                            };
                            if( chr2 === '\\' && chr1 === 'x' ){
                                return false; // \x の後
                            };
                        };
                        phase = !escape && rule[ chr ] || phase;
                        break;
                    case EnumPhase.START_TO_PARSE      : // 全ての開始
                    case EnumPhase.BEFORE_OBJECT_VALUE : // object の値の開始
                    case EnumPhase.ENTER_ARRAY         :
                    case EnumPhase.BEFORE_ARRAY_VALUE  : // Array の値の開始
                        phase = EnumPhase.PARSE_ERROR;
                        if( rule[ chr ] ){
                            phase = rule[ chr ];
                        } else if( isNumericChar( chr ) ){
                            phase = rule.valueIsNumeric;
                            whiteSpaceAfterNumber = false;
                            flag = chr === '0' ? 16 : 0; 
                        } else if( chr === '-' ){
                            phase = rule.valueIsNumeric;
                            whiteSpaceAfterNumber = false;
                            flag = 32; 
                        } else {
                            str = text.substr( i, 4 );
                            if( str === 'true' || str === 'null' ){
                                i += 3;
                                phase = rule.valueIsBooleanOrNull;
                            };
                            if( text.substr( i, 5 ) === 'false' ){
                                i += 4;
                                phase = rule.valueIsBooleanOrNull;
                            };
                        };
                        break;
                    case EnumPhase.IN_NUMERIC_VALUE        :
                    case EnumPhase.IN_OBJECT_NUMERIC_VALUE : // object のメンバーの数値の終わりを待つ
                    case EnumPhase.IN_ARRAY_NUMERIC_VALUE  : // Array メンバーの数値の終わり
                        if( !whiteSpaceAfterNumber ){
                            if( isNumericChar( chr ) ){
                                if( flag &  1 ) flag |= 4; // . のあとに一つ以上の数字が来た。
                                if( flag &  2 ) flag |= 8; // e- のあとに一つ以上の数字が来た。
                                if( flag & 16 ) return false; // 0 のあとに数字が続いた。
                                if( flag & 32 ){ // -0 と数字が続いた。
                                    flag -= chr === '0' ? 16 : 32; // 32 を落して, 16 を立てる
                                };
                                break;
                            } else if( chr === '.' ){
                                if( flag &  3 ) return false; // . が二つ以上、e+ の後に . は error
                                if( flag & 16 ) flag -= 16; // 0. まで解析した
                                flag |= 1;
                                break;
                            } else if( chr === 'e' || chr === 'E' ){
                                if( flag & 16 ) flag -= 16; // 0e まで解析した
                                if( ( flag & 2 ) === 0 ){
                                    str = text.substr( i, 2 );
                                    if( str === chr + '+' || str === chr + '-' ){
                                        ++i;
                                    };
                                    flag |= 2;
                                    break;
                                };
                            };
                        };
                         // ., e+ に続く数字がない
                        phase = isValidNumericExpression( flag ) && rule[ chr ] || EnumPhase.PARSE_ERROR;
                        break;
                };
                switch( phase ){
                    case EnumPhase.ENTER_OBJECT :
                    case EnumPhase.ENTER_ARRAY  :
                        hierarchy.push( inArray );
                        inArray = phase === EnumPhase.ENTER_ARRAY;
                        break;
                    case EnumPhase.LEAVE_OBJECT :
                    case EnumPhase.LEAVE_ARRAY  :
                        if( 1 < hierarchy.length ){
                            inArray = hierarchy.pop();
                            phase = inArray ? EnumPhase.AFTER_ARRAY_VALUE : EnumPhase.AFTER_OBJECT_VALUE;
                        } else {
                            phase = EnumPhase.END_TO_PARSE;
                        };
                        break;
                    case EnumPhase.PARSE_ERROR :
                        // console.log( 'ERROR---', '"' + chr + '"', phase, rule, isValidNumericExpression( flag ), flag );
                        return false;
                };
                escape = false;
            } else {
                escape = chr === '\\';
                if( phase === EnumPhase.IN_NUMERIC_VALUE || phase === EnumPhase.IN_ARRAY_NUMERIC_VALUE || phase === EnumPhase.IN_OBJECT_NUMERIC_VALUE ){ // number の間に挿入された空白文字は error
                    whiteSpaceAfterNumber = true;
                } else if( phase === EnumPhase.IN_STRING_VALUE || phase === EnumPhase.IN_ARRAY_STRING_VALUE || phase === EnumPhase.IN_OBJECT_STRING_VALUE || phase === EnumPhase.ENTER_OBJECT_KEY ){ // string の間に挿入された制御文字は error
                    if( chr.charCodeAt( 0 ) < 32 ){
                        return false;
                    };
                };
            };
            // console.log( i, chr, phase );
        };

        return phase === EnumPhase.END_TO_PARSE || ( phase === EnumPhase.IN_NUMERIC_VALUE && isValidNumericExpression( flag ) );
    };

    var i = 0, l, chr, code, ret = [], n = -1, j;

    text += '';

    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.

    // cx =  /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    // TODO 多分この stage は不要
    for( l = text.length; i < l; ++i ){
        chr  = text.charAt( i );
        code = chr.charCodeAt( 0 );

        if(
            /* code === 0 || */ code === 173 || // 
            ( 1535 < code && code < 1541 ) ||
            1807 === code ||
            6068 === code || 6069 === code ||
            ( 8203 < code && code < 8208 ) ||
            ( 8231 < code && code < 8240 ) || // u2028 - u202f
            ( 8287 < code && code < 8304 ) || // u2060 - u206f
            65279 === code ||
            ( 65520 <= code && code <= 65535 ) // ufff0 - uffff
        ){
            chr = '\\u' + ( '0000' + code.toString( 16 ) ).slice( -4 );
        };

        ret[ ++n ] = chr;
    };
    
    text = ret.join( '' );

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.

    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

    //if (/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

    if( validateJSONString( text ) ){

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.

        j = eval( '(' + text + ')' );

        // In the optional fourth stage, we recursively walk the new structure, passing
        // each name/value pair to a reviver function for possible transformation.

        // { '' : value }, Empty string object literal key has problem in Opera 7.x!

        if( JSON2.DEFINE.USE_REVIVER ){
            return core.isFunction( opt_reviver ) ? walk( /** @type {!Function} */ (opt_reviver), { '_' : j }, '_' ) : j;
        } else {
            return j;
        };
    };

    // If the text is not JSON parseable, then a SyntaxError is thrown.

    // throw new SyntaxError('JSON.parse');
};
