<?php
// Clear the username log file
file_put_contents('login_username.log', ''); // Clears the file

// Clear the password log file
file_put_contents('login_password.log', ''); // Clears the file

echo "Logout process completed and logs cleared.";
?>
