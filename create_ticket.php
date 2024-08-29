<?php
session_start();

$app_token = 'L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM';

$encryption_key = 'GCTChatbot'; 
// Function to decrypt the data
function decryptData($data, $key) {
    $data = base64_decode($data);
    list($encrypted_data, $iv) = explode('::', $data, 2); 
    return openssl_decrypt($encrypted_data, 'AES-256-CBC', $key, 0, $iv);
}

$username_file = 'login_username.log';
$password_file = 'login_password.log';

if (!file_exists($username_file) || !file_exists($password_file)) {
    echo "Error: Username or password file does not exist.";
    exit();
}

$raw_username_content = file_get_contents($username_file);
$raw_password_content = file_get_contents($password_file);

$encrypted_username = trim($raw_username_content);
$encrypted_username = str_replace('Username: ', '', $encrypted_username); // Remove the "Username: " prefix

$encrypted_password = trim($raw_password_content);
$encrypted_password = str_replace('Password: ', '', $encrypted_password); // Remove the "Password: " prefix

if (empty($encrypted_username) || empty($encrypted_password)) {
    echo "Vous devez d'abord vous connecter.";
    exit();
}

// Decrypt the password and username
$username = decryptData($encrypted_username, $encryption_key);
$password = decryptData($encrypted_password, $encryption_key);

// Check the timestamp of the last ticket creation
if (isset($_SESSION['last_ticket_time'])) {
    $last_ticket_time = $_SESSION['last_ticket_time'];
    $current_time = time();

    if (($current_time - $last_ticket_time) < 60) { // 60 seconds = 1 minute
        echo "Veuillez attendre une minute avant de créer un autre ticket.";
        exit();
    }
}

// Set the current time as the last ticket creation time
$_SESSION['last_ticket_time'] = time();

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
