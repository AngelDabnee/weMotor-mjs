// Requieres el módulo express
import express from 'express';
const app = express();

// Requieres el módulo path
import path from 'path';
import { dirname } from 'path';
import { join } from 'path';

// Requieres el módulo serialport
import { SerialPort } from 'serialport';

// Requieres el módulo @serialport/parser-readline
import { ReadlineParser } from '@serialport/parser-readline';

import { fileURLToPath } from 'url';

const port = new SerialPort({
    path: '/dev/tty.usbserial-1330',
    baudRate: 9600,
  })

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Sirve archivos estáticos desde el directorio 'public'
app.use(express.static(join(__dirname, 'public')));

// Escuchar los datos entrantes
parser.on('data', console.log);

// Funciones para controlar el motor
function moverIzquierda() {
  port.write('i');
}

function moverDerecha() {
  port.write('d');
}

function parar() {
  port.write('s');
}

// Servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para controlar el motor
app.get('/izquierda', (req, res) => {
  moverIzquierda();
  res.send('Moviendo a la izquierda');
});

app.get('/derecha', (req, res) => {
  moverDerecha();
  res.send('Moviendo a la derecha');
});

app.get('/parar', (req, res) => {
  parar();
  res.send('Parado');
});

// Iniciar el servidor
app.listen(3000, () => console.log('Servidor escuchando en el puerto 3000'));