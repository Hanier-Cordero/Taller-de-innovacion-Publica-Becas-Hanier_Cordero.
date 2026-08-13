<?php
declare(strict_types=1);
require __DIR__.'/config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') jsonResponse(['ok'=>false,'error'=>'Método no permitido.'],405);
$rows=db()->query('SELECT nombre,tipo,sector,departamento,municipio,direccion,telefono,sitio_web FROM centros_estudio WHERE activo=1 ORDER BY departamento,municipio,nombre')->fetchAll();
$departamentos=[];$municipios=[];
foreach($rows as $row){$d=$row['departamento'];$m=$row['municipio'];$departamentos[$d]=true;$municipios[$d][$m]=true;}
$municipiosOut=[];foreach($municipios as $d=>$items){$list=array_keys($items);sort($list,SORT_NATURAL|SORT_FLAG_CASE);$municipiosOut[$d]=$list;}
$departamentosOut=array_keys($departamentos);sort($departamentosOut,SORT_NATURAL|SORT_FLAG_CASE);
jsonResponse(['ok'=>true,'departamentos'=>$departamentosOut,'municipios'=>$municipiosOut,'centros'=>$rows]);
