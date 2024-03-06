const express = require('express');
const app = express();
const port = 3001;

app.get('/', (req, res) => {
  res.send('¡Servicio 1!');
});

app.listen(port, () => {
  console.log(`Servicio 1 en ejecución en http://localhost:${port}`);
});

