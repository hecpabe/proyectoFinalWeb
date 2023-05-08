

/*
    Título: Handle Validator
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar las validaciones
    Fecha: 20/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { validationResult } = require("express-validator");

// Bibliotecas propias
const { handleHTTPError } = require("./handleResponse.util")

/* Codificación de Funciones */
/* Validate Results: Método con el que validamos los datos de entrada de una petición
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
        2: [NEXT] Next
    Retorno: Ninguno.
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const validateResults = (req, res, next) => {

    try{

        validationResult(req).throw();
        return next();

    }
    catch(err){

        handleHTTPError(res, "No se han podido validar correctamente los datos de entrada");

    }

}

/* Exportado de módulo */
module.exports = {
    validateResults
};