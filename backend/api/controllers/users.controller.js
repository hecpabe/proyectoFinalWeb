

/*
    Título: Users Controller
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un controlador para gestionar las peticiones de los usuarios
    Fecha: 18/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { matchedData } = require("express-validator");
const { Op } = require("sequelize");

// Bibliotecas propias
const { usersModel, passwordRestorationsModel } = require("../models");
const { handleHTTPResponse, handleHTTPError, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../utils/handleResponse.util");
const { hashPassword, comparePassword } = require("../utils/handlePassword.util");
const { tokenSign, tokenSignRestorationCode, tokenSignRestorationPassword } = require("../utils/handleJWT.util");
const { nodemailerLogger, usersLogger } = require("../config/winstonLogger.config");
const { generateRandomCode } = require("../utils/handleRandom.util");
const { getProperties } = require("../utils/handlePropertiesEngine.util");
const { nodemailerTransporter } = require("../config/nodemailer.config");
const { stringifyArray, stringToArray } = require("../utils/handleArray.util");

/* Declaraciones Constantes */
const RESTORE_PASSWORD_CODE_LENGTH = 6;
const PROPERTIES = getProperties();
const NODEMAILER_USER = process.env.NODEMAILER_USER;
const FAILED_LOGIN_MESSAGE = "El usuario o contraseña no son correctos, o la cuenta no está activada"

/* Codificación de Funciones */
/* Get Users: Método con el que obtenemos todos los usuarios
    Parámetros: 
        0: [STRING] Rol del usuario por el que filtrar
        1: [REQ] Request
        2: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(n) n -> Cantidad de usuarios
    Complejidad Espacial: O(n) n -> Cantidad de usuarios
*/
const getUsers = (rol) => async (req, res) => {

    try{

        // Obtenemos los datos de la base de datos y los mandamos
        const data = rol === "all" ? 
            await usersModel.findAll({ include: "image" }) :
            await usersModel.findAll({ where: { rol: rol }, include: "image" });

        // Quitamos las contraseñas y transformamos las preferencias a array antes de mandar los usuarios
        data.forEach(element => {
            element.set("password", undefined, { strict: false });
            if(element.preferences)
                element.set("preferences", stringToArray(element.preferences), { strict: false });
        });

        handleHTTPResponse(res, "Usuarios obtenidos con éxito", data);

    }
    catch(err){

        // Mostramos el error
        usersLogger.error("ERROR [users.controller / getUsers]: " + err);
        handleHTTPError(res, "No se han podido obtener los usuarios", INTERNAL_SERVER_ERROR);

    }

}

/* Get User: Método con el que obtenemos un usuario por ID y rol
    Parámetros: 
        0: [STRING] Rol por el que filtrar
        1: [REQ] Request
        2: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(n) n -> Cantidad de usuarios
    Complejidad Espacial: O(n) n -> Cantidad de usuarios
*/
const getUser = (rol) => async (req, res) => {

    try{

        // Obtenemos al usuario con la ID de la base de datos y lo devolvemos
        const { id } = matchedData(req);
        const data = rol === "all" ? 
            await usersModel.selectOne(id) :
            await usersModel.selectAllWhere({ [PROPERTIES.id]: id, rol: rol });

        // Comprobamos si se ha encontrado el usuario y le quitamos la contraseña antes de mandarlo
        if(Array.isArray(data)){

            // Si no se ha encontrado el usuario mandamos un mensaje diferente
            if(data.length <= 0){
                handleHTTPError(res, "No existe el usuario buscado", NOT_FOUND);
                return;
            }

            data.forEach(element => {
                element.set("password", undefined, { strict: false });
                element.set("preferences", stringToArray(element.preferences), { strict: false });
            })

        }
        else{

            // Si no se ha encontrado el usuario mandamos un mensaje diferente
            if(!data){
                handleHTTPError(res, "No existe el usuario buscado", NOT_FOUND);
                return;
            }

            data.set("password", undefined, { strict: false });
            data.set("preferences", stringToArray(data.preferences), { strict: false });

        }

        handleHTTPResponse(res, "Usuario obtenido con éxito", data);

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / getUser]: " + err);
        handleHTTPError(res, "No se ha podido obtener el usuario", INTERNAL_SERVER_ERROR);

    }

}

/* Get Users By Preference: Método con el que obtenemos todos los usuarios con una determinada preferencia que permitan publicidad
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(n) n -> Cantidad de usuarios
    Complejidad Espacial: O(n) n -> Cantidad de usuarios
*/
const getUsersByPreference = async (req, res) => {

    try{

        // Obtenemos el tipo de comercio a buscar
        const { type } = matchedData(req);

        // Buscamos a los usuarios con esa preferencia y que además tengan habilitado el poder recibir ofertas
        const data = await usersModel.selectAllWhere({
            [Op.and]: [
                { preferences: { [Op.like]: `%${type}%` } },
                { allowAdvertising: true }
            ]
        });

        // Quitamos las contraseñas y transformamos las preferencias a array antes de mandar los usuarios
        data.forEach(element => {
            element.set("password", undefined, { strict: false });
            element.set("preferences", stringToArray(element.preferences), { strict: false });
        });

        if(!data || data.length <= 0){
            handleHTTPError(res, "No se ha encontrado ningún usuario", NOT_FOUND);
            return;
        }

        handleHTTPResponse(res, "Usuarios obtenidos con éxito", data);

    }
    catch(err){

        // Mostramos el error
        usersLogger.error("ERROR [users.controller / getUsersByPreference]: " + err);
        handleHTTPError(res, "No se han podido obtener los usuarios", INTERNAL_SERVER_ERROR);

    }

}

/* Create User: Método con el que creamos un usuario
    Parámetros: 
        0: [STRING] Rol del nuevo usuario
        1: [REQ] Request
        2: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const createUser = (rol) => async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        req = matchedData(req);

        // Comprobamos si ya existe el usuario
        const users = process.env.DB_ENGINE === "mysql" ?
            await usersModel.selectAllWhere({
                [Op.or]: [
                    { username: req.username },
                    { email: req.email }
                ]
            }) :
            await usersModel.find({
                $or: [
                    { username: req.username },
                    { email: req.email }
                ]
            });

        if(users.length > 0){
            handleHTTPError(res, "No se ha podido crear el usuario");
            return;
        }

        // Generamos la contraseña hasheada, la cambiamos en el body y creamos al nuevo usuario
        const hashedPassword = await hashPassword(req.password);
        const body = { ...req, password: hashedPassword, rol: rol, accountEnabled: false, preferences: stringifyArray(req.preferences) };
        const dataUser = await usersModel.insert(body);

        // Eliminamos el atributo password de la contraseña para no mandarla, y transformamos las preferencias a array
        dataUser.set("password", undefined, { strict: false });
        dataUser.set("preferences", stringToArray(dataUser.preferences), { strict: false });

        // Mandamos el token de sesión junto a la información del usuario
        const mailOptions = {
            from: NODEMAILER_USER,
            to: req.email,
            subject: `CommerceGo Activar Usuario (${req.username})`,
            text: 'Enlace de activación: ' + process.env.PUBLIC_URL + "/accounts/activate/" + tokenSign(dataUser)
        }

        // Mandamos el correo
        await nodemailerTransporter.sendMail(mailOptions, (error, info) => {

            if(error){
                nodemailerLogger.error("ERROR [admins.controller / restorePasswordEmail]: " + error);
                handleHTTPError(res, "No se ha podido iniciar la recuperación de contraseña", INTERNAL_SERVER_ERROR);
                return;
            }

        });

        handleHTTPResponse(res, "Usuario creado con éxito", {});

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / createUser]: " + err);
        handleHTTPError(res, "No se ha podido crear el usuario");

    }
    
}

/* Login User: Método con el que iniciamos la sesión de un usuario
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const loginUser = async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        req = matchedData(req);

        // Buscamos al usuario con el username o email introducido
        const users = req.username.includes("@") ? 
            await usersModel.selectAllWhere({ email: req.username }) :
            await usersModel.selectAllWhere({ username: req.username });

        const user = users[0];

        // Comprobamos que el usuario exista
        if(!user){
            handleHTTPError(res, FAILED_LOGIN_MESSAGE, NOT_FOUND);
            return;
        }

        // Comprobamos que el usuario esté habilitado
        if(!user.accountEnabled){
            handleHTTPError(res, FAILED_LOGIN_MESSAGE, NOT_FOUND);
            return;
        }

        // Comprobamos que la contraseña sea correcta (Mandamos el mismo error para evitar enumeración de usuarios)
        const check = await comparePassword(req.password, user.password);
        if(!check){
            handleHTTPError(res, FAILED_LOGIN_MESSAGE, NOT_FOUND);
            return;
        }

        // Devolvemos el usuario
        user.set("password", undefined, { strict: false });
        if(user.preferences != undefined)
            user.set("preferences", stringToArray(user.preferences), { strict: false });
        const data = {
            token: tokenSign(user),
            user
        };

        handleHTTPResponse(res, "Iniciada la sesión con éxito", data);

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / loginUsers]: " + err);
        handleHTTPError(res, "No se ha podido iniciar sesión", INTERNAL_SERVER_ERROR);

    }

}

/* Restore Password Email: Método con el que iniciamos un proceso de recuperación de contraseña
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const restorePasswordEmail = async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        req = matchedData(req);

        // Comprobamos que el email esté registrado
        var user = await usersModel.selectAllWhere({ email: req.email });
        user = user[0];
        
        // Si el usuario no existe o este no está activado generamos uno con atributos básicos falsos para que el sistema "funcione" sin que tenga que 
        //mandarle un error para evitar enumeración de usuarios
        if(!user || !user.accountEnabled){
            user = {};
            user[PROPERTIES.id] = -1;
            user.password = "dumb";
            user.passwordRestorationID = -1;
        }

        // Generamos un código y se lo incrustamos al usuario para meterlo en JWT y mandarlo por correo
        user.code = generateRandomCode(RESTORE_PASSWORD_CODE_LENGTH);

        // Si el usuario existe mandamos el correo
        if(user[PROPERTIES.id] != -1){

            // Variables necesarias
            const mailOptions = {
                from: NODEMAILER_USER,
                to: req.email,
                subject: 'CommerceGo Restablecer contraseña',
                text: 'Código de recuperación: ' + user.code
            }

            // Mandamos el correo
            await nodemailerTransporter.sendMail(mailOptions, (error, info) => {

                if(error){
                    nodemailerLogger.error("ERROR [users.controller / restorePasswordEmail]: " + error);
                    handleHTTPError(res, "No se ha podido iniciar la recuperación de contraseña", INTERNAL_SERVER_ERROR);
                    return;
                }

            });

            // Generamos un nuevo registro de recuperación de contraseña
            const passwordRestorationBody = {
                userID: user[PROPERTIES.id],
                attempts: 0
            }
            const passwordRestorationData = await passwordRestorationsModel.insert(passwordRestorationBody);
            user.passwordRestorationID = passwordRestorationData[PROPERTIES.id];
            
        }

        // Le mandamos como respuesta el token para introducir el código
        const data = {
            token: tokenSignRestorationCode(user)
        };

        handleHTTPResponse(res, "Iniciado el proceso de recuperación de contraseña", data);

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / restorePasswordEmail]: " + err);
        handleHTTPError(res, "No se ha podido iniciar la recuperación de contraseña", INTERNAL_SERVER_ERROR);

    }

}

/* Restore Password Code: Método con el que autenticamos al usuario mediante el código para que pueda restaurar la contraseña
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const restorePasswordCode = async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        const body = matchedData(req);

        // Obtenemos el registro de restauración de contraseña
        const passwordRestorationData = await passwordRestorationsModel.selectOne(req.passwordRestorationID);
        const user = req.user;

        // Comprobamos que el registro exista
        if(!passwordRestorationData){
            handleHTTPError(res, "La petición de restaurar contraseña para este correo no existe, inténtelo de nuevo desde el principio", NOT_FOUND);
            return;
        }

        // Comprobamos que no supere el número máximo de intentos
        if(passwordRestorationData.attempts > req.maxAttempts){
            
            handleHTTPError(res, "Has realizado demasiados intentos");

            // Eliminamos la petición de restaurar contraseña
            await passwordRestorationsModel.deleteByID(req.passwordRestorationID);

            return;

        }

        // Comprobamos que no haya cambiado ya de contraseña
        if(req.password != user.password){
            handleHTTPError(res, "Ya has finalizado el proceso de cambio de contraseña");
            return;
        }

        // Comprobamos que el código introducido por el usuario es el mismo que el generado
        if(body.code != req.restorationCode){
            handleHTTPError(res, "Código no válido");
            const id = passwordRestorationData[PROPERTIES.id];
            await passwordRestorationsModel.updateByID(id, {
                "attempts": passwordRestorationData.attempts + 1
            });
            return;
        }

        // Si el código es correcto generamos un nuevo token para poder cambiar la contraseña y lo mandamos
        user.passwordRestorationID = req.passwordRestorationID;
        const data = {
            token: tokenSignRestorationPassword(user)
        }
        handleHTTPResponse(res, "Código aceptado", data);

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / restorePasswordCode]: " + err);
        handleHTTPError(res, "No se ha podido comprobar el código", INTERNAL_SERVER_ERROR);

    }

}

/* Restore Password: Método con el que restauramos la contraseña de un usuario
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const restorePassword = async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        const body = matchedData(req);

        // Comprobamos que la contraseña del token sea la misma que la del usuario (Para asegurar que sea de un solo uso)
        const user = await usersModel.selectOne(req.user[PROPERTIES.id]);
        if(user.password != req.password){
            handleHTTPError(res, "Ya has finalizado el proceso de cambio de contraseña");
            return;
        }

        // Hasheamos la contraseña 
        const hashedPassword = await hashPassword(body.password);

        // Actualizamos la contraseña del usuario
        const data = await usersModel.updateByID(req.user[PROPERTIES.id], {
            "password": hashedPassword
        });

        // Borramos el registro de la petición de recuperación de contraseña
        await passwordRestorationsModel.deleteByID(req.passwordRestorationID);

        
        if(!data[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido restablecer la contraseña, inténtelo de nuevo desde el principio", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Contraseña restablecida con éxito", {});    

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / restorePassword]: " + err);
        handleHTTPError(res, "No se ha podido restablecer la contraseña, inténtelo de nuevo desde el principio", INTERNAL_SERVER_ERROR);

    }

}

/* Update User: Método con el que modificamos un usuario
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const updateUser = async (req, res) => {

    try{

        // Obtenemos el usuario a modificar
        const { id, ...body } = matchedData(req);
        const userBeforeUpdate = await usersModel.selectOne(id);
        
        // Mantenemos el mismo rol
        body.rol = userBeforeUpdate.rol;

        // Comprobamos que no haya otros usuarios con el mismo username o email
        const otherUsers = process.env.DB_ENGINE === "mysql" ?
            await usersModel.selectAllWhere({
                [Op.or]: [
                    { username: body.username },
                    { email: body.email }
                ]
            }) :
            await usersModel.find({
                $or: [
                    { username: body.username },
                    { email: body.email }
                ]
            });

        if(process.env.DB_ENGINE === "mysql"){
            if(
                otherUsers.length > 1 || 
                (
                    otherUsers.length === 1 && 
                    otherUsers[0][PROPERTIES.id] != userBeforeUpdate[PROPERTIES.id]
                )
            ){
                handleHTTPError(res, "El usuario o email introducidos no son válidos");
                return;
            }
        }
        else
            if(
                otherUsers.length > 1 || 
                (
                    otherUsers.length === 1 && 
                    otherUsers[0][PROPERTIES.id].toHexString() != userBeforeUpdate[PROPERTIES.id].toHexString()
                )
            ){
                handleHTTPError(res, "El usuario o email introducidos no son válidos");
                return;
            }

        // Hasheamos la nueva contraseña
        body.password = await hashPassword(body.password);

        // Transformamos el array de preferencias
        body.preferences = stringifyArray(body.preferences);

        // Realizamos el update
        const data = await usersModel.updateByID(id, body);

        if(!data[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido actualizar el usuario", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Usuario modificado con éxito", {});    

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / updateUser]: " + err);
        handleHTTPError(res, "No se ha podido actualizar el usuario", INTERNAL_SERVER_ERROR);

    }

}

/* Delete User: Método con el que eliminamos a un usuario
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const deleteUser = async (req, res) => {

    try{

        // Obtenemos el ID del usuario a eliminar
        const { id } = matchedData(req);

        // Eliminamos el usuario y devolvemos la respuesta
        const data = await usersModel.deleteByID(id);
        if(data === "OK")
            handleHTTPResponse(res, "Usuario eliminado con éxito", data);
        else
            handleHTTPError(res, data, NOT_FOUND);

    }
    catch(err){

        // Mostramos el error
        usersLogger.error("ERROR [users.controller / deleteUser]: " + err);
        handleHTTPError(res, "No se ha podido eliminar el usuario", INTERNAL_SERVER_ERROR);

    }

}

/* Promote User: Método con el que ascendemos a un usuario
    Parámetros: 
        0: [STRING] Nuevo rol para el usuario
        1: [REQ] Request
        2: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const promoteUser = (newRol) => async (req, res) => {

    try{

        // Obtenemos el usuario a ascender
        const { id } = matchedData(req);
        const userToPromote = await usersModel.selectOne(id);

        // Comprobamos que el usuario a ascender exista
        if(!userToPromote){
            handleHTTPError(res, "El usuario a ascender no existe", NOT_FOUND);
            return;
        }

        // Acualizamos el rol del usuario
        const newBody = {
            "rol": newRol
        }
        const data = await usersModel.updateByID(id, newBody);
        
        if(!data[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido ascender al usuario00000", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Usuario ascendido con éxito", {});

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / promoteUser]: " + err);
        handleHTTPError(res, "No se ha podido ascender el usuarioasdasd", INTERNAL_SERVER_ERROR);

    }

}

/* Activate User: Método con el que activamos a un usuario
    Parámetros: 
        0: [REQ] Request
        1: [RES] Response
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const activateUser = async (req, res) => {

    try{

        // Obtenemos el usuario y su ID
        const user = req.user;
        const userID = user[PROPERTIES.id];

        // Establecemos la cuenta como activada
        const updateResult = await usersModel.updateByID(userID, {
            "accountEnabled": true
        });

        const data = {
            token: tokenSign(user)
        }

        
        if(!updateResult[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido activar la cuenta", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Cuenta activada con éxito", data);

    }
    catch(err){

        usersLogger.error("ERROR [users.controller / activateUser]: " + err);
        handleHTTPError(res, "No se ha podido activar la cuenta", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    getUsers,
    getUser,
    getUsersByPreference,
    createUser,
    loginUser,
    restorePasswordEmail,
    restorePasswordCode,
    restorePassword,
    updateUser,
    deleteUser,
    promoteUser,
    activateUser
}