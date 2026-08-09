<?php
// Copia este archivo como config.php en el hosting. No subas config.php a Git.

declare(strict_types=1);

const DB_HOST = 'localhost';
const DB_NAME = 'cpanel_usuario_basedatos';
const DB_USER = 'cpanel_usuario_dbuser';
const DB_PASS = 'CAMBIAR_PASSWORD_MYSQL';
const DB_CHARSET = 'utf8mb4';

const ADMIN_USERNAME = 'admin';

// Genera un hash con:
// php -r "echo password_hash('TU_PASSWORD_SEGURO', PASSWORD_DEFAULT), PHP_EOL;"
const ADMIN_PASSWORD_HASH = '$2y$10$REEMPLAZAR_POR_HASH_REAL';

// Cambia este valor por una cadena aleatoria larga antes de publicar.
const CMS_SESSION_NAME = 'cielo_austral_admin';
