/**
 * https://github.com/bestiejs/json3/blob/3014ebd8c43a2a251385bb5ba4c6500edb220e21/test/test_json3.js#L261
 */
const test = require('ava');
const json2 = require('../dist/index.js');

test('`null` is represented literally', (t) => {
    t.is( json2.stringify( null ) , "null" );
});
test('`Infinity` is serialized as `null`', (t) => {
    t.is( json2.stringify( 1 / 0 ), "null" );
});
test('`NaN` is serialized as `null`', (t) => {
    t.is( json2.stringify( 0 / 0 ), "null" );
});
test('`-Infinity` is serialized as `null`', (t) => {
    t.is( json2.stringify( -1 / 0 ), "null" );
});
test('Boolean primitives are represented literally', (t) => {
    t.is( json2.stringify( true ), "true" );
});
test('Boolean objects are represented literally', (t) => {
    t.is( json2.stringify( new Boolean(false) ), "false" );
});
test('"All control characters in strings are escaped', (t) => {
    t.is( json2.stringify( new String('\\"How\bquickly\tdaft\njumping\fzebras\rvex"') ), '"\\\\\\"How\\bquickly\\tdaft\\njumping\\fzebras\\rvex\\""' );
});
test('Arrays are serialized recursively', (t) => {
    t.is( json2.stringify( [new Boolean, new Number(1), new String("Kit")] ), "[false,1,\"Kit\"]" );
});
test('`[undefined]` is serialized as `[null]`', (t) => {
    t.is( json2.stringify( [void 0] ), "[null]" );
});
test('Objects are serialized recursively', (t) => {
    // Property enumeration is implementation-dependent.
    var value = {
        "jdalton": ["John-David", 29],
        "kitcambridge": ["Kit", 18],
        "mathias": ["Mathias", 23]
      };
    t.is( json2.stringify( value ), JSON.stringify( value ) );
});
test('Nested objects containing identically-named properties should serialize correctly', (t) => {
    // Complex cyclic structures.
    var value = { "foo": { "b": { "foo": { "c": { "foo": null } } } } };
    t.is( json2.stringify( value ), JSON.stringify( value ) );
});
test('"Objects containing duplicate references should not throw a `TypeError`', (t) => {
    // Complex cyclic structures.
    var S = [], N = {};
    S.push(N, N);
    t.is( json2.stringify( S ), '[{},{}]' );
});
test('Objects containing complex circular references should throw a `TypeError`', (t) => {
    // Complex cyclic structures.
    var value = { "foo": { "b": { "foo": { "c": { "foo": null} } } } };
    value.foo.b.foo.c.foo = value;
    t.is( json2.stringify( value ), void 0 );
});
test('Sparse arrays should serialize correctly', (t) => {
    // Sparse arrays.
    var value = [];
    value[5] = 1;
    t.is( json2.stringify( value ), "[null,null,null,null,null,1]" );
});

// Date
test('Dates should be serialized according to the simplified date time string format', (t) => {
    t.is( json2.stringify( new Date(Date.UTC(1994, 6, 3)) ), '"1994-07-03T00:00:00.000Z"' );
});
test('The date time string should conform to the format outlined in the spec', (t) => {
    t.is( json2.stringify( new Date(Date.UTC(1993, 5, 2, 2, 10, 28, 224)) ), '"1993-06-02T02:10:28.224Z"' );
});
test('The minimum valid date value should serialize correctly', (t) => {
    t.is( json2.stringify( new Date(-8.64e15) ), '"-271821-04-20T00:00:00.000Z"' );
});
test('The maximum valid date value should serialize correctly', (t) => {
    t.is( json2.stringify( new Date(8.64e15) ), '"+275760-09-13T00:00:00.000Z"' );
});
test('https://bugs.ecmascript.org/show_bug.cgi?id=119', (t) => {
    t.is( json2.stringify( new Date(Date.UTC(10000, 0, 1)) ), '"+010000-01-01T00:00:00.000Z"' );
});
test('toJSON', (t) => {
    var value = new Date();
    value.toJSON = function(){ return "date"; };

    t.is( json2.stringify( value ), '"date"' );
});
// Tests based on research by @Yaffle. See kriskowal/es5-shim#111.
test('Millisecond values < 1000 should be serialized correctly', (t) => {
    t.is( json2.stringify( new Date(-1) ), '"1969-12-31T23:59:59.999Z"' );
});
test('Years prior to 0 should be serialized as extended years', (t) => {
    t.is( json2.stringify( new Date(-621987552e5) ), '"-000001-01-01T00:00:00.000Z"' );
});
test('Years after 9999 should be serialized as extended years', (t) => {
    t.is( json2.stringify( new Date(2534023008e5) ), '"+010000-01-01T00:00:00.000Z"' );
});
test('Issue #4: Opera > 9.64 should correctly serialize a date with a year of `-109252`', (t) => {
    t.is( json2.stringify( new Date(-3509827334573292) ), '"-109252-01-01T10:37:06.708Z"' );
});
// Opera 7 normalizes dates with invalid time values to represent the
// current date.
if(!isFinite(new Date("Kit"))) {
    test('Invalid dates should serialize as `null`', (t) => {
        t.is( json2.stringify( new Date("Kit") ), "null" );
    });
};

// Additional arguments.
test('Nested arrays; optional `whitespace` argument', (t) => {
    t.is( json2.stringify( [1, 2, 3, [4, 5]], null, "  " ), "[\n  1,\n  2,\n  3,\n  [\n    4,\n    5\n  ]\n]" );
});
test('Empty array; optional string `whitespace` argument', (t) => {
    t.is( json2.stringify( [], null, "  " ), "[]" );
});
test('Empty object; optional numeric `whitespace` argument', (t) => {
    t.is( json2.stringify( {}, null, 2 ), "{}" );
});
test('Single-element array; optional numeric `whitespace` argument', (t) => {
    t.is( json2.stringify( [1], null, 2 ), "[\n  1\n]" );
});
test('Single-member object; optional string `whitespace` argument', (t) => {
    t.is( json2.stringify( { "foo": 123 }, null, "  " ), "{\n  \"foo\": 123\n}" );
});
test('Nested objects; optional numeric `whitespace` argument', (t) => {
    t.is( json2.stringify( {"foo": {"bar": [123]}}, null, 2 ), "{\n  \"foo\": {\n    \"bar\": [\n      123\n    ]\n  }\n}" );
});