const jwt = require('jsonwebtoken');

const secretKey = 'tu_clave_secreta'; // Reemplázala con la misma clave que en el API Gateway

const user = {
  username: 'usuario_de_prueba',
  role: 'admin',
};

const token = jwt.sign({ user }, secretKey, { expiresIn: '1h' });

console.log('Token JWT:', token);

