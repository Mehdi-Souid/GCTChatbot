<?php
$material_name = $_POST['material_name'];

$app_token = "L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM";

// Read the username from the log file
$username_file = 'login_username.log';
$username = trim(file_get_contents($username_file));
$username = str_replace('Username: ', '', $username); // Remove the "Username: " prefix

// Read the password from the log file
$password_file = 'login_password.log';
$password = trim(file_get_contents($password_file));
$password = str_replace('Password: ', '', $password); // Remove the "Password: " prefix

// Check if username or password files are empty
if (empty($username) || empty($password)) {
    echo json_encode(['error' => 'You must login first.']);
    exit();
}

// Initialize cURL to authenticate and obtain session token
$login_data = array(
    "login" => $username,
    "password" => $password
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/initSession");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($login_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "App-Token: $app_token"
));

$login_response = curl_exec($ch);
$login_response_data = json_decode($login_response, true);

if (isset($login_response_data['session_token'])) {
    $session_token = $login_response_data['session_token'];
} else {
    echo json_encode(['error' => 'Authentication failed.']);
    curl_close($ch);
    exit();
}

// Now use the session token to search for the material
curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/ConsumableItem/"); // Adjust URL as necessary
curl_setopt($ch, CURLOPT_POST, 0); // Set to GET request
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Session-Token: $session_token",
    "App-Token: $app_token"
));

$response = curl_exec($ch);

if(curl_errno($ch)) {
    echo json_encode(['error' => 'Error:' . curl_error($ch)]);
    curl_close($ch);
    exit();
}

$response_data = json_decode($response, true);

$is_available = false;
foreach ($response_data as $material) {
    if (strcasecmp($material['name'], $material_name) === 0) {
        $is_available = true;
        break;
    }
}

echo json_encode(['available' => $is_available]);

curl_close($ch);
?>
