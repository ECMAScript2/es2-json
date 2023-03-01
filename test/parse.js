const test = require('ava');
const json2 = require('../dist/index.js');

test('Empty JSON source string', (t) => {
    t.deepEqual( json2.parse( "" ), void 0 );
    t.deepEqual( json2.parse( "\n\n\r\n" ), void 0 );
    t.deepEqual( json2.parse( " " ), void 0 );
    t.deepEqual( json2.parse( " " ), void 0 );
});

test('Source string containing an invalid Unicode whitespace character', (t) => {
    t.deepEqual( json2.parse( "{\u00a0}" ), void 0 );
    t.deepEqual( json2.parse( "{\u1680}" ), void 0 );
    t.deepEqual( json2.parse( "{\u180e}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2000}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2001}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2002}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2003}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2004}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2005}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2006}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2007}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2008}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2009}" ), void 0 );
    t.deepEqual( json2.parse( "{\u200a}" ), void 0 );
    t.deepEqual( json2.parse( "{\u202f}" ), void 0 );
    t.deepEqual( json2.parse( "{\u205f}" ), void 0 );
    t.deepEqual( json2.parse( "{\u3000}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2028}" ), void 0 );
    t.deepEqual( json2.parse( "{\u2029}" ), void 0 );
});

test('Source string containing a vertical tab', (t) => {
    t.deepEqual( json2.parse( "{\u000b}" ), void 0 );
});

test('Source string containing a form feed', (t) => {
    t.deepEqual( json2.parse( "{\u000c}" ), void 0 );
});

test('Source string containing a byte-order mark', (t) => {
    t.deepEqual( json2.parse( "{\ufeff}" ), void 0 );
});

test('Source string containing a CRLF line ending', (t) => {
    t.deepEqual( json2.parse( "{\r\n}" ), {} );
});

test('Source string containing multiple line terminators', (t) => {
    t.deepEqual( json2.parse( "{\n\n\r\n}" ), {} );
});

test('Source string containing a tab character', (t) => {
    t.deepEqual( json2.parse( "{\t}" ), {} );
});

test('Source string containing a space character', (t) => {
    t.deepEqual( json2.parse( "{ }" ), {} );
});

test('`08` and `018` are invalid octal values', (t) => {
    // `08` and `018` are invalid octal values.
    ["00", "01", "02", "03", "04", "05", "06", "07", "010", "011", "08", "018"].forEach(
        function (value) {
            t.deepEqual( json2.parse( value ), void 0 );// "Octal literal");
            t.deepEqual( json2.parse( "-" + value ), void 0 ); //"Negative octal literal");
            t.deepEqual( json2.parse( '"\\' + value + '"' ), void 0 ); // "Octal escape sequence in a string");
            t.deepEqual( json2.parse( '"\\x' + value + '"' ), void 0 ); //"Hex escape sequence in a string");
        }
    );
});

test('Numeric Literals', (t) => {
    t.deepEqual( json2.parse(        "100" ),  100       ); // "Integer" ) );
    t.deepEqual( json2.parse(       "-100" ), -100       ); // "Negative integer" ) );
    t.deepEqual( json2.parse(       "10.5" ),   10.5     ); // "Float" ) );
    t.deepEqual( json2.parse(     "-3.141" ),   -3.141   ); // "Negative float" ) );
    t.deepEqual( json2.parse(      "0.625" ),    0.625   ); // "Decimal" ) );
    t.deepEqual( json2.parse(   "-0.03125" ),   -0.03125 ); //, "Negative decimal" ) );
    t.deepEqual( json2.parse(        "1e3" ), 1000       ); // "Exponential" ) );
    t.deepEqual( json2.parse(       "1e+2" ),  100       ); // "Positive exponential" ) );
    t.deepEqual( json2.parse(      "-1e-2" ),   -0.01    ); // "Negative exponential" ) );
    t.deepEqual( json2.parse( "0.03125e+5" ), 3125       ); // "Decimalized exponential" ) );
    t.deepEqual( json2.parse(        "1E2" ),  100       ); // "Case-insensitive exponential delimiter" ) );

    t.deepEqual( json2.parse(   "+1" ), void 0 ); // , "Leading `+`");
    t.deepEqual( json2.parse(   "1." ), void 0 ); // , "Trailing decimal point");
    t.deepEqual( json2.parse(   ".1" ), void 0 ); // , "Leading decimal point");
    t.deepEqual( json2.parse(   "1e" ), void 0 ); // , "Missing exponent");
    t.deepEqual( json2.parse(  "1e-" ), void 0 ); // , "Missing signed exponent");
    t.deepEqual( json2.parse(  "--1" ), void 0 ); // , "Leading `--`");
    t.deepEqual( json2.parse(  "1-+" ), void 0 ); // , "Trailing `-+`");
    t.deepEqual( json2.parse( "0xaf" ), void 0 ); // , "Hex literal");

    // The native `JSON.parse` implementation in IE 9 allows this syntax, but
    // the feature tests should detect the broken implementation.
    t.deepEqual( json2.parse( "- 5" ), void 0 ); // , "Invalid negative sign");
});

test('String Literals', (t) => {
    t.deepEqual( json2.parse( '"value"' ), "value" ); // , "Double-quoted string literal");
    t.deepEqual( json2.parse( '""'      ), ""      ); // , "Empty string literal");

    t.deepEqual( json2.parse( '"\\u2028"' ), "\u2028" ); // , "String containing an escaped Unicode line separator");
    t.deepEqual( json2.parse( '"\\u2029"' ), "\u2029" ); // ,"String containing an escaped Unicode paragraph separator");
    // ExtendScript doesn't handle surrogate pairs correctly; attempting to
    // parse `"\ud834\udf06"` will throw an uncatchable error (issue #29).
    t.deepEqual( json2.parse( '"\ud834\udf06"' ), "\ud834\udf06" ); // , "String containing an unescaped Unicode surrogate pair");
    t.deepEqual( json2.parse( '"\\u0001"'      ), "\u0001"       ); // , "String containing an escaped ASCII control character");
    t.deepEqual( json2.parse( '"\\b"'          ), "\b"           ); // , "String containing an escaped backspace");
    t.deepEqual( json2.parse( '"\\f"'          ), "\f"           ); // , "String containing an escaped form feed");
    t.deepEqual( json2.parse( '"\\n"'          ), "\n"           ); // , "String containing an escaped line feed");
    t.deepEqual( json2.parse( '"\\r"'          ), "\r"           ); // , "String containing an escaped carriage return");
    t.deepEqual( json2.parse( '"\\t"'          ), "\t"           ); // , "String containing an escaped tab");

    t.deepEqual( json2.parse( '"hello\\/world"'  ), "hello/world" ); // , "String containing an escaped solidus");
    t.deepEqual( json2.parse( '"hello\\\\world"' ), "hello\\world" ); // , "String containing an escaped reverse solidus");
    t.deepEqual( json2.parse( '"hello\\"world"'  ), "hello\"world" ); // , "String containing an escaped double-quote character");

    t.deepEqual( json2.parse( "'hello'"            ), void 0 ); // , "Single-quoted string literal");
    t.deepEqual( json2.parse( '"\\x61"'            ), void 0 ); // , "String containing a hex escape sequence");
    t.deepEqual( json2.parse( '"hello \r\n world"' ), void 0 ); // , "String containing an unescaped CRLF line ending");
});

test('String containing an unescaped ASCII control character', (t) => {
    [
        "\u0001", "\u0002", "\u0003",
        "\u0004", "\u0005", "\u0006", "\u0007", "\b", "\t", "\n", "\u000b", "\f",
        "\r", "\u000e", "\u000f", "\u0010", "\u0011", "\u0012", "\u0013",
        "\u0014", "\u0015", "\u0016", "\u0017", "\u0018", "\u0019", "\u001a",
        "\u001b", "\u001c", "\u001d", "\u001e", "\u001f"
    ].forEach(
        function(value){
            t.deepEqual( json2.parse( '"' + value + '"' ), void 0 ); // "String containing an unescaped ASCII control character");
        }
    );
    // Opera 7 discards null characters in strings.
    if("\0".length){
        // expected += 1;
        // controlCharacters.push("\u0000");
        t.deepEqual( json2.parse( '"\u0000"' ), void 0 );
    };
});

test('[Array Literals] Trailing comma in array literal', (t) => {
    t.deepEqual( json2.parse( "[1, 2, 3,]" ), void 0 ); // "");
});

test('[Array Literals] Nested arrays', (t) => {
    t.deepEqual( json2.parse( "[1, 2, [3, [4, 5]], 6, [true, false], [null], [[]]]" ), [1, 2, [3, [4, 5]], 6, [true, false], [null], [[]]] );
});

test('[Array Literals] Array containing empty object literal', (t) => {
    t.deepEqual( json2.parse( "[{}]" ), [{}] );
});

test('[Array Literals] Mixed array', (t) => {
    t.deepEqual( json2.parse( "[1e2, true, false, null, {\"a\": [\"hello\"], \"b\": [\"world\"]}, [1e-2]]" ), [100, true, false, null, {"a": ["hello"], "b": ["world"]}, [0.01]] );
});


test('[Object Literals] Object literal containing one member', (t) => {
    t.deepEqual( json2.parse( "{\"hello\": \"world\"}" ), {"hello": "world"} );
});
test('[Object Literals] Object literal containing multiple members', (t) => {
    t.deepEqual( json2.parse( "{\"hello\": \"world\", \"foo\": [\"bar\", true], \"fox\": {\"quick\": true, \"purple\": false}}" ), {"hello": "world", "foo": ["bar", true], "fox": {"quick": true, "purple": false}} );
});
test('[Object Literals] Unquoted identifier used as a property name', (t) => {
    t.deepEqual( json2.parse( "{key: 1}" ), void 0 );
});
test('[Object Literals] `false` used as a property name', (t) => {
    t.deepEqual( json2.parse( "{false: 1}" ), void 0 );
});
test('[Object Literals] `true` used as a property name', (t) => {
    t.deepEqual( json2.parse( "{true: 1}" ), void 0 );
});
test('[Object Literals] `null` used as a property name', (t) => {
    t.deepEqual( json2.parse( "{null: 1}" ), void 0 );
});
test('[Object Literals] Single-quoted string used as a property name', (t) => {
    t.deepEqual( json2.parse( "{'key': 1}" ), void 0 );
});
test('[Object Literals] Number used as a property name', (t) => {
    t.deepEqual( json2.parse( "{1: 2, 3: 4}" ), void 0 );
});
test('[Object Literals] Trailing comma in object literal', (t) => {
    t.deepEqual( json2.parse( "{\"hello\": \"world\", \"foo\": \"bar\",}" ), void 0 );
});

test('Source string containing a JavaScript expression "1 + 1"', (t) => {
    t.deepEqual( json2.parse( "1 + 1" ), void 0 );
});
test('Source string containing a JavaScript expression "1 * 2"', (t) => {
    t.deepEqual( json2.parse( "1 * 2" ), void 0 );
});
test('Source string containing a JavaScript expression "var value = 123;"', (t) => {
    t.deepEqual( json2.parse( "var value = 123;" ), void 0 );
});
test('Source string containing a JavaScript expression "{});value = 123;({}"', (t) => {
    t.deepEqual( json2.parse( "{});value = 123;({}" ), void 0 );
});
test('Source string containing a JavaScript expression "call()"', (t) => {
    t.deepEqual( json2.parse( "call()" ), void 0 );
});
test('Source string containing a JavaScript expression "1, 2, 3, \"value\""', (t) => {
    t.deepEqual( json2.parse( "1, 2, 3, \"value\"" ), void 0 );
});