const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las reservas con detalles (usando la vista v_reservas_detalle)
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_reservas_detalle ORDER BY fecha DESC, hora_inicio DESC');
    res.json(rows);
  } catch (err) { next(err); }
});

// Crear nueva reserva (ticket)
router.post('/', async (req, res, next) => {
  try {
    const { cancha_id, usuario_id, cliente_nombre, cliente_telefono, fecha, hora_inicio, hora_fin, notas, precio_total, walk_in, creada_por } = req.body;
    const [result] = await db.query(
      `INSERT INTO reservas (cancha_id, usuario_id, cliente_nombre, cliente_telefono, fecha, hora_inicio, hora_fin, notas, precio_total, walk_in, creada_por) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [cancha_id, usuario_id || null, cliente_nombre, cliente_telefono || null, fecha, hora_inicio, hora_fin, notas || null, precio_total || 0, walk_in ? 1 : 0, creada_por || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Reserva creada exitosamente' });
  } catch (err) { next(err); }
});

// Cancelar reserva
router.post('/:id/cancelar', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { motivo } = req.body;
    await db.query('CALL sp_cancelar_reserva(?, ?)', [id, motivo || 'Cancelado por usuario']);
    res.json({ message: 'Reserva cancelada' });
  } catch (err) { next(err); }
});

// Actualizar estado de reserva
router.patch('/:id/estado', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    await db.query('UPDATE reservas SET estado = ? WHERE id = ?', [estado, id]);
    res.json({ message: `Estado actualizado a ${estado}` });
  } catch (err) { next(err); }
});

module.exports = router;
