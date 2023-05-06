

/*
    Título: Storage Controller
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el controlador del almacenamiento
    Fecha: 5/5/2023
    Última Modificación: 5/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas propias
const { storageModel } = require("../models");
const { handleHTTPResponse, handleHTTPError, INTERNAL_SERVER_ERROR } = require("../utils/handleResponse.util");
const { storageLogger } = require("../config/winstonLogger.config");

/* Codificación de Funciones */
const createStorage = async (req, res) => {

    try{

        // Obtenemos el body y el fichero
        const { file } = req;

        // Generamos los datos del fichero obtenido
        const fileData = {
            filename: file.filename,
            url: process.env.PUBLIC_URL+"/"+file.filename
        }

        // Subimos el registro a la DB
        const data = await storageModel.create(fileData);

        handleHTTPResponse(res, "Archivo subido con éxito", data);

    }
    catch(err){

        storageLogger.error("ERROR [storage.controller / createStorage]: " + err);
        handleHTTPError(res, "No se ha podido subir el archivo", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    createStorage
}