<?php
declare(strict_types=1);
require __DIR__.'/config.php';
if (PHP_SAPI !== 'cli') { http_response_code(403); exit('Solo CLI'); }
$source=file_get_contents(__DIR__.'/../data/centros-data.js');
$json=preg_replace('/^\s*window\.BECAS_CENTROS_DATA\s*=\s*/','',$source);
$json=preg_replace('/;\s*$/','',$json);
$data=json_decode($json,true,512,JSON_THROW_ON_ERROR);
$stmt=db()->prepare('INSERT INTO centros_estudio (nombre,tipo,sector,departamento,municipio,direccion,telefono,sitio_web) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE tipo=VALUES(tipo),sector=VALUES(sector),direccion=VALUES(direccion),telefono=VALUES(telefono),sitio_web=VALUES(sitio_web)');
$count=0;foreach($data['centros'] as $c){$stmt->execute([$c['nombre'],$c['tipo']??null,$c['sector']??null,$c['departamento'],$c['municipio'],$c['direccion']??null,$c['telefono']??null,$c['sitio_web']??null]);$count++;}
echo "Centros procesados: $count\n";
