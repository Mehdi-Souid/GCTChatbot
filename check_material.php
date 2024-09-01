<?php
header('Content-Type: application/json');


$material_name = $_POST['material_name'];
$app_token = "L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM";
$encryption_key = 'GCTChatbot';

// Function to decrypt the data
function decryptData($data, $key) {
    $data = base64_decode($data);
    list($encrypted_data, $iv) = explode('::', $data, 2); 
    return openssl_decrypt($encrypted_data, 'AES-256-CBC', $key, 0, $iv);
}

// Read the username and password from log files
$username_file = 'login_username.log';
$password_file = 'login_password.log';

if (!file_exists($username_file) || !file_exists($password_file)) {
    echo json_encode(['error' => 'Username or password file does not exist.']);
    exit();
}

$raw_username_content = file_get_contents($username_file);
$raw_password_content = file_get_contents($password_file);

$encrypted_username = trim(str_replace('Username: ', '', $raw_username_content)); 
$encrypted_password = trim(str_replace('Password: ', '', $raw_password_content)); 

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
if (curl_errno($ch)) {
    echo json_encode(['error' => 'cURL error: ' . curl_error($ch)]);
    curl_close($ch);
    exit();
}

$login_response_data = json_decode($login_response, true);

if (isset($login_response_data['session_token'])) {
    $session_token = $login_response_data['session_token'];
} else {
    echo json_encode(['error' => 'Authentication failed.']);
    curl_close($ch);
    exit();
}

// Fetch cartridges
curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/CartridgeItem");
curl_setopt($ch, CURLOPT_POST, 0); 
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Session-Token: $session_token",
    "App-Token: $app_token"
));

$response = curl_exec($ch);
$response_data = json_decode($response, true);

$is_available = false;
$log_file = 'test.log';

foreach ($response_data as $material) {
    if (strcasecmp($material['name'], $material_name) === 0) {
        $material_id = $material['id'];
        
        // Fetch allocations for the material
        curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/CartridgeItem/$material_id/Cartridge");
        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json",
            "Session-Token: $session_token",
            "App-Token: $app_token"
        ));
        
        $allocations_response = curl_exec($ch);
        $allocations_data = json_decode($allocations_response, true);
        
        $checked_in = 0;
        $checked_out = 0;

        // Calculate the number of checked in and checked out items
        foreach ($allocations_data as $allocation) {
            if (isset($allocation['date_in']) && !empty($allocation['date_in'])) {
                $checked_in++;
            }
            if (isset($allocation['date_use']) && !empty($allocation['date_use'])) {
                $checked_out++;
            }
        }

        $available = $checked_in - $checked_out;
        if ($available > 0) {
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
