<?php
header('Content-Type: application/json');

// Retrieve the session token from the cookie
if (!isset($_COOKIE['session_token'])) {
    echo json_encode(['error' => 'No session token found. Please <a href="http://localhost/glpi">login here</a>.']);
    exit();
}

$session_token = $_COOKIE['session_token']; // Retrieve session token from cookie
$app_token = "L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM";

// Get the material name from POST data
$material_name = $_POST['material_name'];

$ch = curl_init();

// Fetch cartridges
curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/CartridgeItem");
curl_setopt($ch, CURLOPT_POST, 0); 
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Session-Token: $session_token",
    "App-Token: $app_token"
));

$response = curl_exec($ch);
if (curl_errno($ch)) {
    echo json_encode(['error' => 'cURL error: ' . curl_error($ch)]);
    curl_close($ch);
    exit();
}

$response_data = json_decode($response, true);

$is_available = false;

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
