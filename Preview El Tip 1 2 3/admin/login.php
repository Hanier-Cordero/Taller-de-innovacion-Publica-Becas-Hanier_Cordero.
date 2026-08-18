<?php
declare(strict_types=1);
session_start();
if (!empty($_SESSION['test_admin'])) { header('Location: index.php'); exit; }
$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $validUser = hash_equals('admin', trim((string)($_POST['usuario'] ?? '')));
    $validPass = password_verify((string)($_POST['password'] ?? ''), '$2y$10$VWsEFSh/pmoIO/LsJvBrFe6hSKMhUEa6vQ5uKgmDsJMrpiUTE0Sa.');
    if ($validUser && $validPass) { session_regenerate_id(true); $_SESSION['test_admin']=true; header('Location: index.php'); exit; }
    $error = 'El usuario o la contraseña no son correctos.';
}
?>
<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Administración del test</title><link rel="icon" href="../assets/becas.ico" sizes="any"><link rel="stylesheet" href="admin.css"></head>
<body class="login-body"><main class="admin-login"><img src="../assets/becas-logo.png" alt="Becas por Nuestro Futuro"><h1>Historial del test</h1><p>Acceso administrativo</p>
<?php if($error): ?><div class="message error"><?=htmlspecialchars($error)?></div><?php endif; ?>
<form method="post"><label>Usuario<input name="usuario" autocomplete="username" required></label><label>Contraseña<input name="password" type="password" autocomplete="current-password" required></label><button>Ingresar</button></form><a href="../index.html">← Volver al portal</a></main></body></html>
