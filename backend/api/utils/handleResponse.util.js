

/*
    Título: Handle Error Util
    Nombre: Héctor Paredes Benavides
    Descripción: Ceamos un módulo para gestionar los errores HTTP
    Fecha: 18/4/2023
    Última Modificación: 8/5/2023
*/

/* Declaraciones Constantes */
// Client errors
const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const NOT_FOUND = 404;

// Server errors
const INTERNAL_SERVER_ERROR = 500;

/* Codificación de Funciones */
/* Handle HTTP Response: Método con el que respondemos a una petición
    Parámetros: 
        0: [RES] Response
        1: [STRING] Mensaje de respuesta
        2: [JSON] Contenido adjunto a la respuesta
    Retorno: Ninguno.
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const handleHTTPResponse = (res, message, content = {}) => {
    res.send({
        "ERROR": false,
        "MESSAGE": message,
        "CONTENT": content
    });
}

/* Handle HTTP Error: Método con el que respondemos a una petición con un error
    Parámetros: 
        0: [RES] Response
        1: [STRING] Mensaje de respuesta
        2: [INT] Código de respuesta
    Retorno: Ninguno.
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
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