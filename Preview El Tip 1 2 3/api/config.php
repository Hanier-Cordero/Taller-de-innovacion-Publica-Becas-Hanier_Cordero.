<?php
declare(strict_types=1);

const DB_HOST = '127.0.0.1';
const DB_PORT = '3306';
const DB_NAME = 'becas_nuestro_futuro';
const DB_USER = 'root';
const DB_PASS = '';

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    $server = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';charset=utf8mb4', DB_USER, DB_PASS, $options);
    $server->exec('CREATE DATABASE IF NOT EXISTS `'.DB_NAME.'` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci');
    $pdo = new PDO('mysql:host='.DB_HOST.';port='.DB_PORT.';dbname='.DB_NAME.';charset=utf8mb4', DB_USER, DB_PASS, $options);
    $pdo->exec("CREATE TABLE IF NOT EXISTS test_historial (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(180) NOT NULL,
        correo VARCHAR(190) NOT NULL,
        departamento VARCHAR(100) NOT NULL,
        municipio VARCHAR(120) NOT NULL,
        respuestas JSON NOT NULL,
        afinidades JSON NOT NULL,
        carreras_recomendadas JSON NOT NULL,
        centros_mostrados JSON NOT NULL,
        calificacion TINYINT UNSIGNED NOT NULL,
        comentario TEXT NULL,
        estado VARCHAR(20) NOT NULL DEFAULT 'completado',
        ip_hash CHAR(64) NULL,
        creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_fecha (creado_en), INDEX idx_correo (correo), INDEX idx_ubicacion (departamento, municipio)
    ) ENGINE=InnoDB");
    return $pdo;
}

function jsonResponse(array $data, int $status = 200): never
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function requireAdmin(): void
{
    if (session_status() !== PHP_SESSION_ACTIVE) session_start();
    if (empty($_SESSION['test_admin'])) {
        if (str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json')) jsonResponse(['ok'=>false,'error'=>'No autorizado.'], 401);
        header('Location: login.php'); exit;
    }
}
