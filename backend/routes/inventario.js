const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todo el inventario
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT i.*, c.nombre as category 
      FROM inventario i
      JOIN categorias_inventario c ON i.categoria_id = c.id
      WHERE i.activo = TRUE
    `);
    res.json(rows);
  } catch (err) { next(err); }
});

// Obtener categorías de inventario
router.get('/categorias', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias_inventario');
    res.json(rows);
  } catch (err) { next(err); }
});

// Crear nuevo producto
router.post('/', async (req, res, next) => {
  try {
    const { nombre, categoria_id, stock, stock_minimo, precio, ubicacion } = req.body;
    const [result] = await db.query(
      'INSERT INTO inventario (nombre, categoria_id, stock, stock_minimo, precio, ubicacion) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, categoria_id || 1, stock || 0, stock_minimo || 5, precio, ubicacion]
    );
    res.status(201).json({ id: result.insertId, message: 'Producto creado exitosamente' });
  } catch (err) { next(err); }
});

// Actualizar producto
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, categoria_id, stock, stock_minimo, precio, ubicacion } = req.body;
    await db.query(
      'UPDATE inventario SET nombre=?, categoria_id=?, stock=?, stock_minimo=?, precio=?, ubicacion=? WHERE id=?',
      [nombre, categoria_id || 1, stock, stock_minimo, precio, ubicacion, id]
    );
    res.json({ message: 'Producto actualizado' });
  } catch (err) { next(err); }
});

// Eliminar (soft delete) producto
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await db.query('UPDATE inventario SET activo = FALSE WHERE id=?', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) { next(err); }
});

// Ajustar stock (+/-)
router.patch('/:id/stock', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { delta } = req.body;
    await db.query('CALL sp_ajustar_stock(?, ?)', [id, delta]);
    res.json({ message: 'Stock ajustado' });
  } catch (err) { next(err); }
});

module.exports = router;
