<?php
header('Content-Type: application/json');

$material_name = $_POST['material_name'];
$app_token = "L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM";

// Read the username and password from log files
$username_file = 'login_username.log';
$password_file = 'login_password.log';

if (!file_exists($username_file) || !file_exists($password_file)) {
    echo json_encode(['error' => 'Username or password file does not exist.']);
    exit();
}

$raw_username_content = file_get_contents($username_file);
$raw_password_content = file_get_contents($password_file);

$encrypted_username = trim($raw_username_content);
$encrypted_username = str_replace('Username: ', '', $encrypted_username); 

$encrypted_password = trim($raw_password_content);
$encrypted_password = str_replace('Password: ', '', $encrypted_password); 

if (empty($encrypted_username) || empty($encrypted_password)) {
    echo json_encode(['error' => 'You must login first.']);
    exit();
}
// Decrypt the username and password
$username = decryptData($encrypted_username, $encryption_key);
$password = decryptData($encrypted_password, $encryption_key);

if (empty($username) || empty($password)) {
    echo json_encode(['error' => 'You must login first.']);
    exit();
}

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

curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/ConsumableItem");
curl_setopt($ch, CURLOPT_POST, 0); 
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Session-Token: $session_token",
    "App-Token: $app_token"
));

$response = curl_exec($ch);
$response_data = json_decode($response, true);

$is_available = false;

foreach ($response_data as $material) {
    // Check if the material name
    if (strcasecmp($material['name'], $material_name) === 0) {
        $material_id = $material['id'];
        
        curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/ConsumableItem/$material_id/Consumable");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json",
            "Session-Token: $session_token",
            "App-Token: $app_token"
        ));
        
        $allocations_response = curl_exec($ch);
        $allocations_data = json_decode($allocations_response, true);
        
        $total = $material['stock_target'];
        $used = 0;
        
        // Calculate the number of used items
        foreach ($allocations_data as $allocation) {
            if (isset($allocation['date_out'])) {
                $used++;
            }
        }

        $unused = $total - $used;
        if ($unused > 0) {
            $is_available = true;
        }
        break;
    }
}

echo json_encode([
    'available' => $is_available,
]);

curl_close($ch);
?>
