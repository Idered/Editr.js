import Q from "q";
import UrlParser from "./UrlParser";
import BaseParser from "./BaseParser";
import GistParser from "./GistParser";

var FILE_TYPES = {
    html: 'html', haml: 'html', md: 'html',
    css: 'css', sass: 'css', less: 'css', scss: 'css',
    js: 'js', coffee: 'js'
};

class Parser {
    constructor ( instance ) {
        this.instance = instance;

        // Loaded files
        this.files = [];

        // List of sources that were loaded successfully or failed
        this.parsedSources = {success: [], fail: []};

        // Create deferred object for parsing sources, each time we parse a
        // source we perform a check if all sources were parsed, then we
        // pass all extracted files to instance
        this.parsing = Q.defer();
        this.parsing.promise.progress( this.checkParsingProgress.bind( this ) );

        // Extract sources from where we will load files
        this.sources = instance.element.dataset[ 'editr' ]
            .replace( /\s/g, '' )
            .split( ';' )
            .filter( String );

        // Parse each source
        this.sources.forEach( source => this.extract( source ) );

        this.checkParsingProgress();

        return this.parsing.promise;
    }

    extract ( source ) {
        let extraction = Q.defer();

        extraction.promise
            .then( this.handleExtractedFile.bind( this ) )
            .catch( this.deepExtract.bind( this ) );

        // We've received an object which means that's a file to load
        if ( typeof(source) == 'object' ) {
            new BaseParser( extraction ).parse( source );
        } else if ( /^gist/.test( source ) ) { // Check if source is a gist
            new GistParser( extraction, this.parsedSources, this.instance.proxy ).parse( source );
        } else if ( /^url/.test( source ) ) {// Check if source is url
            new UrlParser( extraction, this.parsedSources ).parse( source );
        }
    }

    deepExtract ( sources ) {
        sources.forEach( this.extract.bind( this ) );
    }

    checkParsingProgress () {
        // Check if we parsed all sources
        if ( this.sources.length == this.parsedSources.success.length + this.parsedSources.fail.length ) {
            this.parsing.resolve( this.files );
        }
    }

    handleExtractedFile ( file ) {
        this.parsing.notify();

        // Check if file extension is not supported
        if ( !FILE_TYPES[ file.extension ] ) {
            console.error(
                "[Editr] Extension %c." + file.extension + "%c is not supported.",
                'font-weight:bold', 'font-weight: normal'
            );
        } else {
            file.type = FILE_TYPES[ file.extension ];
            this.files.push( file );

            this.instance.element.dispatchEvent( new CustomEvent( "editr:add", {
                detail: {
                    instance: this.instance,
                    file: file
                }
            } ) );
        }
    }
}

export default Parser
