// Get filename extension
export default function( filename ) {
    if ( !filename ) {
        throw '[Editr] No filename.'
    }

    return filename.match( /[^\\]*\.(\w+)$/ )[ 1 ];
}
