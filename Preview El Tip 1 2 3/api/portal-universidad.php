<?php
declare(strict_types=1);
require __DIR__.'/config.php';
const UNIVERSITY_CODE='UVG';
const UNIVERSITY_NAME='Universidad del Valle de Guatemala';

if($_SERVER['REQUEST_METHOD']==='GET'){
 $stmt=db()->prepare('SELECT pensum,calendarios,catalogos,actualizado_en FROM portal_centro_datos WHERE codigo_universidad=?');$stmt->execute([UNIVERSITY_CODE]);$row=$stmt->fetch();
 if(!$row)jsonResponse(['ok'=>true,'exists'=>false,'universidad'=>UNIVERSITY_NAME]);
 jsonResponse(['ok'=>true,'exists'=>true,'universidad'=>UNIVERSITY_NAME,'pensum'=>json_decode($row['pensum'],true),'calendarios'=>json_decode($row['calendarios'],true),'catalogos'=>json_decode($row['catalogos'],true),'actualizado_en'=>$row['actualizado_en']]);
}
if($_SERVER['REQUEST_METHOD']==='POST'){
 $input=json_decode(file_get_contents('php://input'),true);if(!is_array($input)||!is_array($input['pensum']??null)||!is_array($input['calendarios']??null)||!is_array($input['catalogos']??null))jsonResponse(['ok'=>false,'error'=>'Datos inválidos.'],422);
 $stmt=db()->prepare('INSERT INTO portal_centro_datos (codigo_universidad,nombre_universidad,pensum,calendarios,catalogos) VALUES (?,?,?,?,?) ON DUPLICATE KEY UPDATE nombre_universidad=VALUES(nombre_universidad),pensum=VALUES(pensum),calendarios=VALUES(calendarios),catalogos=VALUES(catalogos)');
 $stmt->execute([UNIVERSITY_CODE,UNIVERSITY_NAME,json_encode($input['pensum'],JSON_UNESCAPED_UNICODE),json_encode($input['calendarios'],JSON_UNESCAPED_UNICODE),json_encode($input['catalogos'],JSON_UNESCAPED_UNICODE)]);
 jsonResponse(['ok'=>true,'message'=>'Datos guardados correctamente.']);
}
jsonResponse(['ok'=>false,'error'=>'Método no permitido.'],405);
