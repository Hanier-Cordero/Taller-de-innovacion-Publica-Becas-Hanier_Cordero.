<?php
declare(strict_types=1);

if (!class_exists('ZipArchive')) {
    http_response_code(500);
    exit('La extensión ZipArchive no está disponible.');
}

function x(string $value): string
{
    return htmlspecialchars($value, ENT_XML1 | ENT_QUOTES, 'UTF-8');
}

function run(string $text, bool $bold = false, string $color = '102F67', int $size = 19): string
{
    return '<w:r><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:sz w:val="'.$size.'"/><w:szCs w:val="'.$size.'"/><w:color w:val="'.$color.'"/>'.($bold ? '<w:b/>' : '').'</w:rPr><w:t xml:space="preserve">'.x($text).'</w:t></w:r>';
}

function p(string $text = '', bool $bold = false, string $align = 'left', string $color = '102F67', int $size = 19, int $before = 0, int $after = 80): string
{
    return '<w:p><w:pPr><w:jc w:val="'.$align.'"/><w:spacing w:before="'.$before.'" w:after="'.$after.'" w:line="260" w:lineRule="auto"/></w:pPr>'.run($text, $bold, $color, $size).'</w:p>';
}

function tableRow(string $label, string $value, bool $header = false): string
{
    $fill = $header ? '0D5EB6' : 'FFFFFF';
    $labelFill = $header ? '0D5EB6' : 'F4F8FD';
    $color = $header ? 'FFFFFF' : '102F67';
    return '<w:tr><w:trPr><w:cantSplit/></w:trPr>'
        .'<w:tc><w:tcPr><w:tcW w:w="5000" w:type="dxa"/><w:shd w:fill="'.$labelFill.'"/><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar></w:tcPr>'.p($label, true, 'left', $color, 18, 0, 0).'</w:tc>'
        .'<w:tc><w:tcPr><w:tcW w:w="5656" w:type="dxa"/><w:shd w:fill="'.$fill.'"/><w:tcMar><w:top w:w="90" w:type="dxa"/><w:left w:w="120" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar></w:tcPr>'.p($value, $header, 'left', $color, 18, 0, 0).'</w:tc></w:tr>';
}

function tableStart(): string
{
    return '<w:tbl><w:tblPr><w:tblW w:w="10656" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:top w:val="single" w:sz="5" w:color="C8D6E6"/><w:left w:val="single" w:sz="5" w:color="C8D6E6"/><w:bottom w:val="single" w:sz="5" w:color="C8D6E6"/><w:right w:val="single" w:sz="5" w:color="C8D6E6"/><w:insideH w:val="single" w:sz="5" w:color="C8D6E6"/><w:insideV w:val="single" w:sz="5" w:color="C8D6E6"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="5000"/><w:gridCol w:w="5656"/></w:tblGrid>';
}

function logoDrawing(): string
{
    return '<w:sdt><w:sdtPr><w:alias w:val="Inserta el logo de la institución"/><w:tag w:val="logo_institucion"/><w:id w:val="18472651"/><w:showingPlcHdr/><w:temporary/></w:sdtPr><w:sdtContent>'.p('Selecciona este espacio e inserta el logo de la institución', true, 'center', '9CB5D3', 14, 190, 190).'</w:sdtContent></w:sdt>';
}

function introBlock(string $text): string
{
    return '<w:tbl><w:tblPr><w:tblW w:w="10656" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid><w:gridCol w:w="10656"/></w:tblGrid><w:tr><w:trPr><w:cantSplit/></w:trPr><w:tc><w:tcPr><w:tcW w:w="10656" w:type="dxa"/><w:tcMar><w:top w:w="30" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="30" w:type="dxa"/><w:right w:w="80" w:type="dxa"/></w:tcMar></w:tcPr>'.p($text, false, 'both', '102F67', 18, 0, 0).'</w:tc></w:tr></w:tbl>';
}

$header = '<w:tbl><w:tblPr><w:tblW w:w="10656" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:bottom w:val="single" w:sz="24" w:color="0D5EB6"/></w:tblBorders></w:tblPr><w:tblGrid><w:gridCol w:w="7600"/><w:gridCol w:w="3056"/></w:tblGrid><w:tr><w:trPr><w:cantSplit/><w:trHeight w:val="1350" w:hRule="atLeast"/></w:trPr><w:tc><w:tcPr><w:tcW w:w="7600" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>'
    .p('CONSTANCIA INSTITUCIONAL', true, 'left', '39A8C2', 17, 0, 35)
    .p('CARTA DE COSTOS', true, 'left', '0D5EB6', 40, 0, 35)
    .p('Becas por Nuestro Futuro', false, 'left', '5F7089', 18, 0, 0)
    .'</w:tc><w:tc><w:tcPr><w:tcW w:w="3056" w:type="dxa"/><w:vAlign w:val="center"/><w:tcMar><w:top w:w="30" w:type="dxa"/><w:left w:w="70" w:type="dxa"/><w:bottom w:w="30" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tcMar></w:tcPr>'.logoDrawing().'</w:tc></w:tr></w:tbl>';

$identity = '<w:tbl><w:tblPr><w:tblW w:w="10656" w:type="dxa"/><w:tblLayout w:type="fixed"/><w:tblBorders><w:left w:val="single" w:sz="28" w:color="39A8C2"/></w:tblBorders><w:shd w:fill="F4F8FD"/></w:tblPr><w:tblGrid><w:gridCol w:w="7376"/><w:gridCol w:w="3280"/></w:tblGrid><w:tr><w:tc><w:tcPr><w:tcW w:w="7376" w:type="dxa"/><w:shd w:fill="F4F8FD"/><w:tcMar><w:top w:w="110" w:type="dxa"/><w:left w:w="150" w:type="dxa"/><w:bottom w:w="110" w:type="dxa"/></w:tcMar></w:tcPr>'.p('Nombre de la carrera: __________________________________', true, 'left', '102F67', 18, 0, 0).'</w:tc><w:tc><w:tcPr><w:tcW w:w="3280" w:type="dxa"/><w:shd w:fill="F4F8FD"/><w:tcMar><w:top w:w="110" w:type="dxa"/><w:left w:w="80" w:type="dxa"/><w:bottom w:w="110" w:type="dxa"/></w:tcMar></w:tcPr>'.p('Año aplicable: __________', true, 'left', '102F67', 18, 0, 0).'</w:tc></w:tr></w:tbl>';

$document = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>'
    .$header
    .p('', false, 'left', '102F67', 10, 0, 60)
    .introBlock('La presente constancia se emite para ser presentada ante la Dirección de Administración de Becas y Crédito Educativo de la Secretaría de Planificación y Programación de la Presidencia (SEGEPLAN), como parte de los requisitos del proceso de solicitud y evaluación de beca.')
    .p('', false, 'left', '102F67', 10, 0, 100).$identity.p('', false, 'left', '102F67', 10, 0, 90)
    .tableStart().tableRow('Concepto de matrícula', 'Información registrada', true).tableRow('Costo de la matrícula', 'Q __________________________').tableRow('Cantidad de matrículas a pagar al año', '________________ matrícula(s)').tableRow('Meses en los que se debe pagar la matrícula', '________________________________________').'</w:tbl>'
    .p('', false, 'left', '102F67', 10, 0, 80)
    .tableStart().tableRow('Concepto de mensualidad', 'Información registrada', true).tableRow('Costo de la mensualidad', 'Q __________________________').tableRow('Cantidad de mensualidades al año', '________________ mensualidad(es)').tableRow('Meses en los que se debe pagar la mensualidad', '________________________________________').tableRow('Fechas específicas de pago (matrícula y/o mensualidades)', '________________________________________').'</w:tbl>'
    .p('Sin otro particular, se extiende la presente.', false, 'left', '102F67', 19, 130, 60)
    .p('Atentamente,', false, 'left', '102F67', 19, 0, 620)
    .p('________________________________________', false, 'left', '102F67', 18, 0, 20)
    .p('Firma y sello del centro de estudio', false, 'left', '102F67', 17, 0, 0)
    .p('Fecha: ______________________________', false, 'left', '102F67', 17, 220, 0)
    .'<w:sectPr><w:footerReference w:type="default" r:id="rIdFooter"/><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="792" w:right="792" w:bottom="850" w:left="792" w:footer="360"/><w:cols w:space="720"/></w:sectPr></w:body></w:document>';

$footer = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:ftr xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">'.p('Carta de costos · Año __________', false, 'right', '5F7089', 15, 60, 0).'</w:ftr>';
$styles = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Arial" w:hAnsi="Arial"/><w:color w:val="102F67"/><w:sz w:val="19"/></w:rPr></w:rPrDefault><w:pPrDefault><w:pPr><w:spacing w:after="80" w:line="260" w:lineRule="auto"/></w:pPr></w:pPrDefault></w:docDefaults></w:styles>';
$contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/><Override PartName="/word/footer1.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.footer+xml"/></Types>';
$packageRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>';
$documentRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdFooter" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/footer" Target="footer1.xml"/><Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>';

$temporary = tempnam(sys_get_temp_dir(), 'carta_costos_');
$zip = new ZipArchive();
if ($zip->open($temporary, ZipArchive::OVERWRITE) !== true) {
    http_response_code(500);
    exit('No fue posible crear la plantilla.');
}
$zip->addFromString('[Content_Types].xml', $contentTypes);
$zip->addFromString('_rels/.rels', $packageRels);
$zip->addFromString('word/document.xml', $document);
$zip->addFromString('word/_rels/document.xml.rels', $documentRels);
$zip->addFromString('word/styles.xml', $styles);
$zip->addFromString('word/footer1.xml', $footer);
$zip->close();

header('Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document');
header('Content-Disposition: attachment; filename="Plantilla_Carta_de_Costos_SEGEPLAN.docx"');
header('Content-Length: '.filesize($temporary));
readfile($temporary);
unlink($temporary);
