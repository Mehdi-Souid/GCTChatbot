<?php
$app_token = 'L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM';

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
    echo "You must login first.";
    exit();
}

$ticket_name = $_POST['ticket_name'];
$ticket_description = $_POST['ticket_description'];
$ticket_type = $_POST['type'];  // '1' for incident, '2' for request
$ticket_category = $_POST['category']; // Add your category here

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

    curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/getFullSession");
    curl_setopt($ch, CURLOPT_POST, 0); // GET request
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json",
        "Session-Token: $session_token",
        "App-Token: $app_token"
    ));

    $user_response = curl_exec($ch);
    $user_data = json_decode($user_response, true);

    if (isset($user_data['session']['glpiID'])) {
        $user_id = $user_data['session']['glpiID']; // Extract user ID

        $ticket_data = array(
            "input" => array(
                "name" => $ticket_name,
                "content" => $ticket_description,
                "type" => $ticket_type, // 1 for incident, 2 for request
                "itilcategories_id" => $ticket_category, // Add the category ID
                "_users_id_requester" => $user_id // Use the retrieved user ID
            )
        );

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
            echo "Ticket créé avec succès ! Veuillez retourner au menu principal.";
        } else {
            echo "Échec de la création du ticket. Réponse : " . $ticket_response;
        }
    } else {
        echo "Échec de la récupération des informations de l'utilisateur.";
    }
} else {
    echo "Échec de l'authentification. Veuillez vérifier votre nom d'utilisateur et votre mot de passe.";
}
curl_close($ch);
?>
