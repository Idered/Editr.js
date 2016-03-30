/*!
 * Editr.js
 *
 * @author Kasper Mikewicz - http://idered.pl/
 * @see http://lab.idered.pl/editr
 * @license MIT
 * @version 3.0.0
 *
 * Steps:
 *
 * DONE: Build editr virtual instance
 * DONE: Parse editr files and load them
 * TODO: Build editr visual instance(navs, views)
 * TODO: Adding/Removing files
 * TODO: Generating previews
 */

'use strict';

import Parser from "./parsers/Parser";
import extend from "extend";

let DEFAULTS = {
    editor: {
        theme: 'base16-dark'
    },
    view: 'single',
    proxy: '/editr/lib/proxy.gist.php'
};

var FILE_MODES = {
    html: 'htmlmixed', haml: 'haml', md: 'markdown',
    css: 'css', sass: 'css', less: 'css', scss: 'css',
    js: 'javascript', coffee: 'coffeescript'
};

class Editr {
    constructor ( options ) {
        if ( !options ) {
            throw new Error( '[Editr] No options passed to constructor. Pass at least options.element.' );
        }

        if ( !options.element ) {
            throw new Error( '[Editr] No element option passed to constructor.' )
        }

        // Extend defaults with passed options
        this.instance = extend( {}, DEFAULTS, options );

        // Load files from passed sources
        this.loadFiles().then( files => {
            this.instance.files = files;
            this.instance.element.dispatchEvent( new CustomEvent( "editr:loaded", {
                detail: {
                    instance: this.instance
                }
            } ) );

            this.buildInterface();
        } );

        // Make "on" method public
        this.on = this.on.bind( this );
    }

    loadFiles () {
        return new Parser( this.instance );
    };

    on ( event, callback ) {
        if ( typeof event === 'object' ) {
            for ( var ev in event ) {
                this.on( ev, event[ ev ] );
            }

            return this;
        }

        if ( typeof event != 'string' ) {
            throw Error( '[Editr] Event must be string.' );
        }

        if ( typeof callback != 'function' ) {
            throw Error( '[Editr] Callback must be function.' );
        }

        this.instance.element.addEventListener( event, callback, false );

        return this;
    }

    buildInterface () {
        // Parse sources
    }
}

export default Editr;

function buildUI ( instance ) {
    buildNav( instance.element, instance.files );
    buildEditors( instance.element, instance.files );

    $( instance.element ).addClass( 'is-loaded' );

    function buildNav ( el, files ) {
        // Instance element
        var $el = $( el );

        // Nav items container
        var $nav = $( '<div class="editr-nav"/>' ).appendTo( $el );

        var $filesItem = addButton( 'Files', function () {
            $( this ).parent().toggleClass( 'is-visible' );
        } );

        buildFilesItemList( $filesItem );

        instance.element.addButton = addButton;

        function addButton ( label, fn ) {
            var $label = $( '<span class="editr-nav-label">' + label + '</span>' );
            var $item = $( '<div class="editr-nav-item"/>' );

            $label.on( 'click', fn );

            $item.append( $label ).appendTo( $nav );

            return $item;
        }

        function buildFilesItemList ( $filesItem ) {
            var $list = $( '<div class="editr-nav-items"/>' );

            _.each( files, function ( value, type ) {
                if ( !value.length ) return;

                var $section = $( '<div/>' );

                $section.append( '<div class="editr-nav-title">' + type.toUpperCase() + '</div>' );

                _.map( value, function ( file ) {
                    if ( file.hidden ) return;

                    file[ 'link' ] = $( '<div class="editr-nav-link">' + file.filename + '</div>' )
                        .appendTo( $section )
                        .on( 'click', function () {
                            file.$editor.addClass( 'is-active' ).siblings().removeClass( 'is-active' );
                        } );
                } );

                $section.appendTo( $list );
            } );

            $filesItem.append( $list );
        }
    } // buildNav

    function buildEditors ( element, fileTypes ) {
        var $editors = $( '<div class="editr-editors"/>' ).appendTo( element );

        _.each( fileTypes, function ( files, type ) {
            _.each( files, function ( file, index ) {
                if ( fileTypes[ type ][ index ][ 'editor' ] ) return;

                var editorOptions = extend( {}, {
                    value: prepareCode( type, file.content ),
                    theme: Options.editor.theme,
                    lineNumbers: true
                }, Options.editor, {
                    mode: FILE_MODES[ type ]
                } );

                var editor = fileTypes[ type ][ index ][ 'editor' ] = CodeMirror( $editors[ 0 ], editorOptions );

                editor.on( 'change', function () {
                    fileTypes[ type ][ index ][ 'content' ] = editor.getValue();
                } );

                fileTypes[ type ][ index ][ '$editor' ] = $( editor.getWrapperElement() );
            } );
        } );

        $editors.children().first().addClass( 'is-active' );
    }
}

function prepareCode ( type, code ) {
    switch ( type ) {
        case 'html':
            return code;
        case 'css':
            return code;
        case 'js':
            return code;
    }
}

window.Editr = Editr;
