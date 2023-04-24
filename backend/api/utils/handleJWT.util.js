

/*
    Título: Handle JWT Util
    Nombre: Héctor Paredes Benavides
    Descripción: Cremaos una utilidad para gestionar los tokens de JWT
    Fecha: 18/4/2023
    Última Modificación: 18/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const jwt = require("jsonwebtoken");

// Bibliotecas propias
const { getProperties } = require("../utils/handlePropertiesEngine.util");
const jwtLogger = require("../config/winstonLogger.config")

/* Definición de Constantes */
const JWT_SECRET = process.env.JWT_SECRET;
const NORMAL_TOKENS_EXPIRATION = "2h";
const PASSWORD_RESTORATION_CODE_TOKENS_EXPIRATION = "30m";
const PASSWORD_RESTORATION_TOKENS_EXPIRATION = "5m";
const PASSWORD_RESTORATION_CODE_MAX_ATTEMPTS = 5;
const PROPERTIES = getProperties();

/* Codificación de Funciones */
// Creación del token de usuarios
const tokenSign = (user) => {

    const sign = jwt.sign(
        {
            [PROPERTIES.id]: user[PROPERTIES.id],
            rol: user.rol
        },
        JWT_SECRET,
        {
            expiresIn: NORMAL_TOKENS_EXPIRATION
        }
    );

    return sign;

}

// Creación del token de recuperación de contraseñas (código)
const tokenSignRestorationCode = (user) => {

    const sign = jwt.sign(
        {
            [PROPERTIES.id]: user[PROPERTIES.id],
            code: user.code,
            password: user.password,
            passwordRestorationID: user.passwordRestorationID,
            maxAttempts: PASSWORD_RESTORATION_CODE_MAX_ATTEMPTS
        },
        JWT_SECRET,
        {
            expiresIn: PASSWORD_RESTORATION_CODE_TOKENS_EXPIRATION
        }
    );

    return sign;

}

// Creación del token de recuperación de contraseñas (contraseña)
const tokenSignRestorationPassword = (user) => {

    const sign = jwt.sign(
        {
            [PROPERTIES.id]: user[PROPERTIES.id],
            password: user.password,
            passwordRestorationID: user.passwordRestorationID
        },
        JWT_SECRET,
        {
            expiresIn: PASSWORD_RESTORATION_TOKENS_EXPIRATION
        }
    );

    return sign;

}

// Verificación de tokens
const verifyToken = (JWTToken) => {

    try{

        return jwt.verify(JWTToken, JWT_SECRET);

    }
    catch(err){

        jwtLogger.error(`ERROR [handleJWT.util / verifyToken]: ${err}`);

    }

}

/* Exportado de Módulo */
module.exports = {
    tokenSign,
    tokenSignRestorationCode,
    tokenSignRestorationPassword,
    verifyToken
}