<?php
// Retrieve the material name from the POST request
$material_name = $_POST['material_name'];

// Session token and App token (replace with actual values)
$session_token = "1e4g51qvu7ee1tlj6v0d4fkgi5";
$app_token = "gCAuGtIaufvkutWeNnRWQ1fPodaWdWaboYlBe954";

// Initialize cURL
$ch = curl_init();

// Set the cURL options
curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/Printer/"); // Adjust URL as necessary
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Session-Token: $session_token",
    "App-Token: $app_token"
));

// Execute the cURL request
$response = curl_exec($ch);

// Check for errors
if(curl_errno($ch)) {
    echo json_encode(['error' => 'Error:' . curl_error($ch)]);
    exit;
}

// Decode the response
$response_data = json_decode($response, true);

// Check if the material is available
$is_available = false;
foreach ($response_data as $material) {
    if (strcasecmp($material['name'], $material_name) === 0) {
        $is_available = true;
        break;
    }
}

// Return the result
echo json_encode(['available' => $is_available]);

// Close the cURL session
curl_close($ch);
?>
