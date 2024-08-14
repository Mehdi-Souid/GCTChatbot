<?php
header('Content-Type: application/json');

$url = 'http://localhost/glpi/apirest.php/Ticket/';
$sessionToken = 'nsgae1q1bpdr1uf9hamkl41fi6'; // Replace with your actual session token
$appToken = 'gCAuGtIaufvkutWeNnRWQ1fPodaWdWaboYlBe954'; // Replace with your actual app token

// Initialize cURL session
$ch = curl_init();

// Set cURL options
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Session-Token: ' . $sessionToken,
    'App-Token: ' . $appToken
]);

// Execute cURL request
$response = curl_exec($ch);

// Check for cURL errors
if (curl_errno($ch)) {
    echo json_encode(['error' => curl_error($ch)]);
} else {
    // Output the response
    echo $response;
}

// Close cURL session
curl_close($ch);
?>
