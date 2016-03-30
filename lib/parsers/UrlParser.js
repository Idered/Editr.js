var axios = require( 'axios' );

class UrlParser {
    constructor ( extraction, parsedSources ) {
        this.extraction = extraction;
        this.parsedSources = parsedSources;
    }

    parse ( source ) {
        this.source = source.substr( 4 );

        return axios
            .get( this.source.replace( /^!/, '' ) )
            .then( this.handleSuccess.bind( this ) )
            .catch( this.handleError.bind( this ) );
    }

    handleSuccess ( response ) {
        let files = [];
        let contentType = response.headers[ 'content-type' ];
        let responseType = contentType.split( ';' )[ 0 ].split( '/' )[ 1 ];

        if ( responseType == 'json' ) {
            files = response.data;

            this.parsedSources.success.push( this.source );
        } else if ( [ 'javascript', 'css', 'html', 'octet-stream' ].indexOf( responseType ) >= 0 ) {
            let hidden = /^!/.test( this.source ) ? '!' : '';

            files.push( {
                filename: hidden + this.source.substr( this.source.lastIndexOf( '/' ) + 1 ),
                content: response.data
            } );

            this.parsedSources.success.push( this.source );
        } else {
            console.error(
                '[Editr] Invalid response type %c' + contentType + '%c while loading %c' + this.source,
                'font-weight:bold', 'font-weight: normal', 'font-weight:bold'
            );
            this.parsedSources.fail.push( this.source );
        }

        this.extraction.reject( files );
    }

    handleError () {
        this.parsedSources.fail.push( this.source );
    }
}

export default UrlParser;
