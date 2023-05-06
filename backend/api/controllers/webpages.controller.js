

/*
    Título: Webpages Controller
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el controlador de las páginas de comercios
    Fecha: 28/4/2023
    Última Modificación: 28/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { matchedData } = require("express-validator");
const { Op } = require("sequelize");

// Bibliotecas propias
const { webpagesModel, reviewsModel, postsModel, storageModel } = require("../models");
const { handleHTTPResponse, handleHTTPError, INTERNAL_SERVER_ERROR, NOT_FOUND, UNAUTHORIZED } = require("../utils/handleResponse.util");
const { webpagesLogger } = require("../config/winstonLogger.config");
const { getProperties } = require("../utils/handlePropertiesEngine.util");
const { sequelize } = require("../config/mysql.config");

/* Declaraciones Constantes */
const PROPERTIES = getProperties();

/* Codificación de Funciones */
// Obtención de todas las páginas
const getWebpages = async (req, res) => {

    try{

        // Obtenemos los datos de la base de datos y los mandamos
        const data = await webpagesModel.findAll({
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("reviews.rating")), "reviewsNumber"],
                    [sequelize.fn("AVG", sequelize.col("reviews.rating")), "rating"]
                ]
            },
            include: [{
                model: reviewsModel,
                attributes: []
            },
            "image"
            ],
            group: ["webpages.id"]
        });

        handleHTTPResponse(res, "Páginas de los comercios obtenidas con éxito", data);

    }
    catch(err){

        // Mostramos el error
        webpagesLogger.error("ERROR [webpages.controller / getWebpages]: " + err);
        handleHTTPError(res, "No se han podido obtener las páginas de los comercios", INTERNAL_SERVER_ERROR);

    }

}

// Obtención de una página por id
const getWebpage = async (req, res) => {

    try{

        // Obtenemos la página con la ID indicada de la base de datos y la devolvemos
        const { id } = matchedData(req);
        const data = await webpagesModel.findAll({
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("reviews.rating")), "reviewsNumber"],
                    [sequelize.fn("AVG", sequelize.col("reviews.rating")), "rating"]
                ]
            },
            include: [{
                model: reviewsModel,
                attributes: []
            },
            "image",
            {
                model: postsModel,
                as: "posts",
                include: [{
                    model: storageModel,
                    as: "image"
                }]
            }],
            where: { id: id },
            group: ["webpages.id"]
        });


        if(!data){
            handleHTTPError(res, "No se ha encontrado la página", NOT_FOUND);
            return;
        }

        handleHTTPResponse(res, "Página encontrada con éxito", data);

    }
    catch(err){

        // Mostramos el error
        webpagesLogger.error("ERROR [webpages.controller / getWebpage]: " + err);
        handleHTTPError(res, "No se ha podido obtener la página del comercio", INTERNAL_SERVER_ERROR);

    }

}

// Obtención de páginas filtradas
const getFilteredWebpages = async (req, res) => {

    try{

        // Obtenemos las páginas que concuerden con los filtros
        const { search, rating, country, city, type } = matchedData(req);

        // Inicializamos la query para conseguir todas las páginas con la info de sus reseñas
        var query = {
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("reviews.rating")), "reviewsNumber"],
                    [sequelize.fn("AVG", sequelize.col("reviews.rating")), "rating"]
                ]
            },
            include: [{
                model: reviewsModel,
                attributes: []
            },
            "image"
            ],
            group: ["webpages.id"]
        };
        var andCondition = [];

        // Realizamos las comprobaciones de filtrado
        if(search != "NULL")
            andCondition.push({ name: { [Op.like]: `%${search}%` } });
        
        if(country != "NULL")
            andCondition.push({ country: country });
        
        if(city != "NULL")
            andCondition.push({ city: city });
        
        if(type != "NULL")
            andCondition.push({ type: type });

        if(andCondition.length > 0)
            query.where = {
                [Op.and]: andCondition
            }
        
        // Realizamos las comprobaciones de ordenación
        if(rating === "ASC")
            query.order = [[sequelize.literal('rating'), 'ASC']];
        else
            query.order = [[sequelize.literal('rating'), 'DESC']];

        // Hacemos la petición
        /* const data = await webpagesModel.findAll(fullQuery); */
        const data = await webpagesModel.findAll(query);

        if(!data || data.length <= 0){
            handleHTTPError(res, "No se han encontrado resultados", NOT_FOUND);
            return;
        }
        
        handleHTTPResponse(res, "Se han encontrado los siguientes resultados", data);

    }
    catch(err){

        // Mostramos el error
        webpagesLogger.error("ERROR [webpages.controller / getFilteredWebpage]: " + err);
        handleHTTPError(res, "No se han podido obtener las páginas de los comercios", INTERNAL_SERVER_ERROR);

    }

}

// Obtención de páginas filtradas para usuarios registrados
const getFilteredWebpagesAsLoggedUser = async (req, res) => {

    try{

        // Obtenemos las páginas que concuerden con los filtros
        const { search, rating, country, city, type, preferences, fav } = matchedData(req);
        const { user } = req;

        // Transformamos la flag de preferences y fav de string a boolean
        const preferencesAsBool = preferences === "true"
        const favAsBool = fav === "true"

        // Inicializamos la query para conseguir todas las páginas con la info de sus reseñas
        var query = {
            attributes: {
                include: [
                    [sequelize.fn("COUNT", sequelize.col("reviews.rating")), "reviewsNumber"],
                    [sequelize.fn("AVG", sequelize.col("reviews.rating")), "rating"]
                ]
            },
            include: [{
                model: reviewsModel,
                attributes: []
            },
            "image"
            ],
            group: ["webpages.id"]
        };
        var andCondition = [];

        // Realizamos las comprobaciones de filtrado
        if(search != "NULL")
            andCondition.push({ name: { [Op.like]: `%${search}%` } });
        
        if(country != "NULL")
            andCondition.push({ country: country });
        
        if(city != "NULL")
            andCondition.push({ city: city });
        
        if(type != "NULL")
            andCondition.push({ type: type });

        if(andCondition.length > 0)
            query.where = {
                [Op.and]: andCondition
            }
        
        // Realizamos las comprobaciones de ordenación
        if(rating === "ASC")
            query.order = [[sequelize.literal('rating'), 'ASC']];
        else
            query.order = [[sequelize.literal('rating'), 'DESC']];

        // Hacemos la petición
        /* const data = await webpagesModel.findAll(fullQuery); */
        const data = await webpagesModel.findAll(query);

        // Comprobamos que se encuentre en las preferencias y favoritos del usuario
        // TODO: HACER EL FAV
        const userPreferences = user.preferences.split(',').filter((element) => {
            return element.length > 0;
        });
        const filteredData = data.filter((webpage) => (!preferencesAsBool || userPreferences.includes(webpage.dataValues.type)))

        if(!filteredData || filteredData.length <= 0){
            handleHTTPError(res, "No se han encontrado resultados", NOT_FOUND);
            return;
        }

        handleHTTPResponse(res, "Se han encontrado los siguientes resultados", filteredData);

    }
    catch(err){

        // Mostramos el error
        webpagesLogger.error("ERROR [webpages.controller / getFilteredWebpageAsLoggedUser]: " + err);
        handleHTTPError(res, "No se han podido obtener las páginas de los comercios", INTERNAL_SERVER_ERROR);

    }

}

// Creación de un comercio
const createWebpage = async (req, res) => {

    try{

        // Obtenemos el comerciante que va a crear el comercio y los datos de este
        const user = req.user;
        const body = matchedData(req);

        // Introducimos el merchantID en el body y generamos el comercio
        body.merchantID = user[PROPERTIES.id];
        const data = await webpagesModel.insert(body);

        handleHTTPResponse(res, "Comercio creado con éxito", data);

    }
    catch(err){

        // Mostramos el error
        webpagesLogger.error("ERROR [webpages.controller / createWebpage]: " + err);
        handleHTTPError(res, "No se ha podido crear la página del comercio", INTERNAL_SERVER_ERROR);

    }

}

// Modificación de un comercio
const updateWebpage = async (req, res) => {

    try{

        // Obtenemos el ID de la página a modificar y la actualizamos
        const { id, ...body } = matchedData(req);
        const { user } = req;

        // Comprobamos que el comerciante es el propietario de la página
        const webpage = await webpagesModel.selectOne(id);

        if(!webpage){
            handleHTTPError(res, "No se ha encontrado la página a actualizar", NOT_FOUND);
            return;
        }

        if(webpage.merchantID != user[PROPERTIES.id]){
            handleHTTPError(res, "No tienes autorización para actualizar esta página", UNAUTHORIZED);
            return;
        }

        const data = await webpagesModel.updateByID(id, body);

        if(!data[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido actualizar la página", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Página modificada con éxito", {}); 

    }
    catch(err){

        // Mostramos el error
        webpagesLogger.error("ERROR [webpages.controller / updateWebpage]: " + err);
        handleHTTPError(res, "No se ha podido actualizar la página del comercio", INTERNAL_SERVER_ERROR);

    }

}

// Eliminación de un comercio
const deleteWebpage = async (req, res) => {

    try{

        // Obtenemos el comercio a eliminar y el comerciante que lo va a eliminar
        const { id } = matchedData(req);
        const { user } = req;

        // Comprobamos que el comerciante es el propieraio del comercio a eliminar o este es un admin
        const webpage = await webpagesModel.selectOne(id);

        if(!webpage){
            handleHTTPError(res, "No se ha encontrado la página a eliminar", NOT_FOUND);
            return;
        }

        if(webpage.merchantID != user[PROPERTIES.id] && !(user.rol === "admin" || user.rol === "owner")){
            handleHTTPError(res, "No tienes autorización para eliminar esta página", UNAUTHORIZED);
            return;
        }

        const data = await webpagesModel.deleteByID(id);

        if(data === "OK")
            handleHTTPResponse(res, "Página eliminada con éxito", data);
        else
            handleHTTPError(res, data, NOT_FOUND);

    }
    catch(err){

        // Mostramos el error
        webpagesLogger.error("ERROR [webpages.controller / deleteWebpage]: " + err);
        handleHTTPError(res, "No se ha podido eliminar la página del comercio", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    getWebpages,
    getWebpage,
    getFilteredWebpages,
    getFilteredWebpagesAsLoggedUser,
    createWebpage,
    updateWebpage,
    deleteWebpage
};