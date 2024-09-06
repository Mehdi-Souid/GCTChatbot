<?php
session_start(); // Start the session

// Check if session token is available in the cookie
if (!isset($_COOKIE['session_token'])) {
    echo "Error: No session token found. Please <a href='http://localhost/glpi'>login here</a>.";
    exit();
}

$session_token = $_COOKIE['session_token']; // Retrieve session token from cookie

$app_token = 'L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM'; // Replace with your actual app token

// Check the timestamp of the last ticket creation
if (isset($_SESSION['last_ticket_time'])) {
    $last_ticket_time = $_SESSION['last_ticket_time'];
    $current_time = time();

    if (($current_time - $last_ticket_time) < 10) { // 10 seconds
        echo "Veuillez attendre avant de créer un autre ticket.";
        exit();
    }
}

// Set the current time as the last ticket creation time
$_SESSION['last_ticket_time'] = time();

// Validate ticket creation input
if (empty($_POST['ticket_name']) || empty($_POST['ticket_description']) || empty($_POST['type']) || empty($_POST['category'])) {
    echo "Veuillez fournir toutes les informations nécessaires pour créer un ticket.";
    exit();
}

$ticket_name = $_POST['ticket_name'];
$ticket_description = $_POST['ticket_description'];
$ticket_type = $_POST['type'];  // '1' for incident, '2' for request
$ticket_category = $_POST['category']; // Add your category here

$ticket_data = array(
    "input" => array(
        "name" => $ticket_name,
        "content" => $ticket_description,
        "type" => $ticket_type, // 1 for incident, 2 for request
        "itilcategories_id" => $ticket_category // Add the category ID
    )
);

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/Ticket/");
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($ticket_data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Session-Token: $session_token",
    "App-Token: $app_token"
));

$ticket_response = curl_exec($ch);
$ticket_response_data = json_decode($ticket_response, true);

// Debugging output
if (curl_errno($ch)) {
    echo 'Erreur cURL: ' . curl_error($ch);
} elseif (isset($ticket_response_data['error'])) {
    echo "Erreur API: " . $ticket_response;
} elseif (isset($ticket_response_data['id'])) {
    echo "Ticket créé avec succès ! Veuillez retourner au menu principal.";
} else {
    echo "Échec de la création du ticket. Réponse : " . $ticket_response;
}

curl_close($ch);
?>
