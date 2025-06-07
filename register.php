<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$name || !$email || !$password) {
    echo json_encode(['success' => false, 'error' => 'All fields are required.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id FROM users WHERE email = ?");
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'error' => 'Email already registered.']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$is_admin = 0;
if ($email === 'drrexgadgets@gmail.com') { // Replace with your actual admin email
    $is_admin = 1;
}

$stmt = $pdo->prepare("INSERT INTO users (name, email, password, is_admin) VALUES (?, ?, ?, ?)");
$stmt->execute([$name, $email, $hash, $is_admin]);

session_start();
$_SESSION['user'] = ['email' => $email, 'name' => $name, 'is_admin' => $is_admin];

echo json_encode(['success' => true, 'user' => [
    'email' => $email,
    'name' => $name,
    'is_admin' => $is_admin
]]);