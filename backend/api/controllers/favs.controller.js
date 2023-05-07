

/*
    Título: Favs Controller
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el controlador de los favoritos
    Fecha: 7/5/2023
    Última Modificación: 7/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { matchedData } = require("express-validator");

// Bibliotecas propias
const { favsModel, webpagesModel } = require("../models");
const { handleHTTPResponse, handleHTTPError, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = require("../utils/handleResponse.util");
const { favsLogger } = require("../config/winstonLogger.config");
const { getProperties } = require("../utils/handlePropertiesEngine.util");

/* Declaraciones Constantes */
const PROPERTIES = getProperties();

/* Codificación de Funciones */
// Obtención de todos los favoritos
const getFavs = async (req, res) => {

    try{

        // Obtenemos los datos de la base de datos y los mostramos
        const data = await favsModel.selectAll();

        if(!data || data.length <= 0){
            handleHTTPError(res, "No se han encontrado favoritos", NOT_FOUND);
            return;
        }

        data.forEach(element => {
            element.user.set("password", undefined, { strict: false });
        });

        handleHTTPResponse(res, "Favoritos obtenidos con éxito", data);

    }
    catch(err){

        favsLogger.error("ERROR [favs.controller / getFavs]: " + err);
        handleHTTPError(res, "No se han podido obtener los favoritos", INTERNAL_SERVER_ERROR);

    }

}

// Obtención de todos los favoritos de un usuario
const getFavsByUser = (type) => async (req, res) => {

    try{

        // Obtenemos el id del usuario o página
        const { id } = matchedData(req);

        // Obtenemos los datos de la base de datos y los mostramos
        const data = type === "user" ?
            await favsModel.selectAllWhere({ userID: id }) :
            await favsModel.selectAllWhere({ webpageID: id });
        
        if(!data || data.length <= 0){
            handleHTTPError(res, "No se han encontrado favoritos", NOT_FOUND);
            return;
        }

        data.forEach(element => {
            element.user.set("password", undefined, { strict: false });
        });

        handleHTTPResponse(res, "Favoritos obtenidos con éxito", data);

    }
    catch(err){

        favsLogger.error("ERROR [favs.controller / getFavsByUser]: " + err);
        handleHTTPError(res, "No se han podido obtener los favoritos", INTERNAL_SERVER_ERROR);

    }

}

// Obtención de un favorito por ID
const getFav = async (req, res) => {

    try{

        // Obtenemos la ID del favorito a obtener
        const { id } = matchedData(req);

        // Obtenemos los datos de la base de datos y los mostramos
        const data = await favsModel.selectOne(id);

        if(!data || data.length <= 0){
            handleHTTPError(res, "No se ha encontrado el favorito", NOT_FOUND);
            return;
        }

        data.user.set("password", undefined, { strict: false });

        handleHTTPResponse(res, "Favorito encontrado con éxito", data);

    }
    catch(err){

        favsLogger.error("ERROR [favs.controller / getFav]: " + err);
        handleHTTPError(res, "No se ha podido obtener el favorito", INTERNAL_SERVER_ERROR);

    }

}

// Comprobación de que un favorito existe
const checkFavExists = async (req, res) => {

    try{

        // Obtenemos las ID por las que buscar
        const { id } = matchedData(req);
        const { user } = req;
        const userID = user[PROPERTIES.id];

        // Obtenemos el favorito
        const data = await favsModel.selectAllWhere({ userID, webpageID: id });

        if(!data || data.length <= 0){
            handleHTTPResponse(res, "El favorito no existe", false);
            return;
        }

        data.forEach(element => {
            element.user.set("password", undefined, { strict: false });
        });

        handleHTTPResponse(res, "El favorito ya existe", data);

    }
    catch(err){

        favsLogger.error("ERROR [favs.controller / checkFavExists]: " + err);
        handleHTTPError(res, "No se ha podido comprobar si la página está agregada a favoritos", INTERNAL_SERVER_ERROR);

    }

}

// Creación de un favorito
const createFav = async (req, res) => {

    try{

        // Obtenemos los datos
        const { id } = matchedData(req);
        const { user } = req;

        const body = {
            userID: user[PROPERTIES.id],
            webpageID: id
        }

        // Comprobamos que la página que se va a agregar a favoritos existe
        const webpage = await webpagesModel.selectOne(id);

        if(!webpage || webpage.length <= 0){
            handleHTTPError(res, "La página a agregar a favoritos no existe", NOT_FOUND);
            return;
        }

        // Comprobamos que el favorito a insertar no existe
        const fav = await favsModel.selectAllWhere({ userID: body.userID, webpageID: id });

        if(fav && fav.length > 0){
            handleHTTPError(res, "Esta página ya ha sido agregada a tus favoritos");
            return;
        }

        // Creamos el favorito
        const data = await favsModel.insert(body);

        handleHTTPResponse(res, "Página agregada a favoritos con éxito", data);

    }
    catch(err){

        favsLogger.error("ERROR [favs.controller / createFav]: " + err);
        handleHTTPError(res, "No se ha podido agregar la página a favoritos", INTERNAL_SERVER_ERROR);

    }

}

// Eliminación de un favorito
const deleteFav = async (req, res) => {

    try{

        // Obtenemos los datos
        const { id } = matchedData(req);
        const { user } = req;

        // Comprobamos que el favorito existe
        const fav = await favsModel.selectOne(id);

        if(!fav || fav.length <= 0){
            handleHTTPError(res, "Esta página no está agregada a favoritos", NOT_FOUND);
            return;
        }

        // Comprobamos que el usuario que lo elimina es el propieterio del favorito
        if(fav.userID != user[PROPERTIES.id]){
            handleHTTPError(res, "No tienes autorización para eliminar la página de favoritos", UNAUTHORIZED);
            return;
        }

        // Eliminamos el favorito
        const data = await favsModel.deleteByID(id);

        if(data === "OK")
            handleHTTPResponse(res, "Página eliminada de favoritos con éxito", data);
        else
            handleHTTPError(res, data, NOT_FOUND);

    }
    catch(err){

        favsLogger.error("ERROR [favs.controller / deleteFav]: " + err);
        handleHTTPError(res, "No se ha podido eliminar la página de favoritos", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    getFavs,
    getFavsByUser,
    getFav,
    checkFavExists,
    createFav,
    deleteFav
}