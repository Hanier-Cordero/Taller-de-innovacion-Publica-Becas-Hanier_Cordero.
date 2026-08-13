<?php
declare(strict_types=1);
require __DIR__.'/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') jsonResponse(['ok'=>false,'error'=>'Método no permitido.'], 405);
$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) jsonResponse(['ok'=>false,'error'=>'Datos inválidos.'], 400);

$required = ['nombre','correo','departamento','municipio','respuestas','afinidades','carreras','centros','calificacion'];
foreach ($required as $field) if (!isset($input[$field])) jsonResponse(['ok'=>false,'error'=>'Falta el campo '.$field.'.'], 422);

$nombre = trim((string)$input['nombre']);
$correo = trim((string)$input['correo']);
$departamento = trim((string)$input['departamento']);
$municipio = trim((string)$input['municipio']);
$calificacion = (int)$input['calificacion'];
if ($nombre === '' || !filter_var($correo, FILTER_VALIDATE_EMAIL) || $departamento === '' || $municipio === '' || $calificacion < 1 || $calificacion > 5) {
    jsonResponse(['ok'=>false,'error'=>'Los datos personales o la calificación no son válidos.'], 422);
}
if (!is_array($input['respuestas']) || count($input['respuestas']) !== 24) jsonResponse(['ok'=>false,'error'=>'El test debe contener 24 respuestas.'], 422);

$sql = 'INSERT INTO test_historial (nombre,correo,departamento,municipio,respuestas,afinidades,carreras_recomendadas,centros_mostrados,calificacion,comentario,ip_hash) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '').'|becas-test');
$stmt = db()->prepare($sql);
$stmt->execute([
    mb_substr($nombre,0,180), mb_substr($correo,0,190), mb_substr($departamento,0,100), mb_substr($municipio,0,120),
    json_encode($input['respuestas'], JSON_UNESCAPED_UNICODE), json_encode($input['afinidades'], JSON_UNESCAPED_UNICODE),
    json_encode($input['carreras'], JSON_UNESCAPED_UNICODE), json_encode($input['centros'], JSON_UNESCAPED_UNICODE),
    $calificacion, mb_substr(trim((string)($input['comentario'] ?? '')),0,5000), $ipHash
]);
jsonResponse(['ok'=>true,'id'=>(int)db()->lastInsertId(),'message'=>'Resultado guardado correctamente.'], 201);
