<?php
header('Content-Type: application/json');
require_once 'db.php';

$data = json_decode(file_get_contents('php://input'), true);
$email = trim($data['email'] ?? '');
$password = $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'error' => 'Email and password required.']);
    exit;
}

$stmt = $pdo->prepare("SELECT id, name, password, is_admin FROM users WHERE email = ?");
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'error' => 'Invalid credentials.']);
    exit;
}

session_start();
$_SESSION['user'] = [
    'email' => $email,
    'name' => $user['name'],
    'is_admin' => $user['is_admin']
];

echo json_encode(['success' => true, 'user' => [
    'email' => $email,
    'name' => $user['name'],
    'is_admin' => $user['is_admin']
]]);