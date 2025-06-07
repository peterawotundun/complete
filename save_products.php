<?php
header('Content-Type: application/json');
$data = file_get_contents('php://input');
if ($data) {
    file_put_contents('products.json', $data);
    echo json_encode(['status' => 'success']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'No data received']);
}
?>