const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const port = 3000;

// Configuración de rutas y servicios
const services = [
  { path: '/servicio-1', target: 'http://localhost:3001' },
  { path: '/servicio-2', target: 'http://localhost:3002' },
  { path: '/viabilidad', target: 'http://localhost:3003' },
  // Agrega más servicios según sea necesario
];

// Configuración de CORS (Cross-Origin Resource Sharing)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Configuración de las rutas y redirección a los servicios correspondientes
services.forEach(service => {
  console.log(`Configurando ruta ${service.path} para redirigir a ${service.target}`);
  app.use(service.path, createProxyMiddleware({ target: service.target, pathRewrite: { [`^${service.path}`]: '' }, changeOrigin: true }));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Gateway en ejecución en http://localhost:${port}`);
});
