<?php
if (!empty($_POST['username']) && !empty($_POST['password'])) {
    $username = htmlspecialchars(trim($_POST['username']));
    $password = htmlspecialchars(trim($_POST['password']));

    $encryption_key = 'GCTChatbot'; 
    $cipher_method = 'AES-256-CBC';
    $iv_length = openssl_cipher_iv_length($cipher_method);

    $iv_username = openssl_random_pseudo_bytes($iv_length);

    // Encrypt the username
    $encrypted_username = openssl_encrypt($username, $cipher_method, $encryption_key, 0, $iv_username);
    $encrypted_username = base64_encode($encrypted_username . '::' . $iv_username);

    $iv_password = openssl_random_pseudo_bytes($iv_length);

    $encrypted_password = openssl_encrypt($password, $cipher_method, $encryption_key, 0, $iv_password);
    $encrypted_password = base64_encode($encrypted_password . '::' . $iv_password);

    file_put_contents('login_username.log', ''); // Clears the file

    $log_entry = "Username: $encrypted_username";

    file_put_contents('login_username.log', $log_entry,FILE_APPEND);

    file_put_contents('login_password.log', ''); // Clears the file

    $password_entry = "Password: $encrypted_password";

    file_put_contents('login_password.log', $password_entry,FILE_APPEND);
    
    exit();
} else {
    echo "Error: Username or password not provided.";
}
?>
