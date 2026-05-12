# Guía de Instalación y Despliegue en Linux (Ubuntu/Debian)

Esta guía explica cómo desplegar el proyecto "DeportivosPro" (Frontend + Backend Node.js + Base de Datos MySQL) en un entorno Linux de producción.

## Requisitos Previos

- Un servidor Linux (Ubuntu 20.04/22.04 recomendado).
- Acceso SSH o terminal con privilegios `sudo`.

## 1. Instalar Dependencias del Sistema

Actualiza el sistema e instala Node.js y MySQL Server.

```bash
sudo apt update && sudo apt upgrade -y
# Instalar Node.js (versión 18.x)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Instalar MySQL Server
sudo apt install -y mysql-server
```

## 2. Configurar Base de Datos MySQL

1. Inicia sesión en MySQL:
   ```bash
   sudo mysql -u root
   ```

2. Ejecuta el script SQL del proyecto:
   Copia el archivo `database/deportivos_pro.sql` al servidor y ejecútalo:
   ```bash
   mysql -u root < /ruta/al/proyecto/database/deportivos_pro.sql
   ```

3. Opcional: Crear un usuario dedicado para la app (Recomendado por seguridad)
   ```sql
   CREATE USER 'deportivos_user'@'localhost' IDENTIFIED BY 'TuPasswordSeguro123';
   GRANT ALL PRIVILEGES ON deportivos_pro.* TO 'deportivos_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

## 3. Clonar y Preparar el Proyecto

1. Clona el repositorio en el directorio web (ej. `/var/www/optativa-proyecto`):
   ```bash
   cd /var/www
   git clone <URL_DEL_REPOSITORIO> optativa-proyecto
   cd optativa-proyecto
   ```

2. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```

3. Crea y configura el archivo de entorno `.env`:
   ```bash
   nano .env
   ```
   Agrega la configuración de la base de datos:
   ```env
   DB_HOST=localhost
   DB_USER=deportivos_user
   DB_PASSWORD=TuPasswordSeguro123
   DB_NAME=deportivos_pro
   PORT=3000
   ```

## 4. Ejecutar el Backend en Producción (con PM2)

Usaremos `pm2` para mantener el servidor Node.js corriendo permanentemente en segundo plano.

1. Instala PM2 globalmente:
   ```bash
   sudo npm install -g pm2
   ```

2. Inicia la aplicación:
   ```bash
   pm2 start server.js --name "deportivos-api"
   ```

3. Configura PM2 para iniciar con el sistema operativo:
   ```bash
   pm2 startup ubuntu
   # Sigue las instrucciones en pantalla y luego ejecuta:
   pm2 save
   ```

## 5. Configurar un Reverse Proxy con Nginx (Opcional pero recomendado)

Para exponer la aplicación en el puerto 80 (HTTP) sin especificar el puerto 3000.

1. Instala Nginx:
   ```bash
   sudo apt install -y nginx
   ```

2. Configura el sitio:
   ```bash
   sudo nano /etc/nginx/sites-available/deportivos
   ```
   Añade lo siguiente:
   ```nginx
   server {
       listen 80;
       server_name tu_dominio_o_IP;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

3. Habilita el sitio y reinicia Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/deportivos /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## ¡Listo!
El sistema está ahora en producción y es accesible desde la IP o dominio del servidor.
