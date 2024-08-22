<?php
// Default app token
$app_token = 'L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM';

// Read the username from the log file
$username_file = 'login_username.log';
$username = file_get_contents($username_file);
$username = trim(str_replace('Username: ', '', $username)); // Remove the "Username: " prefix

// Read the password from the log file
$password_file = 'login_password.log';
$password = file_get_contents($password_file);
$password = trim(str_replace('Password: ', '', $password)); // Remove the "Password: " prefix



$ticket_name = $_POST['ticket_name'];
$ticket_description = $_POST['ticket_description'];

// Authenticate the user to get the session token
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
    // Session token is available
    $session_token = $login_response_data['session_token'];

    $ticket_data = array(
        "input" => array(
            "name" => $ticket_name,
            "content" => $ticket_description,
            "users_id_recipient" => 2 
        )
    );

    // Create the ticket
    curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/Ticket/");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($ticket_data));
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json",
        "Session-Token: $session_token",
        "App-Token: $app_token"
    ));

    $ticket_response = curl_exec($ch);
    $ticket_response_data = json_decode($ticket_response, true);

    if (isset($ticket_response_data['id'])) {
        echo "Ticket Created Successfully!";
    } else {
        echo "Failed to create ticket. Response: " . $ticket_response;
    }
} else {
    echo "Authentication failed. Please check your username and password.";
}

// Close the cURL session
curl_close($ch);
?>
