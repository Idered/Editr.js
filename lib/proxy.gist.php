<?php

/*
|--------------------------------------------------------------------------
| GitHub credentials
|--------------------------------------------------------------------------
|
| GitHub username and API token are required to make connection and
| download gist data. You can create new API token here:
| https://github.com/settings/tokens/new
*/

$username = 'USERNAME';
$token    = 'API_TOKEN';

/*
|--------------------------------------------------------------------------
*/

header( "Content-Type: application/json" );

$endpoint = 'https://api.github.com/gists/';

$gistId = isset( $_GET['id'] ) ? $_GET['id'] : '';

if ( $gistId === '' ) {
	die( json_encode( array(
		'status' => - 1
	) ) );
}

function curlQuery( $url, $username, array $headers = array() )
{
	$connection = curl_init();

	curl_setopt_array( $connection, array(
		CURLOPT_USERAGENT      => $username,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_URL            => $url,
		CURLOPT_TIMEOUT        => 7,
		CURLOPT_SSL_VERIFYPEER => false,
		CURLOPT_SSL_VERIFYHOST => 2,
		CURLOPT_HTTPGET        => true
	) );


	if ( ! empty( $headers ) ) {
		curl_setopt( $connection, CURLOPT_HTTPHEADER, $headers );
	}

	$result = curl_exec( $connection );

	if ( curl_errno( $connection ) > 0 ) {
		return false;
	}

	return $result;
}

echo curlQuery(
	$endpoint . $gistId,
	$username,
	array(
		'Content-Type: application/javascript',
		'Authorization: token ' . $token
	)
);
