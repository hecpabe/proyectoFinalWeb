

/*
    Título: Session Middleware
    Nombre: Héctor Paredes Benavides
    Descripción: Cremaos un módulo que actúe como middleware para validar la autenticación de los usuarios
    Fecha: 20/4/2023
    Última Modificación: 20/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas propias
const { handleHTTPError, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR } = require("../utils/handleResponse.util");
const { verifyToken } = require("../utils/handleJWT.util");
const { usersModel } = require("../models/index");
const { getProperties } = require("../utils/handlePropertiesEngine.util");
const { jwtLogger } = require("../config/winstonLogger.config");

/* Declaraciones Constantes */
const PROPERTIES = getProperties();
const ROLES = {
    "owner": 0,
    "admin": 1,
    "merchant": 2,
    "user": 2
};

/* Codificación de Funciones Públicas */
// Autenticación mediante el token JWT
const authMiddleware = async (req, res, next) => {

    try{

        // Comprobamos que exista el token de sesión
        if(!req.headers.authorization){
            handleHTTPError(res, "No estás autenticado", UNAUTHORIZED);
            return;
        }

        // Nos llega lo siguiente: Bearer <TOKEN>, por lo que nos quedamos con la 2 parte
        const token = req.headers.authorization.split(' ').pop();

        // Obtenemos el Payload del token
        const tokenData = verifyToken(token);
        if(!tokenData){
            handleHTTPError(res, "Token no válido", UNAUTHORIZED);
            return;
        }

        // Obtenemos al usuario, comprobamos que la cuenta esté activada y lo pasamos a los siguientes pasos
        const user = await usersModel.selectOne(tokenData[PROPERTIES.id]);
        if(!user.accountEnabled){
            handleHTTPError(res, "Tu cuenta no está activada, actívala para poder usar la aplicación", UNAUTHORIZED);
            return;
        }
        req.user = user;

        next();

    }
    catch(err){

        jwtLogger.error("ERROR [session.middleware / authMiddleware]: " + err);
        handleHTTPError(res, "Sesión no válida", UNAUTHORIZED);

    }

}

// Autenticación para la activación de cuenta mediante el token JWT
const activateAccountMiddleware = async (req, res, next) => {

    try{

        const { token } = req.params;

        // Comprobamos que exista el token de sesión
        if(!token){
            handleHTTPError(res, "No estás autenticado", UNAUTHORIZED);
            return;
        }

        // Obtenemos el Payload del token
        const tokenData = verifyToken(token);
        if(!tokenData){
            handleHTTPError(res, "Token no válido", UNAUTHORIZED);
            return;
        }

        // Obtenemos al usuario, comprobamos que la cuenta no esté activada y lo pasamos a los siguientes pasos
        const user = await usersModel.selectOne(tokenData[PROPERTIES.id]);
        if(user.accountEnabled){
            handleHTTPError(res, "Tu cuenta ya ha sido activada", NOT_FOUND);
            return;
        }
        req.user = user;

        next();

    }
    catch(err){

        jwtLogger.error("ERROR [session.middleware / activateAccountMiddleware]: " + err);
        handleHTTPError(res, "Sesión no válida", UNAUTHORIZED);

    }

}

// Autenticación de recuperación de contraseña (Código) mediante el token JWT
const passwordRestorationEmailAuthMiddleware = async (req, res, next) => {

    try{

        // Comprobamos que exista el token de sesión
        if(!req.headers.authorization){
            handleHTTPError(res, "No se ha identificado la cuenta a recuperar", UNAUTHORIZED);
            return;
        }

        // Nos llega lo siguiente: Bearer <TOKEN>, por lo que nos quedamos con la 2 parte
        const token = req.headers.authorization.split(' ').pop();

        // Obtenemos el Payload del token
        const tokenData = verifyToken(token);
        if(!tokenData){
            handleHTTPError(res, "Token no válido", UNAUTHORIZED);
            return;
        }

        // Comprobamos que el usuario del token sea válido (no -1), en caso de que no sea válido diremos código incorrecto para evitar la enumeración de usuarios
        if(tokenData[PROPERTIES.id] === -1){
            handleHTTPError(res, "Código incorrecto", UNAUTHORIZED);
            return;
        }

        // Obtenemos la contraseña (Para comprobar que solo se utilice una vez el token), el ID de recuperación, el número máximo de intentos y el código
        req.password = tokenData.password;
        req.passwordRestorationID = tokenData.passwordRestorationID;
        req.maxAttempts = tokenData.maxAttempts;
        req.restorationCode = tokenData.code;

        // Obtenemos al usuario, comprobamos que la cuenta esté activada y lo pasamos a los siguientes pasos
        const user = await usersModel.selectOne(tokenData[PROPERTIES.id]);
        if(!user.accountEnabled){
            handleHTTPError(res, "Tu cuenta no está activada, actívala para poder usar la aplicación", UNAUTHORIZED);
            return;
        }
        req.user = user;

        next();

    }
    catch(err){

        jwtLogger.error("ERROR [session.middleware / passwordRestorationEmailAuthMiddleware]: " + err);
        handleHTTPError(res, "Sesión no válida", UNAUTHORIZED);

    }

}

// Autenticación de recuperación de contraseña (Contraseña) mediante el token JWT
const passwordRestorationPasswordAuthMiddleware = async (req, res, next) => {

    try{

        // Comprobamos que exista el token de sesión
        if(!req.headers.authorization){
            handleHTTPError(res, "No se ha identificado la cuenta a recuperar", UNAUTHORIZED);
            return;
        }

        // Nos llega lo siguiente: Bearer <TOKEN>, por lo que nos quedamos con la 2 parte
        const token = req.headers.authorization.split(' ').pop();

        // Obtenemos el Payload del token
        const tokenData = verifyToken(token);
        if(!tokenData){
            handleHTTPError(res, "Token no válido", UNAUTHORIZED);
            return;
        }

        // Obtenemos la contraseña anterior (Para que el token sea de un solo uso) y el ID de recuperación de contraseña
        req.password = tokenData.password;
        req.passwordRestorationID = tokenData.passwordRestorationID;

        // Obtenemos al usuario, comprobamos que la cuenta esté activada y lo pasamos a los siguientes pasos
        const user = await usersModel.selectOne(tokenData[PROPERTIES.id]);
        if(!user.accountEnabled){
            handleHTTPError(res, "Tu cuenta no está activada, actívala para poder usar la aplicación", UNAUTHORIZED);
            return;
        }
        req.user = user;

        next();

    }
    catch(err){

        jwtLogger.error("ERROR [session.middleware / passwordRestorationPasswordAuthMiddleware]: " + err);
        handleHTTPError(res, "Sesión no válida", UNAUTHORIZED);

    }

}

// Función con la que comprobamos que el usuario que está haciendo una acción es él mismo o uno con un permiso superior
const checkSameOrGreaterAdminRol = async (req, res, next) => {

    try{

        // Obtenemos el usuario afectado
        const { id } = req.params;
        const { user } = req;
        const affectedUser = await usersModel.selectOne(id);

        // Comprobamos que el usuario existe
        if(!affectedUser){
            handleHTTPError(res, "El usuario al que se quiere realizar la acción no existe", NOT_FOUND);
            return;
        }

        // Comprobamos que el usuario puede realizar la acción
        if(id != user[PROPERTIES.id] && !(ROLES[user.rol] < ROLES[affectedUser.rol])){
            handleHTTPError(res, "No tienes permiso para realizar esta acción", UNAUTHORIZED);
            return;
        }

        next();

    }
    catch(err){

        // Mostramos el error
        jwtLogger.error("ERROR [session.middleware / checkSameOrGreaterAdminRol]: " + err);
        handleHTTPError(res, "No se ha podido comprobar la autorización para realizar esta acción", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    authMiddleware,
    activateAccountMiddleware,
    passwordRestorationEmailAuthMiddleware,
    passwordRestorationPasswordAuthMiddleware,
    checkSameOrGreaterAdminRol
};