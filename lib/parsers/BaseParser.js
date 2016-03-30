import ext from "../helpers/ext";

var axios = require( 'axios' );
var _ = require( 'lodash' );

class BaseParser {
    constructor ( extraction ) {
        this.extraction = extraction;
    }

    parse ( source ) {
        this.extraction.resolve( {
            content: source.content,
            extension: ext( source.filename ),
            filename: source.filename.replace( /^!/, '' ),
            hidden: /^!/.test( source.filename )
        } );
    }
}

export default BaseParser;
