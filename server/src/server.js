const express = require("express");
// const {createRoles} = require ("./libs/initialSetup.js") 

require("dotenv").config();
const router = require("./routers/index");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const server = express();

// createRoles()
//   .then(() => {
//     console.log('Roles creados exitosamente');
//   })
//   .catch((error) => {
//     console.error('Error al crear los roles:', error);
//   });

const bodyParser = require('body-parser');

// Aumentar el límite del tamaño del cuerpo de la solicitud a 50mb
server.use(bodyParser.json({ limit: '50mb' }));
server.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

server.use(
  cors({
    
    credentials: true, // Habilita el envío de cookies y encabezados de autenticación
  })
);

server.use(express.json());
server.use(morgan("dev"));
server.use(helmet());
server.use(
  express.static("public", {
    setHeaders: (res, path) => {
      if (path.endsWith(".js")) {
        res.setHeader("Content-Type", "application/javascript");
      }
    },
  })
);

server.use('/uploads', express.static('uploads'))
server.use(router);

module.exports = server;
