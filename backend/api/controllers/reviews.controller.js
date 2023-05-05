

/*
    Título: Reviews Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el controlador de reseñas
    Fecha: 30/4/2023
    Última Modificación: 30/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { matchedData } = require("express-validator");
const { Op } = require("sequelize");

// Bibliotecas propias
const { reviewsModel, webpagesModel } = require("../models");
const { handleHTTPResponse, handleHTTPError, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = require("../utils/handleResponse.util");
const { reviewsLogger } = require("../config/winstonLogger.config");
const { getProperties } = require("../utils/handlePropertiesEngine.util");

/* Declaraciones Constantes */
const PROPERTIES = getProperties();

/* Codificación de Funciones */
// Obtención de las reseñas de una página / usuario
const getReviews = (type) => async (req, res) => {

    try{

        // Obtenemos todas las reseñas con la ID en función de si el tipo es webpage o user
        const { id } = matchedData(req);
        const data = type === "webpage" ? 
            await reviewsModel.selectAllWhere({ webpageID: id }) :
            await reviewsModel.selectAllWhere({ userID: id });
        
        if(!data || data.length <= 0){
            handleHTTPError(res, "No se han encontrado reseñas", NOT_FOUND);
            return;
        }

        handleHTTPResponse(res, "Se han obtenido las reseñas con éxito", data);

    }
    catch(err){

        // Mostramos el error
        reviewsLogger.error("ERROR [reviews.controller / getReviews]: " + err);
        handleHTTPError(res, "No se han podido obtener las reseñas", INTERNAL_SERVER_ERROR);

    }

}

// Creación de una reseña
const createReview = async (req, res) => {

    try{

        // Obtenemos los datos de la petición
        const body = matchedData(req);
        const user = req.user;
        body.userID = user[PROPERTIES.id];

        // Comrpobamos que el comercio al que le pone una reseña exista
        const webpage = await webpagesModel.selectOne(body.webpageID);

        if(!webpage){
            handleHTTPError(res, "No se ha encontrado la página a la que poner la reseña", NOT_FOUND);
            return;
        }

        // Comprobamos que el usuario no haya escrito ya una reseña para el comercio
        const reviewsData = await reviewsModel.selectAllWhere({
            [Op.and]: [
                { webpageID: body.webpageID },
                { userID: body.userID }
            ]
        });

        if(reviewsData && reviewsData.length > 0){
            handleHTTPError(res, "Ya existe una reseña de este usuario para este comercio");
            return;
        }

        // Generamos la reseña y devolvemos el resultado
        const data = await reviewsModel.insert(body);

        handleHTTPResponse(res, "Reseña creada con éxito", data);

    }
    catch(err){

        // Mostramos el error
        reviewsLogger.error("ERROR [reviews.controller / createReview]: " + err);
        handleHTTPError(res, "No se ha podido crear la reseña", INTERNAL_SERVER_ERROR);

    }

}

// Modificación de una reseña
const updateReview = async (req, res) => {

    try{

        // Obtenemos el ID de la reseña a modificar y el nuevo contenido
        const { id, ...body } = matchedData(req);
        const { user } = req;

        // Comprobamos que el usuario que la modifica es el dueño de la reseña
        const review = await reviewsModel.selectOne(id);

        if(!review){
            handleHTTPError(res, "No se ha encontrado la reseña a modificar", NOT_FOUND);
            return;
        }

        if(review.userID != user[PROPERTIES.id]){
            handleHTTPError(res, "No tienes autorización para modificar esta reseña", UNAUTHORIZED);
            return;
        }

        body.webpageID = review.webpageID;
        body.userID = user[PROPERTIES.id];
        const data = await reviewsModel.updateByID(id, body);

        if(!data[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido actualizar la reseña", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Reseña modificada con éxito", {});  

    }
    catch(err){

        // Mostramos el error
        reviewsLogger.error("ERROR [reviews.controller / updateReview]: " + err);
        handleHTTPError(res, "No se ha podido modificar la reseña", INTERNAL_SERVER_ERROR);
        
    }

}

// Eliminación de una reseña
const deleteReview = async (req, res) => {

    try{

        // Obtenemos el ID de la reseña a eliminar y el usuario que lo está haciendo
        const { id } = matchedData(req);
        const { user } = req;

        // Comprobamos que el usuario que está eliminando la reseña sea el dueño de la misma o un admin
        const review = await reviewsModel.selectOne(id);

        if(!review){
            handleHTTPError(res, "No se ha encontrado la reseña a eliminar", NOT_FOUND);
            return;
        }

        if(review.userID != user[PROPERTIES.id] && !(user.rol === "admin" || user.rol === "owner")){
            handleHTTPError(res, "No tienes autorización para eliminar esta reseña", UNAUTHORIZED);
            return;
        }

        const data = await reviewsModel.deleteByID(id);

        if(data === "OK")
            handleHTTPResponse(res, "Reseña eliminada con éxito", data);
        else
            handleHTTPError(res, data, NOT_FOUND);

    }
    catch(err){

        // Mostramos el error
        reviewsLogger.error("ERROR [reviews.controller / deleteReview]: " + err);
        handleHTTPError(res, "No se ha podido eliminar la reseña", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    getReviews,
    createReview,
    updateReview,
    deleteReview
}