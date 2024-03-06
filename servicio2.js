const express = require('express');
const app = express();
const port = 3002;

app.get('/', (req, res) => {
  res.send('¡Servicio 2!');
});

app.listen(port, () => {
  console.log(`Servicio 2 en ejecución en http://localhost:${port}`);
});