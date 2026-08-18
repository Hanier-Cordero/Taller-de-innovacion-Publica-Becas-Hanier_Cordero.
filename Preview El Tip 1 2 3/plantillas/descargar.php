<?php
declare(strict_types=1);

$templates = [
    'pensum' => 'plantilla-pensum.csv',
    'calendario' => 'plantilla-calendario.csv',
];
$type = (string)($_GET['tipo'] ?? '');
if (!isset($templates[$type])) {
    http_response_code(404);
    exit('Plantilla no encontrada.');
}
$filename = $templates[$type];
$path = __DIR__.DIRECTORY_SEPARATOR.$filename;
if (!is_file($path)) {
    http_response_code(404);
    exit('Archivo no encontrado.');
}

header('Content-Type: text/csv; charset=UTF-8');
header('Content-Disposition: attachment; filename="'.$filename.'"');
header('Content-Length: '.((int)filesize($path) + 3));
header('Cache-Control: no-store, no-cache, must-revalidate');
echo "\xEF\xBB\xBF";
readfile($path);
