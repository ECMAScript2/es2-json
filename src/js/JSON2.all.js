goog.provide( 'JSON2.all' );

goog.require( 'JSON2.stringify' );
goog.require( 'JSON2.parse' );

// Create a JSON object only if one does not already exist.

JSON = JSON || {
    stringify : JSON2.stringify,
    parse     : JSON2.parse
};
