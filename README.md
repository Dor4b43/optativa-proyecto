# DeportivosPro – Sistema de Gestión Deportiva

DeportivosPro es una plataforma integral diseñada para la administración eficiente de centros deportivos. El sistema permite gestionar reservas de canchas, control de inventario, mantenimiento de instalaciones y ofrece un portal personalizado para los clientes.

Este proyecto está diseñado con una arquitectura **SPA (Single Page Application)** utilizando tecnologías web modernas para ofrecer una experiencia fluida y profesional.

---

## 🚀 Características Principales

### 🔧 Panel de Administración (Staff/Admin)
- **Dashboard en Tiempo Real:** Visualización de estadísticas clave (reservas del día, ocupación, alertas de stock).
- **Calendario Interactivo:** Control visual de la ocupación de todas las canchas por hora y deporte.
- **Gestión de Reservas:** Creación, edición y cancelación de reservas (incluyendo registros "Walk-in").
- **Control de Inventario:** Monitoreo de stock con alertas críticas, gestión de categorías y ubicación física de productos.
- **Administración de Canchas:** Control del estado operativo (Activo/Mantenimiento) y especificaciones técnicas de cada instalación.

### 👤 Portal del Cliente (Usuario)
- **Dashboard Personalizado:** Resumen de actividad, estadísticas de horas jugadas y deporte favorito.
- **Sistema de Reservas Online:** Proceso de 3 pasos para elegir deporte, cancha y horario con cálculo dinámico de tarifas.
- **Historial de Reservas:** Seguimiento de reservas próximas y pasadas.
- **Perfil y Logros:** Sistema de fidelización basado en logros desbloqueables por actividad.

---

## 🛠️ Stack Tecnológico

- **Frontend:** HTML5 Semántico, CSS3 (Variables, Grid, Flexbox), JavaScript (Vanilla JS).
- **Diseño:** Estética moderna con Inter Google Fonts, iconos SVG dinámicos y paleta de colores profesional.
- **Base de Datos (Proyectada):** MySQL 8.0 (Diseño normalizado en 3FN). El esquema se encuentra en la carpeta `database/`.

---

## 📂 Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

- `index.html`: Estructura principal del sistema, contenedores de secciones y modales.
- `style.css`: Sistema de diseño, tokens de color, componentes reutilizables y media queries para responsividad.
- `app.js`: Lógica de negocio, gestión de estado (simulado), controladores de interfaz y renderizado dinámico.
- `database/`: Directorio que contiene el esquema formal de la base de datos.
  - `deportivos_pro.sql`: Script completo de creación de tablas, vistas, índices y procedimientos almacenados.

---

## 🗄️ Arquitectura de la Base de Datos

La base de datos está diseñada siguiendo las mejores prácticas de normalización (3FN) para garantizar la integridad de los datos.

### Tablas Principales
- `usuarios` / `roles`: Gestión de acceso y perfiles (Admin, Staff, Usuario).
- `deportes`: Catálogo de deportes soportados con metadatos visuales.
- `canchas`: Inventario físico de instalaciones.
- `reservas`: Registro transaccional de alquileres.
- `inventario` / `categorias_inventario`: Gestión de productos y consumibles.
- `logros` / `usuario_logros`: Motor de gamificación.

### Componentes Avanzados Incluidos
- **Vistas (Views):**
  - `v_reservas_detalle`: Información consolidada de reservas para reportes.
  - `v_stock_bajo`: Alertas automáticas de inventario.
  - `v_estadisticas_usuario`: Perfiles detallados de actividad.
- **Procedimientos Almacenados (Stored Procedures):**
  - `sp_cancelar_reserva`: Lógica de cancelación segura.
  - `sp_ajustar_stock`: Manejo atómico de inventario.
  - `sp_verificar_logros`: Motor de reglas para desbloqueo automático de logros.

---

## 🏁 Cómo Empezar

1. **Clonar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   ```
2. **Ejecutar la aplicación:**
   Al ser una aplicación basada en JavaScript nativo, simplemente abre el archivo `index.html` en cualquier navegador moderno. Se recomienda usar **Live Server** para una mejor experiencia de desarrollo.
3. **Credenciales de Prueba:**
   - **Administración:** `admin@deportivospro.com` / `admin123`
   - **Usuario (Juan Pérez):** `juan@mail.com` / `juan123`

---

## 🔮 Futuras Mejoras
- Implementación de un backend real (Node.js/PHP) para conectar con la base de datos MySQL proporcionada.
- Pasarela de pagos integrada para reservas online.
- Generación de reportes en PDF para la administración de inventario.

---
**Autor:** DeportivosPro Dev Team  
**Versión:** 1.0
