

/*
    Título: Posts Controller
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la gestión del controlador de posts
    Fecha: 5/5/2023
    Última Fecha: 5/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { matchedData } = require("express-validator");

// Bibliotecas propias
const { postsModel, webpagesModel, storageModel } = require("../models");
const { handleHTTPError, handleHTTPResponse, NOT_FOUND, INTERNAL_SERVER_ERROR, UNAUTHORIZED } = require("../utils/handleResponse.util");
const { postsLogger } = require("../config/winstonLogger.config");
const { getProperties } = require("../utils/handlePropertiesEngine.util");

/* Declaraciones Constantes */
const DB_ENGINE = process.env.DB_ENGINE;
const PROPERTIES = getProperties();

/* Codificación de Funciones */
// Obtención de todos los posts
const getPosts = async (req, res) => {

    try{

        // Obtenemos los datos de la base de datos y los mandamos
        const data = await postsModel.findAll({ include: [{
            model: webpagesModel,
            as: "webpage",
            include: [{
                model: storageModel,
                as: "image"
            }]
        }, 
        "image"
        ] });

        if(!data || data.length <= 0){
            handleHTTPError(res, "No se encontraron publicaciones", NOT_FOUND);
            return;
        }

        handleHTTPResponse(res, "Publicaciones encontradas con éxito", data);

    }
    catch(err){

        postsLogger.error("ERROR [posts.controller / getPosts]: " + err);
        handleHTTPError(res, "No se han podido obtener las publicaciones", INTERNAL_SERVER_ERROR);

    }

}

// Obtención de un post por ID
const getPost = async (req, res) => {

    try{

        // Obtenemos la publicación con la ID indicada y la devolvemos
        const { id } = matchedData(req);
        const data = await postsModel.findOne({ where: { id: id }, include: [{
            model: webpagesModel,
            as: "webpage",
            include: [{
                model: storageModel,
                as: "image"
            }]
        }, 
        "image"
        ]});

        if(!data || data.length <= 0){
            handleHTTPError(res, "No se ha encontrado la publicación", NOT_FOUND);
            return;
        }

        handleHTTPResponse(res, "Publicación encontrada con éxito", data);

    }
    catch(err){

        postsLogger.error("ERROR [posts.controller / getPost]: " + err);
        handleHTTPError(res, "No se ha podido obtener la publicación", INTERNAL_SERVER_ERROR);

    }

}

// Obtención de todos los posts de una página
const getWebpagePosts = async (req, res) => {

    try{

        // Obtenemos el ID de la página de la que obtener los posts
        const { id } = matchedData(req);
        const data = await postsModel.findAll({ where: { webpageID: id }, include: [{
            model: webpagesModel,
            as: "webpage",
            include: [{
                model: storageModel,
                as: "image"
            }]
        }, 
        "image"
        ]});

        if(!data || data.length <= 0){
            handleHTTPError(res, "No se han encontrado publicaciones", NOT_FOUND);
            return;
        }

        handleHTTPResponse(res, "Publicaciones obtenidas con éxito", data);

    }
    catch(err){

        postsLogger.error("ERROR [posts.controller / getWebpagePosts]: " + err);
        handleHTTPError(res, "No se han podido obtener las publicaciones", INTERNAL_SERVER_ERROR);

    }

}

// Creación de posts
const createPost = async (req, res) => {

    try{

        // Obtenemos la página en la que añadir el post
        const body = matchedData(req);
        const { user } = req;
        const webpage = await webpagesModel.selectOne(body.webpageID);

        // Comprobamos que la página existe
        if(!webpage){
            handleHTTPError(res, "La página en la que añadir la publicación no existe", NOT_FOUND);
            return;
        }

        // Comprobamos que la página es de la persona que publica
        if(webpage.merchantID != user[PROPERTIES.id]){
            handleHTTPError(res, "No tienes autorización para publicar en esta página", UNAUTHORIZED);
            return;
        }

        // Comprobamos si hay que insertar attachment
        body.attachment = parseInt(body.attachment);
        if(body.attachment >= 0){

            // Comprobamos que el archivo existe
            const attachment = await storageModel.selectOne(body.attachment);

            if(!attachment || attachment.length <= 0){
                handleHTTPError(res, "No se ha encontrado el fichero adjunto a la publicación", NOT_FOUND);
                return;
            }

        }
        else
            body.attachment = undefined;

        // Introducimos la nueva publicación
        const data = await postsModel.insert(body);

        handleHTTPResponse(res, "Publicación creada con éxito", data);
        
    }
    catch(err){

        postsLogger.error("ERROR [posts.controller / createPost]: " + err);
        handleHTTPError(res, "No se ha podido crear la publicación", INTERNAL_SERVER_ERROR);

    }

}

// Modificación de posts
const updatePost = async (req, res) => {

    try{

        // Obtenemos el ID de la publicación a modificar y su nuevo contenido
        const { id, ...body } = matchedData(req);
        const { user } = req;

        // Obtenemos la publicación a modificar
        const post = await postsModel.findOne({ where: { id: id }, include: "webpage" });

        // Comprobamos que el post exista
        if(!post || post.length < 0){
            handleHTTPError(res, "La publicación que se está intentando modificar no existe", NOT_FOUND);
            return;
        }

        // Comprobamos que la persona que modifica el post es el propietario del mismo
        if(post.webpage.merchantID != user[PROPERTIES.id]){
            handleHTTPError(res, "No tienes autorización para modificar esta publicación", UNAUTHORIZED);
            return;
        }

        // Comprobamos si hay que incluir un attachment
        body.attachment = parseInt(body.attachment);
        if(body.attachment >= 0){

            // Comprobamos que el attachment existe
            const attachment = await storageModel.selectOne(body.attachment);

            if(!attachment || attachment.length <= 0){
                handleHTTPError(res, "No se ha encontrado el fichero adjunto a la publicación", NOT_FOUND);
                return;
            }

        }
        else
            body.attachment = undefined;

        // Mantenemos el ID de la página a la que pertenece el post
        body.webpageID = post.webpageID;

        // Actualizamos el post
        const data = await postsModel.updateByID(id, body);

        if(!data[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido actualizar la publicación", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Publicación modificada con éxito", {}); 

    }
    catch(err){

        postsLogger.error("ERROR [posts.controller / updatePost]: " + err);
        handleHTTPError(res, "No se ha podido actualizar la publicación", INTERNAL_SERVER_ERROR);

    }

}

// Eliminación de posts
const deletePost = async (req, res) => {

    try{

        // Obtenemos el ID de la publicación a eliminar
        const { id } = matchedData(req);
        const { user } = req;

        // Obtenemos el post con la ID indicada
        const post = await postsModel.findOne({ where: { id: id }, include: "webpage" });
        
        // Comprobamos que el post existe
        if(!post || post.length <= 0){
            handleHTTPError(res, "No se ha encontrado la publicación a eliminar", NOT_FOUND);
            return;
        }

        // Comprobamos que la persona que elimina el post sea el propietario o un admin
        if(post.webpage.merchantID != user[PROPERTIES.id] && !(user.rol === "admin" || user.rol === "owner")){
            handleHTTPError(res, "No tienes autorización para eliminar esta publicación", UNAUTHORIZED);
            return;
        }

        // Eliminamos el post
        const data = await postsModel.deleteByID(id);

        if(data === "OK")
            handleHTTPResponse(res, "Publicación eliminada con éxito", data);
        else
            handleHTTPError(res, data, NOT_FOUND);

    }
    catch(err){

        postsLogger.error("ERROR [posts.controller / deletePost]: " + err);
        handleHTTPError(res, "No se ha podido eliminar la publicación", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    getPosts,
    getPost,
    getWebpagePosts,
    createPost,
    updatePost,
    deletePost
}