const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const inventarioRoutes = require('./backend/routes/inventario');
const reservasRoutes = require('./backend/routes/reservas');
const reportesRoutes = require('./backend/routes/reportes');
const canchasRoutes = require('./backend/routes/canchas');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend
app.use(express.static(path.join(__dirname)));

// Rutas de la API
app.use('/api/inventario', inventarioRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/reportes', reportesRoutes);
app.use('/api/canchas', canchasRoutes);

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Ocurrió un error en el servidor', details: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de DeportivosPro ejecutándose en el puerto ${PORT}`);
});
