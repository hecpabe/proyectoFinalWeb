

/*
    Título: Handle JWT Util
    Nombre: Héctor Paredes Benavides
    Descripción: Cremaos una utilidad para gestionar los tokens de JWT
    Fecha: 18/4/2023
    Última Modificación: 8/5/2023
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
/* Token Sign: Método con el que generamos tokens JWT para la autenticación de usuarios
    Parámetros: 
        0: [USER] Usuario con el que generar el token
    Retorno: [TOKEN] Token generado
    Precondición: El usuario tiene que tener una ID y un rol
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
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

/* Token Sign Restoration Code: Método con el que generamos tokens JWT para la autenticación de usuarios que pidan la recuperación de contraseña
    Parámetros: 
        0: [USER] Usuario con el que generar el token
    Retorno: [TOKEN] Token generado
    Precondición: El usuario tiene que tener una ID, un código, una contraseña, la ID de recuperación de contraseña asociada y el número máximo de intentos permitidos
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
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
/* Token Sign Restoration Password: Método con el que generamos tokens JWT para la autenticación de usuarios que pueden restablecer su contraseña
    Parámetros: 
        0: [USER] Usuario con el que generar el token
    Retorno: [TOKEN] Token generado
    Precondición: El usuario tiene que tener una ID, una contraseña y una ID de recuperación de contraseña asociada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
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

/* Verify Token: Método con el que verificamos la validez de un token JWT y lo descodificamos
    Parámetros: 
        0: [USER] Usuario con el que generar el token
    Retorno: [JSON] Datos extraídos del token
    Precondición: Ninguna
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
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