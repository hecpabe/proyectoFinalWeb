

/*
    Título: Rol Middleware
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo que funcione de middleware para verificar el rol de la persona
    Fecha: 20/4/2023
    Última Modificación: 20/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas propias
const { handleHTTPError, UNAUTHORIZED, INTERNAL_SERVER_ERROR } = require("../utils/handleResponse.util");
const { jwtLogger } = require("../config/winstonLogger.config");

/* Codificación de Funciones */
// Comprobación de roles
const checkRol = (rolesAllowed) => (req, res, next) => {

    try{

        // Obtenemos el rol del usuario
        const { user } = req;
        const userRol = user.rol === undefined ? "merchant" : user.rol;

        // Comprobamos que el rol del usuario permita realizar la acción
        if(!rolesAllowed.includes(userRol)){
            handleHTTPError(res, "No tienes autorización para esta acción", UNAUTHORIZED);
            return;
        }

        // Si lo permite continuamos
        next();

    }
    catch(err){

        jwtLogger.error("ERROR [rol.middleware / checkRol]: " + err);
        handleHTTPError(res, "No se ha podido comprobar si tienes autorización", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    checkRol
};