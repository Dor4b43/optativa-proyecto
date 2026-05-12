const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las canchas
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT c.*, d.nombre as sport, d.clave as sport_key 
      FROM canchas c
      JOIN deportes d ON c.deporte_id = d.id
      WHERE c.estado != 'Inactivo'
    `);
    res.json(rows);
  } catch (err) { next(err); }
});

// Crear cancha
router.post('/', async (req, res, next) => {
  try {
    const { nombre, tipo, deporte_id, estado, superficie, dimensiones, capacidad, tarifa_hora, iluminacion, techada } = req.body;
    const [result] = await db.query(
      'INSERT INTO canchas (nombre, tipo, deporte_id, estado, superficie, dimensiones, capacidad, tarifa_hora, iluminacion, techada) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nombre, tipo, deporte_id || 1, estado || 'Activo', superficie, dimensiones, capacidad, tarifa_hora || 0, iluminacion ? 1 : 0, techada ? 1 : 0]
    );
    res.status(201).json({ id: result.insertId, message: 'Cancha creada exitosamente' });
  } catch (err) { next(err); }
});

// Actualizar cancha
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, tipo, deporte_id, estado, superficie, dimensiones, capacidad, tarifa_hora, iluminacion, techada } = req.body;
    await db.query(
      'UPDATE canchas SET nombre=?, tipo=?, deporte_id=?, estado=?, superficie=?, dimensiones=?, capacidad=?, tarifa_hora=?, iluminacion=?, techada=? WHERE id=?',
      [nombre, tipo, deporte_id || 1, estado, superficie, dimensiones, capacidad, tarifa_hora, iluminacion ? 1 : 0, techada ? 1 : 0, id]
    );
    res.json({ message: 'Cancha actualizada' });
  } catch (err) { next(err); }
});

// Eliminar (soft delete)
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE canchas SET estado="Inactivo" WHERE id=?', [id]);
    res.json({ message: 'Cancha eliminada' });
  } catch (err) { next(err); }
});

module.exports = router;
