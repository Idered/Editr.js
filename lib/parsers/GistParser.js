var axios = require( 'axios' );

class GistParser {
    constructor ( extraction, parsedSources, proxy ) {
        this.extraction = extraction;
        this.parsedSources = parsedSources;
        this.proxy = proxy;
    }

    parse ( source ) {
        this.source = source;
        this.gistId = source.split( ':' )[ 1 ];
        this.filenames = source.split( ':' )[ 2 ] || '';
        this.filenames = this.filenames ? this.filenames.split( ',' ) : [];

        return axios
            .get( this.proxy, {
                params: {id: this.gistId}
            } )
            .then( this.handleSuccess.bind( this ) )
            .catch( this.handleError.bind( this ) );
    }

    handleSuccess ( response ) {
        let files = [];
        let gistFiles = response.data.files;

        if ( this.filenames.length ) {
            // Load only selected files
            this.filenames.forEach( filename => {
                if ( gistFiles[ filename ] ) {
                    files.push( gistFiles[ filename ] );
                } else {
                    console.error( '[Editr] File "' + filename + '" was not found in gist.' );
                }
            } );
        } else {
            // Load all files
            files = Object.keys( gistFiles ).map( key => gistFiles[ key ] );
        }

        this.extraction.reject( files );
        this.parsedSources.success.push( this.source );
    }

    handleError () {
        console.error( '[Editr] Gist "' + this.source + '" was not found.' );
        this.parsedSources.fail.push( this.source );
    }
}

export default GistParser;
