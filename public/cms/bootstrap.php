<?php
declare(strict_types=1);

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    exit('CMS config.php no existe. Copia public/cms/config.example.php como config.php y configura MySQL.');
}

require_once $configPath;

session_name(CMS_SESSION_NAME);
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
    'httponly' => true,
    'samesite' => 'Lax',
]);
session_start();

function cms_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function cms_json_response(array $payload, int $status = 200): void
{
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function cms_is_logged_in(): bool
{
    return !empty($_SESSION['cms_admin']) && $_SESSION['cms_admin'] === true;
}

function cms_require_login(): void
{
    if (!cms_is_logged_in()) {
        header('Location: /admin/');
        exit;
    }
}

function cms_csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }

    return $_SESSION['csrf_token'];
}

function cms_verify_csrf(?string $token): bool
{
    return is_string($token) && hash_equals($_SESSION['csrf_token'] ?? '', $token);
}

function cms_get_payload(): array
{
    $stmt = cms_db()->prepare('SELECT content_value FROM cms_content WHERE content_key = :key LIMIT 1');
    $stmt->execute(['key' => 'site_payload']);
    $row = $stmt->fetch();

    if (!$row) {
        return [];
    }

    $payload = json_decode((string) $row['content_value'], true);
    return is_array($payload) ? $payload : [];
}

function cms_save_payload(array $payload): void
{
    $json = json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
    if (!is_string($json)) {
        throw new RuntimeException('No se pudo serializar el contenido.');
    }

    $stmt = cms_db()->prepare(
        'INSERT INTO cms_content (content_key, content_value) VALUES (:key, :value)
         ON DUPLICATE KEY UPDATE content_value = VALUES(content_value), updated_at = CURRENT_TIMESTAMP'
    );
    $stmt->execute(['key' => 'site_payload', 'value' => $json]);
}
