const express = require('express');
const bodyParser = require('body-parser');
//const { ServiceBusClient } = require('@azure/service-bus');
const { QueueClient } = require("@azure/storage-queue");

const app = express();
const port = 3001;
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Middleware de parseo de JSON para manejar los datos en formato JSON
app.use(bodyParser.json());

// Configuración de la cola de mensajes en Azure
//const serviceBusClient = ServiceBusClient.createFromConnectionString('TU_CADENA_DE_CONEXIÓN_DEL_SERVICE_BUS');
const queueName = 'viability';


// Ruta para manejar la nueva ruta /viabilidad
app.post('/viabilidad', (req, res) => {
  // Obtener los datos del cuerpo de la solicitud
  const { tipoId, numeroId, celular, email } = req.body;

  // Imprimir los datos
  console.log('Datos recibidos:', { tipoId, numeroId, celular, email });

  // Enviar los datos a la cola de mensajes en Azure
  //enviarMensajeAzure({ tipoId, numeroId, celular, email });

  //Enviar mensaje cola de Azure
  enviarMensajeQueueAzure({ tipoId, numeroId, celular, email });

  res.status(200).json({ mensaje: 'Datos recibidos exitosamente' });
});

// Función para enviar un mensaje a la cola de mensajes en Azure
/*
async function enviarMensajeAzure(datos) {
  const sender = serviceBusClient.createSender(queueName);

  try {
    const mensaje = {
      body: datos,
      label: 'DatosViabilidad',
    };

    await sender.sendMessages(mensaje);
    console.log('Mensaje enviado a la cola de mensajes en Azure:', mensaje);
  } finally {
    await sender.close();
  }
}*/

async function enviarMensajeQueueAzure(datos) {
  const queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, queueName);
  console.log("\nCreating queue...");
  console.log("\t", queueName);

  try {

    const messageText = datos;
    if (!messageText) {

        return res.status(400).json({ error: 'El campo "messageText" es obligatorio en el cuerpo del mensaje.' });

    }

    // Enviar mensaje a la cola de Azure

    await queueClient.sendMessage(messageText);
    res.status(201).json({ message: 'Mensaje enviado a la cola de Azure.' });

  } catch (error) {

      console.error('Error al enviar mensaje a la cola de Azure:', error.message);

      res.status(500).json({ error: 'Ocurrió un error interno.' });

  }
}



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servicio 1 en ejecución en http://localhost:${port}`);
});