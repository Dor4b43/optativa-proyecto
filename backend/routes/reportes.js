const express = require('express');
const router = express.Router();
const db = require('../db');

// Reporte de Stock Bajo
router.get('/stock-bajo', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_stock_bajo');
    res.json(rows);
  } catch (err) { next(err); }
});

// Ocupación de canchas
router.get('/ocupacion', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_ocupacion_canchas');
    res.json(rows);
  } catch (err) { next(err); }
});

// Estadísticas de usuario
router.get('/estadisticas-usuarios', async (req, res, next) => {
  try {
    const [rows] = await db.query('SELECT * FROM v_estadisticas_usuario');
    res.json(rows);
  } catch (err) { next(err); }
});

// Obtener métricas generales para el dashboard
router.get('/dashboard', async (req, res, next) => {
  try {
    const [[{total_reservas}]] = await db.query('SELECT COUNT(*) as total_reservas FROM reservas WHERE DATE(fecha) = CURDATE()');
    const [[{ingresos_hoy}]] = await db.query('SELECT COALESCE(SUM(precio_total), 0) as ingresos_hoy FROM reservas WHERE DATE(fecha) = CURDATE() AND estado != "cancelada"');
    const [[{stock_bajo}]] = await db.query('SELECT COUNT(*) as stock_bajo FROM v_stock_bajo');
    
    res.json({
      reservas_hoy: total_reservas,
      ingresos_hoy: ingresos_hoy,
      alertas_stock: stock_bajo
    });
  } catch (err) { next(err); }
});

module.exports = router;
