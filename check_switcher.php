<?php
$material_name = $_POST['material_name'];

$session_token = "3kr02p62jkcno3q1cu0s9h9v9l";
$app_token = "L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM";

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/NetworkEquipment/"); // Adjust URL as necessary
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    "Content-Type: application/json",
    "Session-Token: $session_token",
    "App-Token: $app_token"
));

$response = curl_exec($ch);

if(curl_errno($ch)) {
    echo json_encode(['error' => 'Error:' . curl_error($ch)]);
    exit;
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
