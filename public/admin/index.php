<?php
declare(strict_types=1);

require_once __DIR__ . '/../cms/bootstrap.php';

$error = '';
$message = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'login') {
    if (!cms_verify_csrf($_POST['csrf'] ?? null)) {
        $error = 'Sesión inválida. Recarga e intenta nuevamente.';
    } elseif (hash_equals(ADMIN_USERNAME, (string) ($_POST['username'] ?? '')) && password_verify((string) ($_POST['password'] ?? ''), ADMIN_PASSWORD_HASH)) {
        session_regenerate_id(true);
        $_SESSION['cms_admin'] = true;
        header('Location: /admin/');
        exit;
    } else {
        $error = 'Usuario o contraseña incorrectos.';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'save') {
    cms_require_login();

    if (!cms_verify_csrf($_POST['csrf'] ?? null)) {
        $error = 'Sesión inválida. Recarga e intenta nuevamente.';
    } else {
        $decoded = json_decode((string) ($_POST['payload'] ?? ''), true);
        if (!is_array($decoded)) {
            $error = 'El JSON no es válido. Revisa comas, comillas y llaves.';
        } else {
            try {
                cms_save_payload($decoded);
                $message = 'Contenido actualizado correctamente.';
            } catch (Throwable $e) {
                $error = 'No se pudo guardar el contenido.';
            }
        }
    }
}

$isLoggedIn = cms_is_logged_in();
$payload = $isLoggedIn ? cms_get_payload() : [];
$payloadJson = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
?>
<!doctype html>
<html lang="es">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex,nofollow">
    <title>Panel de administración</title>
    <style>
      :root { color-scheme: dark; --bg: #05060a; --panel: #10142a; --text: #edeef2; --muted: #9598a8; --accent: #f2c879; --danger: #ff6b6b; --ok: #2ed9c3; }
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; background: radial-gradient(circle at 50% 0%, #191f3d, var(--bg) 45%); color: var(--text); font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
      main { width: min(1080px, calc(100% - 32px)); margin: 0 auto; padding: 48px 0; }
      .panel { border: 1px solid rgb(237 238 242 / 12%); border-radius: 24px; background: rgb(16 20 42 / 82%); box-shadow: 0 24px 80px rgb(0 0 0 / 38%); backdrop-filter: blur(16px); padding: 28px; }
      h1 { margin: 0 0 8px; font-size: clamp(28px, 4vw, 44px); letter-spacing: -0.03em; }
      p { color: var(--muted); line-height: 1.6; }
      label { display: block; margin: 18px 0 8px; font-size: 12px; letter-spacing: .12em; text-transform: uppercase; color: var(--muted); }
      input, textarea { width: 100%; border: 1px solid rgb(237 238 242 / 14%); border-radius: 14px; background: rgb(5 6 10 / 78%); color: var(--text); padding: 13px 14px; font: inherit; outline: none; }
      textarea { min-height: 62vh; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; line-height: 1.55; resize: vertical; }
      input:focus, textarea:focus { border-color: var(--accent); }
      button, .button { display: inline-flex; align-items: center; justify-content: center; border: 0; border-radius: 999px; background: var(--accent); color: #05060a; padding: 12px 18px; font-weight: 800; cursor: pointer; text-decoration: none; }
      .secondary { background: rgb(237 238 242 / 10%); color: var(--text); }
      .actions { display: flex; flex-wrap: wrap; gap: 12px; align-items: center; justify-content: space-between; margin-top: 18px; }
      .alert { border-radius: 14px; padding: 12px 14px; margin: 18px 0; }
      .error { background: rgb(255 107 107 / 14%); color: #ffd6d6; }
      .ok { background: rgb(46 217 195 / 14%); color: #c4fff8; }
      .hint { font-size: 13px; }
    </style>
  </head>
  <body>
    <main>
      <section class="panel">
        <h1>Panel de administración</h1>
        <p>Edita el contenido de la landing desde MySQL. Mantén el JSON válido antes de guardar.</p>

        <?php if ($error): ?><div class="alert error"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>
        <?php if ($message): ?><div class="alert ok"><?= htmlspecialchars($message, ENT_QUOTES, 'UTF-8') ?></div><?php endif; ?>

        <?php if (!$isLoggedIn): ?>
          <form method="post" autocomplete="off">
            <input type="hidden" name="action" value="login">
            <input type="hidden" name="csrf" value="<?= htmlspecialchars(cms_csrf_token(), ENT_QUOTES, 'UTF-8') ?>">
            <label for="username">Usuario</label>
            <input id="username" name="username" required>
            <label for="password">Contraseña</label>
            <input id="password" name="password" type="password" required>
            <div class="actions"><button type="submit">Entrar</button></div>
          </form>
        <?php else: ?>
          <form method="post">
            <input type="hidden" name="action" value="save">
            <input type="hidden" name="csrf" value="<?= htmlspecialchars(cms_csrf_token(), ENT_QUOTES, 'UTF-8') ?>">
            <label for="payload">Contenido JSON</label>
            <textarea id="payload" name="payload" spellcheck="false" required><?= htmlspecialchars((string) $payloadJson, ENT_QUOTES, 'UTF-8') ?></textarea>
            <p class="hint">Consejo: antes de guardar, valida el JSON. Si se rompe, el sitio conserva el contenido estático como respaldo.</p>
            <div class="actions">
              <button type="submit">Guardar cambios</button>
              <a class="button secondary" href="/admin/logout.php">Cerrar sesión</a>
            </div>
          </form>
        <?php endif; ?>
      </section>
    </main>
  </body>
</html>
