

/*
    Título: Winston Logger Config
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el logger del servidor
    Fecha: 18/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { createLogger, format, transports } = require("winston");
const { MESSAGE } = require("triple-beam");
const { combine, timestamp, label } = format;

/* Formatos */
/* const generalFormat = printf(({ level, message, timestamp }) => {
    return `LOG (${timestamp}) ${level}: ${message}`;
}); */
const generalFormat = format((info) => {
    const { level, message, timestamp } = info;
    info[MESSAGE] = `LOG (${timestamp}) ${level}: ${message}`;
    return info;
});

/* Loggers */
// App
const appLogger = createLogger({

    format: combine(
        label({ label: "APP", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// JWT
const jwtLogger = createLogger({
    
    format: combine(
        label({ label: "JWT", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Nodemailer
const nodemailerLogger = createLogger({

    format: combine(
        label({ label: "NODEMAILER", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// MongoDB
const mongoDBLogger = createLogger({

    format: combine(
        label({ label: "MONGODB", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Sequelize
const sequelizeLogger = createLogger({

    format: combine(
        label({ label: "SEQUELIZE", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Usuarios
const usersLogger = createLogger({

    format: combine(
        label({ label: "USERS", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Comerciantes
const merchantsLogger = createLogger({

    format: combine(
        label({ label: "MERCHANTS", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Comercios
const webpagesLogger = createLogger({

    format: combine(
        label({ label: "WEBPAGES", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Reseñas
const reviewsLogger = createLogger({

    format: combine(
        label({ label: "REVIEWS", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Publicaciones
const postsLogger = createLogger({

    format: combine(
        label({ label: "POSTS", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Almacenamiento
const storageLogger = createLogger({

    format: combine(
        label({ label: "STORAGE", message: true }),
        timestamp(),
        generalFormat()
    ),
    transports: [
        new transports.Console()
    ]

});

// Favoritos
const favsLogger = createLogger({

    format: combine(
        label({ label: "FAVS", message: true }),
        timestamp(),
        generalFormat()
    ),
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
    usersLogger,
    merchantsLogger,
    webpagesLogger,
    reviewsLogger,
    postsLogger,
    storageLogger,
    favsLogger
}