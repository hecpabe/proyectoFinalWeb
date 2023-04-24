

/*
    Título: Handle Error Util
    Nombre: Héctor Paredes Benavides
    Descripción: Ceamos un módulo para gestionar los errores HTTP
    Fecha: 18/4/2023
    Última Modificación: 20/4/2023
*/

/* Declaraciones Constantes */
// Client errors
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;

// Server errors
const INTERNAL_SERVER_ERROR = 500;

/* Codificación de Funciones */
const handleHTTPResponse = (res, message, content = {}) => {
    res.send({
        "ERROR": false,
        "MESSAGE": message,
        "CONTENT": content
    });
}

const handleHTTPError = (res, message, code = BAD_REQUEST) => {
    res.status(code).send({
        "ERROR": true,
        "MESSAGE": message
    });
}

/* Exportado de Módulo */
module.exports = {

    BAD_REQUEST,
    UNAUTHORIZED,
    NOT_FOUND,

    INTERNAL_SERVER_ERROR,

    handleHTTPResponse,
    handleHTTPError
}