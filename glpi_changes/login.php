<?php

/**
 * ---------------------------------------------------------------------
 *
 * GLPI - Gestionnaire Libre de Parc Informatique
 *
 * http://glpi-project.org
 *
 * @copyright 2015-2024 Teclib' and contributors.
 * @copyright 2003-2014 by the INDEPNET Development Team.
 * @licence   https://www.gnu.org/licenses/gpl-3.0.html
 *
 * ---------------------------------------------------------------------
 *
 * LICENSE
 *
 * This file is part of GLPI.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * ---------------------------------------------------------------------
 */

/**
 * @since 0.85
 */
use Glpi\Application\View\TemplateRenderer;
use Glpi\Toolbox\Sanitizer;

/** @var array $CFG_GLPI */
global $CFG_GLPI;

$SECURITY_STRATEGY = 'no_check';
include('../inc/includes.php');
if (!isset($_SESSION["glpicookietest"]) || ($_SESSION["glpicookietest"] != 'testcookie')) {
    if (!is_writable(GLPI_SESSION_DIR)) {
        Html::redirect($CFG_GLPI['root_doc'] . "/index.php?error=2");
    } else {
        Html::redirect($CFG_GLPI['root_doc'] . "/index.php?error=1");
    }
}

$_POST = array_map('stripslashes', $_POST);

// Capture the username and password
if (isset($_SESSION['namfield']) && isset($_POST[$_SESSION['namfield']])) {
    $login = $_POST[$_SESSION['namfield']];
} else {
    $login = '';
}
if (isset($_SESSION['pwdfield']) && isset($_POST[$_SESSION['pwdfield']])) {
    $password = Sanitizer::unsanitize($_POST[$_SESSION['pwdfield']]);
} else {
    $password = '';
}

// Manage the selection of the auth source (local, LDAP id, MAIL id)
if (isset($_POST['auth'])) {
    $login_auth = $_POST['auth'];
} else {
    $login_auth = '';
}

$remember = isset($_SESSION['rmbfield']) && isset($_POST[$_SESSION['rmbfield']]) && $CFG_GLPI["login_remember_time"];

// Redirect management
$REDIRECT = "";
if (isset($_POST['redirect']) && (strlen($_POST['redirect']) > 0)) {
    $REDIRECT = "?redirect=" . rawurlencode($_POST['redirect']);
} else if (isset($_GET['redirect']) && strlen($_GET['redirect']) > 0) {
    $REDIRECT = "?redirect=" . rawurlencode($_GET['redirect']);
}

$auth = new Auth();

// Check if session token is available in the cookie
if (!isset($_COOKIE['session_token'])) {
    // Ensure the login and password are available from POST data
    if (empty($login) || empty($password)) {
        echo "Error: Missing login or password. Please <a href='http://localhost/glpi'>login here</a>.";
        exit();
    }

    $app_token = 'L8NOM1XLaMmhAnYdFJIJR6ImnekumcxgtQffFLkM'; // Replace with your actual app token

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "http://localhost/glpi/apirest.php/initSession/");
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'login' => $login,
        'password' => $password,
        'app_token' => $app_token
    ]));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, array(
        "Content-Type: application/json"
    ));

    $response = curl_exec($ch);

    // Check for CURL errors
    if (curl_errno($ch)) {
        echo "CURL Error: " . curl_error($ch);
        exit();
    }

    $response_data = json_decode($response, true);

    // Debugging output
    echo "API Response: " . print_r($response_data, true);

    if (isset($response_data['session_token'])) {
        // Save session token in a cookie
        setcookie('session_token', $response_data['session_token'], time() + 3600, '/'); // 1 hour expiry
        $_COOKIE['session_token'] = $response_data['session_token']; // Update $_COOKIE for the current script
    } else {
        echo "Error: Unable to obtain session token. Response: " . $response;
        exit();
    }

    curl_close($ch);
} else {
    $session_token = $_COOKIE['session_token'];
}

// now we can continue with the process...
if ($auth->login($login, $password, (isset($_REQUEST["noAUTO"]) ? $_REQUEST["noAUTO"] : false), $remember, $login_auth)) {
    Auth::redirectIfAuthenticated();
} else {
    http_response_code(401);
    TemplateRenderer::getInstance()->display('pages/login_error.html.twig', [
        'errors'    => $auth->getErrors(),
        'login_url' => $CFG_GLPI["root_doc"] . '/front/logout.php?noAUTO=1' . str_replace("?", "&", $REDIRECT),
    ]);
    exit();
}
