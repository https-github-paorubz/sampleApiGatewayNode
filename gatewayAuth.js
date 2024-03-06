const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'tu_clave_secreta';

// Función middleware para la autenticación
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log(`authHeader recibido ${authHeader}`);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }

  /*const token = authHeader.split(' ')[1]; */
  const token = authHeader; 

  console.log(`token recibido ${token}`);

  if (!token) {
    return res.status(401).json({ error: 'Token de autenticación no proporcionado' });
  }

  jwt.verify(token, secretKey, (err, decodedToken) => {
    
    if (err) {
      console.error('Error al verificar el token:', err);
      return res.status(403).json({ error: 'Token no válido' });
    }

    req.user = decodedToken.user; // Asigna el usuario al objeto req
    console.log(`decodedToken ${decodedToken}`);
    next();
  });
}

// Configuración de rutas y servicios
const services = [
  { path: '/servicio-1', target: 'http://localhost:3001' }, // Ruta y dirección del primer servicio
  { path: '/servicio-2', target: 'http://localhost:3002' }, // Ruta y dirección del segundo servicio
  // Agrega más servicios según sea necesario
];

// Configuración de CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware de autenticación para todas las rutas
app.use(authenticateToken);

// Configuración de las rutas y redirección a los servicios correspondientes
services.forEach(service => {
  console.log(`Configurando ruta ${service.path} para redirigir a ${service.target}`);
  app.use(service.path, createProxyMiddleware({ target: service.target, pathRewrite: { [`^${service.path}`]: '' }, changeOrigin: true }));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Gateway en ejecución en http://localhost:${port}`);
});