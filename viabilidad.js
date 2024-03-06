const express = require('express');
const bodyParser = require('body-parser');
//const { ServiceBusClient } = require('@azure/service-bus');
const { QueueClient } = require("@azure/storage-queue");
const { DefaultAzureCredential } = require('@azure/identity');
const { v1: uuidv1 } = require("uuid");

const app = express();
const port = 3003;
const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;

// Middleware de parseo de JSON para manejar los datos en formato JSON
app.use(bodyParser.json());

const queueName = 'viability';


// Ruta para manejar la nueva ruta /viabilidad

app.post('/', async (req, res) => {
  const { tipoId, numeroId, celular, email } = req.body;

  console.log('Datos recibidos:', { tipoId, numeroId, celular, email });

  try {
    await enviarMensajeQueueAzure({ tipoId, numeroId, celular, email });
    res.status(201).json({ message: 'Mensaje enviado a la cola de Azure.' });
  } catch (error) {
    console.error('Error al enviar mensaje a la cola de Azure:', error.message);
    res.status(500).json({ error: 'Ocurrió un error al enviar el mensaje a la cola de Azure.' });
  }
});


async function enviarMensajeQueueAzure(datos) {
  const queueClient = new QueueClient(AZURE_STORAGE_CONNECTION_STRING, queueName);
  console.log(`Los datos recibidos son: ${datos}`)
  console.log (`cadena de conexion: ${AZURE_STORAGE_CONNECTION_STRING}`)
  console.log("\nCreating queue...");
  console.log("\t", queueName);

  const createQueueResponse = await queueClient.create();

  console.log("Queue created, requestId:", createQueueResponse.requestId);

  try {
    const messageText = JSON.stringify(datos);

    if (!messageText) {
      throw new Error('El campo "messageText" es obligatorio en el cuerpo del mensaje.');
    }

    await queueClient.sendMessage(messageText);
  } catch (error) {
    console.error('Error al enviar mensaje a la cola de Azure:', error.message);
    throw error;
  }
}



// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servicio de viabilidad en ejecución en http://localhost:${port}`);
});