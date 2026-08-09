<?php
declare(strict_types=1);

require_once __DIR__ . '/../cms/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    cms_json_response(['ok' => false, 'error' => 'Method not allowed'], 405);
}

try {
    cms_json_response([
        'ok' => true,
        'content' => cms_get_payload(),
    ]);
} catch (Throwable $e) {
    cms_json_response(['ok' => false, 'error' => 'Content unavailable'], 500);
}
