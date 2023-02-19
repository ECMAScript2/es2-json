// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

JSON = {};

( function() {
        var toString  = Object.prototype.toString,
            
            meta = {// table of character substitutions
                ' '  : ' ',
                '\b' : '\\b',
                '\t' : '\\t',
                '\n' : '\\n',
                '\f' : '\\f',
                '\r' : '\\r',
                '"' : '\\"',
                '\\' : '\\\\'
            };

        function toXX( n ){
            // Format integers to have at least two digits.
            return n < 10 ? '0' + n : n;
        };

        function wrapQuoteAndEscape(str) {

            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.

            var i = 0, l = str.length, chr, code, ret = ['"'], n = 0;

            for (; i < l; ++i) {
                chr  = str.charAt(i);
                code = chr.charCodeAt(0);
                // escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                if( meta[ chr ] ){
                    chr = meta[ chr ];
                } else
                if (
                    code === 92 || code === 34 || //chr === '\\' || chr === '"' ||
                    code < 31 || ( 127 <= code && code <= 159 ) ||
                    173 === code ||
                    (1536 <= code && code <= 1540 ) ||
                    6068 === code || 6069 === code ||
                    (8204 <= code && code <= 8207 ) ||
                    (8232 <= code && code <= 8239 ) || // u2028 - u202f
                    (8288 <= code && code <= 8303 ) || // u2060 - u206f
                    65279 === code ||
                    (65520 <= code && code <= 65535) // ufff0 - uffff
                ){
                    chr = '\\u' + ( '0000' + code.toString( 16 ) ).slice( -4 );
                };

                ret[ ++n ] = chr;
            };

            return ret.join( '' ) + '"';
        };

        function toStr( key, holder, rep, mind, indent ){

            // Produce a string from holder[key].

            var i, // The loop counter.
                k, // The member key.
                v, // The member value.
                l, gap = mind,
                partial, n = -1,
                value = holder[ key ];

            // null or 0 or NaN or undefined
            if( value === 0 ) return '0';
            if( !value ) return 'null';

            // If the value has a toJSON method, call it to obtain a replacement value.

            if( typeof value === 'object' ){
                switch( value.constructor ){
                    case Date :
                        return isFinite( value.valueOf()) ?
                                 value.getUTCFullYear() + '-' +
                                toXX( value.getUTCMonth() + 1 ) + '-' +
                                toXX( value.getUTCDate() ) + 'T' +
                                toXX( value.getUTCHours() ) + ':' +
                                toXX( value.getUTCMinutes() ) + ':' +
                                toXX( value.getUTCSeconds() ) + 'Z' : null;
                    case String :
                        return wrapQuoteAndEscape(value);
                    case Number :
                        return isFinite(value) ? '' + value : 'null';
                    case Boolean :
                        return '' + value;
                };
            };

            // If we were called with a replacer function, then call the replacer to
            // obtain a replacement value.

            if ( typeof rep === 'function') {
                value = rep.call(holder, key, value);
            }

            // What happens next depends on the value's type.
            switch( typeof value ) {

                case 'string':
                    return wrapQuoteAndEscape(value);
    
                // JSON numbers must be finite. Encode non-finite numbers as null.
                case 'number':
                    return isFinite(value) ? '' + value : 'null';
    
                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.
                case 'boolean':
                case 'null':
                    return '' + value;
    
                // If the type is 'object', we might be dealing with an object or an array or
                // null.
                case 'object':
    
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
    
                    if( !value ) return 'null';
    
                    // Make an array to hold the partial results of stringifying this object value.
    
                    gap += indent;
                    partial = [];
    
                    // Is the value an array?
    
                    if( toString.apply( value ) === '[object Array]' ){
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.
                        for( i = 0, l = value.length; i < l; ++i ){
                            partial[ i ] = toStr( i, value, rep, gap, indent ) || 'null';
                        };
    
                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        
                        return l === 0 ?
                                '[]' :
                            mind ?
                                '[\n' + mind + partial.join( ',\n' + mind ) + '\n' + mind + ']' :
                                '[' + partial.join( ',' ) + ']';
                    };
    
                    // If the replacer is an array, use it to select the members to be stringified.
    
                    if( toString.apply( rep ) === '[object Array]' ){
                        for( i = 0, l = rep.length; i < l; ++i ){
                            k = rep[ i ];
                            if( typeof k === 'string' ){
                                v = toStr( k, value, rep, gap, indent );
                                if( v ){
                                    partial[ ++n ] = wrapQuoteAndEscape( k ) + ( gap ? ': ' : ':' ) + v;
                                };
                            };
                        };
                    } else {
    
                        // Otherwise, iterate through all of the keys in the object.
    
                        for( k in value ){
                            //if( Object.prototype.hasOwnProperty.call( value, k ) ){
                                v = toStr( k, value, rep, gap, indent );
                                if( v ){
                                    partial[ ++n ] = wrapQuoteAndEscape( k ) + ( gap ? ': ' : ':' ) + v;
                                };
                            //};
                        };
                    };
    
                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.

                    return  n < 0 ?
                                '{}' :
                            mind ?
                                '{\n' + mind + partial.join( ',\n' + mind ) + '\n' + mind + '}' :
                                '{' + partial.join( ',' ) + '}';
            }
        }

        // If the JSON object does not yet have a stringify method, give it one.

        JSON.stringify = function(value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i, indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if( typeof space === 'number' ){
                for ( i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.
            } else
            if ( typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.
            if( replacer && typeof replacer !== 'function' && toString.apply( replacer ) === '[object Array]' ){
                //throw new Error('JSON.stringify');
                return 'error';
            };

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return toStr( '', { '' : value }, replacer, '', indent );
        };

        // If the JSON object does not yet have a parse method, give it one.


        function walk( reviver, holder, key ){

            // The walk method is used to recursively walk the resulting structure so
            // that modifications can be made.

            var k, v, value = holder[key];
            if( value && typeof value === 'object' ){
                for( k in value ){
                    //if( Object.prototype.hasOwnProperty.call( value, k ) ){
                        v = walk( reviver, value, k );
                        if( v !== undefined ){
                            value[ k ] = v;
                        } else {
                            delete value[ k ];
                        }
                    //}
                }
            }
            return reviver.call(holder, key, value);
        }

        JSON.parse = function(text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var i = 0, l, chr, code, ret = [], n = -1, j;
            
            text += '';

            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            // cx =  /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

            

            for ( l = text.length; i < l ; ++i ){
                chr  = text.charAt(i);
                code = chr.charCodeAt(0);

                if (
                    code === 0 || code === 173 || // 
                    ( 1536 <= code && code <= 1540 ) ||
                    1807 === code || 6068 === code || 6069 === code ||
                    (8204 <= code && code <= 8207 ) ||
                    (8232 <= code && code <= 8239 ) || // u2028 - u202f
                    (8288 <= code && code <= 8303 ) || // u2060 - u206f
                    65279 === code ||
                    (65520 <= code && code <= 65535) // ufff0 - uffff
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

            if( testJSON( text ) ){

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ? walk({
                    '' : j
                }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            //throw new SyntaxError('JSON.parse');
            return 'error';
        };

    /*
     * オブジェクトの開始 {
     *  key の開始、 key 文字列, key の終わり, : 値
     * 
     * 配列の開始 [
     *  値:文字列、数値,オブジェクト,配列,true,false,null    
     * 
     */
    
    var rules = {
        0 : {
            '{' :  1,
            '[' : 9
        },
        
        // object 開始
        1 : {
            '"' :  3, // key の開始
            '}' : 88  // 即終わり
        },
        
         // key の開始
        2 : {
            '"' : 3 // key の開始    
        },
        
        // object の key名
        3 : {
            '"' : 4 // key の終わり
        },
        
        // object の key 終わり
        4 : {
            ':' : 5 // これ以外は error
        },
        
        // object|array のメンバーの値の開始
        5 : {
            '{' :  1,
            '[' : 9,
            '"' :  7
            // true, false, null -> 6, 数値 -> 8
        },
        
        // object|array のメンバーの値の終わり
        6 : {
            ',' : 2,
            '}' : 88,
            ']' : 98
        },
        
        // object|array のメンバーの文字列の終わり
        7 : {
            '"' : 6 // 文字列の終わり
        },
        
        // object|array のメンバーの数値の終わり
        8 : {
            ',' : 2,
            '}' : 88,
            ']' : 98
        },
        
        // Array のメンバーの値の開始
        9 : {
            ']' : 98,
            '{' :  1,
            '[' : 9,
            '"' :  7
            // true, false, null -> 6, 数値 -> 8    
        }
        
    };

    var isNumber = {
        "0" : !0, "1" : !0, "2" : !0, "3" : !0, "4" : !0, "5" : !0,
        "6" : !0, "7" : !0, "8" : !0, "9" : !0//,
        //"." : !0, "-" : !0, "e" : !0, "E" : !0, "-" : !0, "+" : !0
    };

    function testJSON( text ){
        
        var hierarchy = [],
            phase = 0,
            i = 0, l = text.length,
            inArray = false, chr, escape, rule,
            whiteSpaceAfterNumber, flag, str;
        
        for( ; i < l; ++i ){
            chr    = text.charAt( i );

            if( !meta[ chr ] || chr === '"' ){
                rule   = rules[ phase ];
                
                switch( phase ){
                    case 0 : // 全ての開始
                    case 1 : // object 内
                    case 2 : // key の開始
                    case 4 : // object の key に続く : を待つ
                    case 6 : // object のメンバーの文字列の終わり
                        phase = rule[ chr ] || 99;
                        break;
                        
                    case 3 : // object の key名 " を待つ
                    case 7 : // object のメンバーの文字列の終わり " を待つ
                        phase = !escape && rule[ chr ] || phase;
                        break;
                    
                    case 5 : // object のメンバーの値の開始
                    case 9 :
                        phase = 99;
                        if( rule[ chr ] ){
                            phase = rule[ chr ];
                        } else
                        if( isNumber[ chr ] || chr === '-' || chr === '.' ){
                            phase = 8;
                            whiteSpaceAfterNumber = false;
                            flag  = chr === '.' ? 1 : 0; 
                        } else {
                            str = text.substr( i, 4 );
                            if( str === 'true' || str === 'null' ){
                                i += 3;
                                phase = 6;
                            };
                            if( text.substr( i, 5 ) === 'false' ){
                                i += 4;
                                phase = 6;
                            };
                        };
                        break;
                    
                    case 8 : // object のメンバーの数値の終わりを待つ
                        if( isNumber[ chr ] && !whiteSpaceAfterNumber ){
                            if( flag & 1 ) flag |= 4; // . のあとに一つ以上の数字が来た。
                            if( flag & 2 ) flag |= 8; // e- のあとに一つ以上の数字が来た。
                            break;
                        } else
                        if( chr === '.' ){
                            phase = flag & 3 ? 99 : phase; // . が二つ以上、e+ の後に . は error
                            flag |= 1;
                            break;                            
                        } else
                        if( chr === 'e' || chr === 'E' ){
                            if( ( flag & 2 ) === 0 ){
                                str = text.substr( i, 2 );
                                if( str === chr + '+' || str === chr + '-' ){
                                    ++i;
                                    flag |= 2;
                                    break;
                                };
                            };                            
                        };
                        phase = ( flag & 5 ) === 1 || ( flag & 10 ) === 2 ? // ., e+ に続く数字がない
                                    99 : rule[ chr ] || 99;
                        break;
                };
                escape = false;    
            } else {
                escape = chr === '\\';
                if( phase === 8 ){ // number の間に挿入された空白文字はerror
                    whiteSpaceAfterNumber = true;
                };                
            };
        
            if( phase === 2 && inArray ){
                phase = 5;
            } else
            if( phase === 1 || phase === 9 ){
                hierarchy.push( inArray );
                inArray = phase === 9;
            } else
            if( phase === 88 ){
                phase = inArray ? 99 : 6;
                inArray = hierarchy.pop();
            } else
            if( phase === 98 ){
                phase = inArray ? 6 : 99;
                inArray = hierarchy.pop();
            };
        
            if( phase === 99 ){
                // error
                return;
            };
        };
        
        return hierarchy.length === 0;
    };

    }());