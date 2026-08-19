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
    $pdo->exec("CREATE TABLE IF NOT EXISTS centros_estudio (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(220) NOT NULL,
        tipo VARCHAR(100) NULL,
        sector VARCHAR(50) NULL,
        departamento VARCHAR(100) NOT NULL,
        municipio VARCHAR(120) NOT NULL,
        direccion VARCHAR(500) NULL,
        telefono VARCHAR(150) NULL,
        sitio_web VARCHAR(500) NULL,
        activo TINYINT(1) NOT NULL DEFAULT 1,
        creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_centro_ubicacion (nombre, departamento, municipio),
        INDEX idx_centro_activo_ubicacion (activo, departamento, municipio), INDEX idx_centro_nombre (nombre)
    ) ENGINE=InnoDB");
    $pdo->exec("CREATE TABLE IF NOT EXISTS portal_centro_datos (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        codigo_universidad VARCHAR(30) NOT NULL,
        nombre_universidad VARCHAR(180) NOT NULL,
        pensum JSON NOT NULL,
        calendarios JSON NOT NULL,
        catalogos JSON NOT NULL,
        creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_portal_universidad (codigo_universidad)
    ) ENGINE=InnoDB");
    $column = $pdo->prepare("SELECT COUNT(*) FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=? AND TABLE_NAME='portal_centro_datos' AND COLUMN_NAME='cartas_costos'");
    $column->execute([DB_NAME]);
    if (!(int)$column->fetchColumn()) $pdo->exec("ALTER TABLE portal_centro_datos ADD COLUMN cartas_costos JSON NULL AFTER calendarios");
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
