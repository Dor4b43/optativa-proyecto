-- ============================================================
--  DeportivosPro — Base de datos MySQL normalizada (3FN)
--  Autor   : DeportivosPro Dev Team
--  Versión : 1.0
-- ============================================================

CREATE DATABASE IF NOT EXISTS deportivos_pro
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE deportivos_pro;

-- ============================================================
--  1. ROLES
-- ============================================================
CREATE TABLE roles (
  id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(30)  NOT NULL UNIQUE,
  descripcion VARCHAR(120)
) ENGINE=InnoDB;

INSERT INTO roles (nombre, descripcion) VALUES
  ('Administrador', 'Acceso total al sistema'),
  ('Staff',         'Acceso operativo limitado'),
  ('Usuario',       'Cliente del portal deportivo');

-- ============================================================
--  2. DEPORTES
-- ============================================================
CREATE TABLE deportes (
  id        TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre    VARCHAR(40) NOT NULL UNIQUE,
  clave     VARCHAR(20) NOT NULL UNIQUE,
  emoji     VARCHAR(10),
  color_hex CHAR(7)     NOT NULL
) ENGINE=InnoDB;

INSERT INTO deportes (nombre, clave, emoji, color_hex) VALUES
  ('Fútbol',      'futbol',     '⚽', '#2563EB'),
  ('Tenis',       'tenis',      '🎾', '#10B981'),
  ('Baloncesto',  'baloncesto', '🏀', '#F59E0B'),
  ('Voleibol',    'voleibol',   '🏐', '#8B5CF6');

-- ============================================================
--  3. USUARIOS
-- ============================================================
CREATE TABLE usuarios (
  id                   INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre               VARCHAR(100) NOT NULL,
  email                VARCHAR(150) NOT NULL UNIQUE,
  password_hash        VARCHAR(255) NOT NULL,
  telefono             VARCHAR(20),
  rol_id               TINYINT UNSIGNED NOT NULL,
  deporte_favorito_id  TINYINT UNSIGNED,
  fecha_registro       DATE         NOT NULL DEFAULT (CURDATE()),
  activo               BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at           TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_usuarios_rol
    FOREIGN KEY (rol_id)              REFERENCES roles(id),
  CONSTRAINT fk_usuarios_deporte
    FOREIGN KEY (deporte_favorito_id) REFERENCES deportes(id)
) ENGINE=InnoDB;

-- Contraseñas almacenadas como hash SHA-256 de los valores de prueba
INSERT INTO usuarios (nombre, email, password_hash, telefono, rol_id, deporte_favorito_id, fecha_registro) VALUES
  ('Administrador',    'admin@deportivospro.com',  SHA2('admin123', 256),  NULL,                1, NULL, '2023-01-01'),
  ('Staff',            'staff@deportivospro.com',  SHA2('staff123', 256),  NULL,                2, NULL, '2023-01-01'),
  ('Juan Pérez',       'juan@mail.com',             SHA2('juan123',  256),  '+57 310 123 4567',  3,    1, '2024-01-15'),
  ('María González',   'maria@mail.com',            SHA2('maria123', 256),  '+57 320 987 6543',  3,    2, '2023-03-10'),
  ('Carlos Rodríguez', 'carlos@mail.com',           SHA2('carlos123',256),  '+57 300 456 7890',  3,    3, '2025-06-20');

-- ============================================================
--  4. CANCHAS
-- ============================================================
CREATE TABLE canchas (
  id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre      VARCHAR(60)  NOT NULL,
  tipo        VARCHAR(80),
  deporte_id  TINYINT UNSIGNED NOT NULL,
  estado      ENUM('Activo','Mantenimiento','Inactivo') NOT NULL DEFAULT 'Activo',
  superficie  VARCHAR(60),
  dimensiones VARCHAR(40),
  capacidad   VARCHAR(40),
  tarifa_hora DECIMAL(8,2) NOT NULL,
  iluminacion BOOLEAN      NOT NULL DEFAULT FALSE,
  techada     BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_canchas_deporte
    FOREIGN KEY (deporte_id) REFERENCES deportes(id)
) ENGINE=InnoDB;

INSERT INTO canchas (nombre, tipo, deporte_id, estado, superficie, dimensiones, capacidad, tarifa_hora, iluminacion, techada) VALUES
  ('Fútbol 1',     'Fútbol - Fútbol 5',   1, 'Activo',        'Césped Sintético', '40m x 20m',  '10 personas', 35.00, TRUE,  TRUE),
  ('Fútbol 2',     'Fútbol - Fútbol 7',   1, 'Activo',        'Césped Natural',   '60m x 30m',  '14 personas', 45.00, TRUE,  FALSE),
  ('Tenis 1',      'Tenis - Singles',      2, 'Activo',        'Arcilla',          '23m x 11m',  '4 personas',  20.00, TRUE,  TRUE),
  ('Baloncesto 1', 'Baloncesto - 5vs5',    3, 'Activo',        'Parqué',           '28m x 15m',  '10 personas', 40.00, TRUE,  TRUE),
  ('Voleibol 1',   'Voleibol - 6vs6',      4, 'Activo',        'Arena',            '18m x 9m',   '12 personas', 30.00, FALSE, FALSE),
  ('Fútbol 3',     'Fútbol - Fútbol 11',  1, 'Mantenimiento', 'Césped Natural',   '100m x 64m', '22 personas', 90.00, TRUE,  FALSE);

-- ============================================================
--  5. RESERVAS
-- ============================================================
CREATE TABLE reservas (
  id                  INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  cancha_id           TINYINT UNSIGNED NOT NULL,
  usuario_id          INT UNSIGNED,                   -- NULL = walk-in
  cliente_nombre      VARCHAR(100) NOT NULL,
  cliente_telefono    VARCHAR(20),
  fecha               DATE         NOT NULL,
  hora_inicio         TIME         NOT NULL,
  hora_fin            TIME         NOT NULL,
  estado              ENUM('confirmada','cancelada','completada') NOT NULL DEFAULT 'confirmada',
  motivo_cancelacion  TEXT,
  notas               TEXT,
  precio_total        DECIMAL(8,2) NOT NULL,
  walk_in             BOOLEAN      NOT NULL DEFAULT FALSE,
  creada_por          INT UNSIGNED,                   -- admin que creó la reserva
  created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reservas_cancha
    FOREIGN KEY (cancha_id)  REFERENCES canchas(id),
  CONSTRAINT fk_reservas_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT fk_reservas_admin
    FOREIGN KEY (creada_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  CONSTRAINT chk_horario
    CHECK (hora_fin > hora_inicio)
) ENGINE=InnoDB;

INSERT INTO reservas (cancha_id, usuario_id, cliente_nombre, cliente_telefono, fecha, hora_inicio, hora_fin, estado, precio_total, walk_in, creada_por) VALUES
  -- Reservas de Juan Pérez (usuario_id = 3)
  (1, 3, 'Juan Pérez',       '+57 310 123 4567', '2026-02-16', '10:00', '11:00', 'completada', 35.00, FALSE, NULL),
  (2, 3, 'Juan Pérez',       '+57 310 123 4567', '2026-03-02', '14:00', '16:00', 'completada', 90.00, FALSE, NULL),
  (1, 3, 'Juan Pérez',       '+57 310 123 4567', '2026-04-20', '09:00', '10:00', 'confirmada', 35.00, FALSE, NULL),
  (3, 3, 'Juan Pérez',       '+57 310 123 4567', '2025-12-15', '11:00', '12:00', 'completada', 20.00, FALSE, NULL),
  (1, 3, 'Juan Pérez',       '+57 310 123 4567', '2025-11-28', '16:00', '18:00', 'completada', 70.00, FALSE, NULL),
  (2, 3, 'Juan Pérez',       '+57 310 123 4567', '2025-10-10', '10:00', '11:00', 'completada', 45.00, FALSE, NULL),
  -- Reservas de María González (usuario_id = 4)
  (3, 4, 'María González',   '+57 320 987 6543', '2026-02-16', '11:00', '12:00', 'completada', 20.00, FALSE, NULL),
  (3, 4, 'María González',   '+57 320 987 6543', '2026-04-22', '10:00', '12:00', 'confirmada', 40.00, FALSE, NULL),
  (4, 4, 'María González',   '+57 320 987 6543', '2026-03-15', '15:00', '17:00', 'confirmada', 80.00, FALSE, NULL),
  (3, 4, 'María González',   '+57 320 987 6543', '2025-11-20', '09:00', '10:00', 'completada', 20.00, FALSE, NULL),
  (3, 4, 'María González',   '+57 320 987 6543', '2025-10-05', '11:00', '12:30', 'completada', 30.00, FALSE, NULL),
  (3, 4, 'María González',   '+57 320 987 6543', '2025-09-18', '14:00', '16:00', 'completada', 40.00, FALSE, NULL),
  (3, 4, 'María González',   '+57 320 987 6543', '2025-08-10', '10:00', '11:00', 'completada', 20.00, FALSE, NULL),
  (5, 4, 'María González',   '+57 320 987 6543', '2025-07-22', '16:00', '17:00', 'completada', 30.00, FALSE, NULL),
  -- Reservas de Carlos Rodríguez (usuario_id = 5)
  (4, 5, 'Carlos Rodríguez', '+57 300 456 7890', '2026-04-16', '14:00', '15:30', 'confirmada', 60.00, FALSE, NULL),
  (1, 5, 'Carlos Rodríguez', '+57 300 456 7890', '2025-12-28', '10:00', '11:00', 'completada', 35.00, FALSE, NULL),
  (4, 5, 'Carlos Rodríguez', '+57 300 456 7890', '2025-11-15', '16:00', '17:30', 'completada', 60.00, FALSE, NULL),
  -- Otras reservas del calendario (sin usuario registrado o admin)
  (1, NULL, 'Ana Martínez',  NULL, '2026-02-16', '15:00', '16:30', 'confirmada', 52.50, FALSE, 1),
  (5, NULL, 'Luis Sánchez',  NULL, '2026-02-16', '17:00', '18:00', 'confirmada', 30.00, FALSE, 1),
  (3, NULL, 'Ana Martínez',  NULL, '2026-04-25', '11:00', '12:30', 'confirmada', 30.00, FALSE, 1),
  (2, NULL, 'Luis Sánchez',  NULL, '2026-04-28', '08:00', '09:00', 'confirmada', 45.00, FALSE, 1);

-- ============================================================
--  6. CATEGORÍAS DE INVENTARIO
-- ============================================================
CREATE TABLE categorias_inventario (
  id     TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(60) NOT NULL UNIQUE
) ENGINE=InnoDB;

INSERT INTO categorias_inventario (nombre) VALUES
  ('Balones'),
  ('Equipamiento'),
  ('Ropa'),
  ('Calzado');

-- ============================================================
--  7. INVENTARIO
-- ============================================================
CREATE TABLE inventario (
  id            SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre        VARCHAR(100) NOT NULL,
  categoria_id  TINYINT UNSIGNED NOT NULL,
  stock         SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  stock_minimo  SMALLINT UNSIGNED NOT NULL DEFAULT 5,
  precio        DECIMAL(8,2),
  ubicacion     VARCHAR(80),
  activo        BOOLEAN   NOT NULL DEFAULT TRUE,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventario_categoria
    FOREIGN KEY (categoria_id) REFERENCES categorias_inventario(id)
) ENGINE=InnoDB;

INSERT INTO inventario (nombre, categoria_id, stock, stock_minimo, precio, ubicacion) VALUES
  ('Balones de Fútbol',      1,  3,  10, 25.99,  'Almacén A'),
  ('Balones de Baloncesto',  1, 12,   5, 29.99,  'Almacén A'),
  ('Redes de Voleibol',      2,  1,   3, 89.99,  'Almacén B'),
  ('Raquetas de Tenis',      2,  4,   8, 79.99,  'Almacén B'),
  ('Conos de Entrenamiento', 2, 25,  10, 12.99,  'Almacén A'),
  ('Chalecos Deportivos',    3, 18,  10, 19.99,  'Almacén C'),
  ('Balones de Voleibol',    1,  6,   4, 34.99,  'Almacén A'),
  ('Canastas de Baloncesto', 2,  2,   2, 199.99, 'Almacén B');

-- ============================================================
--  8. LOGROS
-- ============================================================
CREATE TABLE logros (
  id              TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nombre          VARCHAR(80)  NOT NULL,
  descripcion     VARCHAR(200),
  icono           VARCHAR(10),
  criterio_tipo   ENUM('reservas_total','reservas_deporte','antiguedad_meses','multideporte') NOT NULL,
  criterio_valor  INT UNSIGNED NOT NULL DEFAULT 1
) ENGINE=InnoDB;

INSERT INTO logros (nombre, descripcion, icono, criterio_tipo, criterio_valor) VALUES
  ('Primer Reserva',   'Hiciste tu primera reserva',          '🏆', 'reservas_total',    1),
  ('5 Reservas',       'Completaste 5 reservas',              '🔥', 'reservas_total',    5),
  ('10 Reservas',      'Completa 10 reservas',                '🏅', 'reservas_total',   10),
  ('Fan del Fútbol',   'Más de 3 reservas de fútbol',         '⚽', 'reservas_deporte',  3),
  ('Tenista',          'Primera reserva de tenis',            '🎾', 'reservas_deporte',  1),
  ('Basquetbolista',   'Primera reserva de baloncesto',       '🏀', 'reservas_deporte',  1),
  ('Leal',             'Miembro por más de 1 año',            '❤️', 'antiguedad_meses',  12),
  ('Veterano',         'Miembro por más de 2 años',           '🏝️', 'antiguedad_meses',  24),
  ('Multideporte',     'Reservas en 3 deportes distintos',    '🌈', 'multideporte',       3),
  ('Nuevo Miembro',    'Bienvenido a DeportivosPro',          '🌱', 'reservas_total',    1);

-- ============================================================
--  9. LOGROS POR USUARIO
-- ============================================================
CREATE TABLE usuario_logros (
  usuario_id        INT UNSIGNED     NOT NULL,
  logro_id          TINYINT UNSIGNED NOT NULL,
  desbloqueado      BOOLEAN          NOT NULL DEFAULT FALSE,
  fecha_desbloqueo  DATE,
  PRIMARY KEY (usuario_id, logro_id),
  CONSTRAINT fk_ulogros_usuario
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  CONSTRAINT fk_ulogros_logro
    FOREIGN KEY (logro_id)   REFERENCES logros(id)   ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO usuario_logros (usuario_id, logro_id, desbloqueado, fecha_desbloqueo) VALUES
  -- Juan Pérez
  (3,  1, TRUE,  '2024-01-20'),   -- Primer Reserva
  (3,  2, TRUE,  '2024-06-10'),   -- 5 Reservas
  (3,  3, FALSE, NULL),           -- 10 Reservas (bloqueado)
  (3,  4, TRUE,  '2024-08-01'),   -- Fan del Fútbol
  (3,  7, FALSE, NULL),           -- Leal (bloqueado)
  -- María González
  (4,  1, TRUE,  '2023-03-15'),   -- Primer Reserva
  (4,  2, TRUE,  '2023-09-01'),   -- 5 Reservas
  (4,  3, FALSE, NULL),           -- 10 Reservas (bloqueado)
  (4,  5, TRUE,  '2023-03-15'),   -- Tenista
  (4,  7, TRUE,  '2024-03-10'),   -- Leal
  (4,  8, FALSE, NULL),           -- Veterano (bloqueado — aún no 2 años)
  (4,  9, TRUE,  '2024-05-20'),   -- Multideporte
  -- Carlos Rodríguez
  (5,  1, TRUE,  '2025-06-25'),   -- Primer Reserva
  (5,  2, FALSE, NULL),           -- 5 Reservas (bloqueado)
  (5,  3, FALSE, NULL),           -- 10 Reservas (bloqueado)
  (5,  6, TRUE,  '2025-06-25'),   -- Basquetbolista
  (5, 10, TRUE,  '2025-06-20');   -- Nuevo Miembro

-- ============================================================
--  ÍNDICES DE RENDIMIENTO
-- ============================================================
CREATE INDEX idx_reservas_fecha       ON reservas  (fecha);
CREATE INDEX idx_reservas_estado      ON reservas  (estado);
CREATE INDEX idx_reservas_cancha      ON reservas  (cancha_id);
CREATE INDEX idx_reservas_usuario     ON reservas  (usuario_id);
CREATE INDEX idx_inventario_stock     ON inventario (stock);
CREATE INDEX idx_usuarios_rol         ON usuarios   (rol_id);

-- ============================================================
--  VISTAS ÚTILES
-- ============================================================

-- Reservas con información completa
CREATE OR REPLACE VIEW v_reservas_detalle AS
SELECT
  r.id,
  r.fecha,
  r.hora_inicio,
  r.hora_fin,
  r.estado,
  r.precio_total,
  r.walk_in,
  r.notas,
  r.motivo_cancelacion,
  r.cliente_nombre,
  r.cliente_telefono,
  u.nombre          AS usuario_nombre,
  u.email           AS usuario_email,
  c.nombre          AS cancha_nombre,
  c.tipo            AS cancha_tipo,
  c.tarifa_hora,
  d.nombre          AS deporte,
  adm.nombre        AS creada_por
FROM reservas r
LEFT JOIN usuarios  u   ON r.usuario_id  = u.id
LEFT JOIN canchas   c   ON r.cancha_id   = c.id
LEFT JOIN deportes  d   ON c.deporte_id  = d.id
LEFT JOIN usuarios  adm ON r.creada_por  = adm.id;

-- Productos con stock bajo
CREATE OR REPLACE VIEW v_stock_bajo AS
SELECT
  i.id,
  i.nombre,
  cat.nombre  AS categoria,
  i.stock,
  i.stock_minimo,
  i.precio,
  i.ubicacion,
  ROUND((i.stock / i.stock_minimo) * 100, 1) AS pct_stock
FROM inventario i
JOIN categorias_inventario cat ON i.categoria_id = cat.id
WHERE i.stock < i.stock_minimo
  AND i.activo = TRUE
ORDER BY pct_stock ASC;

-- Resumen por usuario (estadísticas del portal)
CREATE OR REPLACE VIEW v_estadisticas_usuario AS
SELECT
  u.id,
  u.nombre,
  u.email,
  u.fecha_registro,
  COUNT(r.id)                                     AS total_reservas,
  COALESCE(SUM(TIME_TO_SEC(TIMEDIFF(r.hora_fin, r.hora_inicio)) / 3600), 0) AS horas_totales,
  COALESCE(SUM(r.precio_total), 0)                AS gasto_total,
  d.nombre                                        AS deporte_favorito,
  TIMESTAMPDIFF(MONTH, u.fecha_registro, CURDATE()) AS meses_activo
FROM usuarios u
LEFT JOIN reservas  r ON r.usuario_id    = u.id
LEFT JOIN deportes  d ON u.deporte_favorito_id = d.id
WHERE u.rol_id = 3
GROUP BY u.id, u.nombre, u.email, u.fecha_registro, d.nombre;

-- Ocupación de canchas (reservas confirmadas futuras)
CREATE OR REPLACE VIEW v_ocupacion_canchas AS
SELECT
  c.id,
  c.nombre,
  c.estado,
  d.nombre                                  AS deporte,
  c.tarifa_hora,
  COUNT(r.id)                               AS reservas_activas,
  COALESCE(SUM(r.precio_total), 0)          AS ingresos_pendientes
FROM canchas  c
LEFT JOIN deportes d ON c.deporte_id = d.id
LEFT JOIN reservas r ON r.cancha_id  = c.id
  AND r.estado = 'confirmada'
  AND r.fecha >= CURDATE()
GROUP BY c.id, c.nombre, c.estado, d.nombre, c.tarifa_hora
ORDER BY reservas_activas DESC;

-- ============================================================
--  PROCEDIMIENTOS ALMACENADOS
-- ============================================================
DELIMITER $$

-- Cancelar una reserva con motivo
CREATE PROCEDURE sp_cancelar_reserva(
  IN p_reserva_id INT UNSIGNED,
  IN p_motivo     TEXT
)
BEGIN
  UPDATE reservas
  SET estado = 'cancelada', motivo_cancelacion = p_motivo
  WHERE id = p_reserva_id AND estado = 'confirmada';

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Reserva no encontrada o ya no está confirmada';
  END IF;
END$$

-- Ajustar stock de un producto (+/-)
CREATE PROCEDURE sp_ajustar_stock(
  IN p_producto_id SMALLINT UNSIGNED,
  IN p_delta       SMALLINT
)
BEGIN
  UPDATE inventario
  SET stock = GREATEST(0, stock + p_delta)
  WHERE id = p_producto_id AND activo = TRUE;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Producto no encontrado o inactivo';
  END IF;
END$$

-- Ver logros desbloqueables de un usuario (check automático)
CREATE PROCEDURE sp_verificar_logros(
  IN p_usuario_id INT UNSIGNED
)
BEGIN
  DECLARE total_res     INT;
  DECLARE meses_activo  INT;
  DECLARE num_deportes  INT;

  SELECT COUNT(*) INTO total_res
  FROM reservas WHERE usuario_id = p_usuario_id AND estado != 'cancelada';

  SELECT TIMESTAMPDIFF(MONTH, fecha_registro, CURDATE()) INTO meses_activo
  FROM usuarios WHERE id = p_usuario_id;

  SELECT COUNT(DISTINCT c.deporte_id) INTO num_deportes
  FROM reservas r
  JOIN canchas c ON r.cancha_id = c.id
  WHERE r.usuario_id = p_usuario_id AND r.estado != 'cancelada';

  -- Desbloquear logros por total de reservas
  UPDATE usuario_logros ul
  JOIN   logros l ON ul.logro_id = l.id
  SET    ul.desbloqueado = TRUE, ul.fecha_desbloqueo = CURDATE()
  WHERE  ul.usuario_id = p_usuario_id
    AND  ul.desbloqueado = FALSE
    AND  l.criterio_tipo = 'reservas_total'
    AND  l.criterio_valor <= total_res;

  -- Desbloquear logros por antigüedad
  UPDATE usuario_logros ul
  JOIN   logros l ON ul.logro_id = l.id
  SET    ul.desbloqueado = TRUE, ul.fecha_desbloqueo = CURDATE()
  WHERE  ul.usuario_id = p_usuario_id
    AND  ul.desbloqueado = FALSE
    AND  l.criterio_tipo = 'antiguedad_meses'
    AND  l.criterio_valor <= meses_activo;

  -- Desbloquear logro multideporte
  UPDATE usuario_logros ul
  JOIN   logros l ON ul.logro_id = l.id
  SET    ul.desbloqueado = TRUE, ul.fecha_desbloqueo = CURDATE()
  WHERE  ul.usuario_id = p_usuario_id
    AND  ul.desbloqueado = FALSE
    AND  l.criterio_tipo = 'multideporte'
    AND  l.criterio_valor <= num_deportes;
END$$

DELIMITER ;
