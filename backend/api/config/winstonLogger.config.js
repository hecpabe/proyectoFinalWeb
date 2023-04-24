

/*
    Título: Winston Logger Config
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el logger del servidor
    Fecha: 18/4/2023
    Última Modificación: 18/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { createLogger, format, transports, config } = require("winston");

/* Loggers */
// App
const appLogger = createLogger({

    transports: [
        new transports.Console()
    ]

});

// JWT
const jwtLogger = createLogger({
    
    transports: [
        new transports.Console()
    ]

});

// Nodemailer
const nodemailerLogger = createLogger({

    transports: [
        new transports.Console()
    ]

});

// MongoDB
const mongoDBLogger = createLogger({

    transports: [
        new transports.Console()
    ]

});

// Sequelize
const sequelizeLogger = createLogger({

    transports: [
        new transports.Console()
    ]

});

// Admins
const usersLogger = createLogger({

    transports: [
        new transports.Console()
    ]

});

/* Exportado de Módulo */
module.exports = {
    appLogger,
    jwtLogger,
    nodemailerLogger,
    mongoDBLogger,
    sequelizeLogger,
    usersLogger
}