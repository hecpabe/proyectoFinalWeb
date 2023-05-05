

/*
    Título: Merchants Controller
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el controlador de los comerciantes
    Fecha: 25/4/2023
    Última Modificación: 25/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { matchedData } = require("express-validator");
const { Op } = require("sequelize");

// Bibliotecas propias
const { merchantsModel, merchantsPasswordRestorationsModel } = require("../models");
const { handleHTTPResponse, handleHTTPError, INTERNAL_SERVER_ERROR, NOT_FOUND } = require("../utils/handleResponse.util");
const { merchantsLogger, nodemailerLogger } = require("../config/winstonLogger.config");
const { hashPassword, comparePassword } = require("../utils/handlePassword.util");
const { nodemailerTransporter } = require("../config/nodemailer.config");
const { tokenSign, tokenSignRestorationCode, tokenSignRestorationPassword } = require("../utils/handleJWT.util");
const { getProperties } = require("../utils/handlePropertiesEngine.util");
const { generateRandomCode } = require("../utils/handleRandom.util");

/* Declaraciones Constantes */
const PROPERTIES = getProperties();
const NODEMAILER_USER = process.env.NODEMAILER_USER;
const FAILED_LOGIN_MESSAGE = "El usuario o contraseña no son correctos, o la cuenta no está activada y aceptada"
const RESTORE_PASSWORD_CODE_LENGTH = 6;

/* Codificación de Funciones */
// Obtención de todos los comerciantes
const getMerchants = async (req, res) => {

    try{

        // Obtenemos todos los datos de la base de datos y los mandamos
        const data = await merchantsModel.selectAll();

        // Quitamos las contraseñas antes de mandar la información
        data.forEach(element => {
            element.set("password", undefined, { strict: false });
        });

        handleHTTPResponse(res, "Comerciantes obtenidos con éxito", data);

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / getMerchants]: " + err);
        handleHTTPError(res, "No se han podido obtener los comerciantes", INTERNAL_SERVER_ERROR);

    }

}

// Obtención de un comerciante
const getMerchant = async (req, res) => {

    try{

        // Obtenemos un comerciante con la ID de la base de datos y lo devolvemos
        const { id } = matchedData(req);
        const data = await merchantsModel.selectOne(id);

        // Si no existe el comerciante mandamos error
        if(!data){
            handleHTTPError(res, "No existe el comerciante buscado", NOT_FOUND);
            return;
        }

        // Si existe quitamos la contraseña de la respuesta y lo devolvemos
        data.set("password", undefined, { strict: false });
        handleHTTPResponse(res, "Comerciante obtenido con éxito", data);

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / getMerchant]: " + err);
        handleHTTPError(res, "No se ha podido obtener el comerciante", INTERNAL_SERVER_ERROR);

    }

}

// Creación de un comerciante
const createMerchant = async(req, res) => {

    try{

        // Nos quedamos con el body de la petición
        req = matchedData(req);

        // Comprobamos si ya existe el comerciante
        const merchants = process.env.DB_ENGINE === "mysql" ?
            await merchantsModel.selectAllWhere({
                [Op.or]: [
                    { merchantname: req.merchantname },
                    { email: req.email },
                    { cif: req.cif },
                    { phone: req.phone }
                ]
            }) :
            await merchantsModel.find({
                $or: [
                    { merchantname: req.merchantname },
                    { email: req.email },
                    { cif: req.cif },
                    { phone: req.phone }
                ]
            });
        
        if(merchants.length > 0){
            handleHTTPError(res, "1 No se ha podido crear el comerciante");
            return;
        }

        // Hasheamos la contraseña, cambiamos el body y generamos el comerciante
        const hashedPassword = await hashPassword(req.password);
        const body = { ...req, password: hashedPassword, accountEnabled: false, accountAccepted: false };
        const dataMerchant = await merchantsModel.insert(body);

        // Quitamos la password de la respuesta para no mandarla
        dataMerchant.set("password", undefined, { strict: false });

        // Mandamos el token de sesión junto a la información del usuario
        const mailOptions = {
            from: NODEMAILER_USER,
            to: req.email,
            subject: `CommerceGo Activar Comerciante (${req.merchantname})`,
            text: 'Enlace de activación: ' + process.env.PUBLIC_URL + "/merchants/activate/" + tokenSign(dataMerchant)
        }

        // Mandamos el correo
        await nodemailerTransporter.sendMail(mailOptions, async (error, info) => {

            if(error){
                nodemailerLogger.error("ERROR [merchants.controller / createMerchant]: " + error);
                await merchantsModel.deleteByID(dataMerchant.id);
                handleHTTPError(res, "No se ha podido mandar el correo de activación", INTERNAL_SERVER_ERROR);
                return;
            }

        });

        handleHTTPResponse(res, "Comerciante creado con éxito, activa tu cuenta con el enlace que hemos mandado a tu correo y espera a que te acepten la cuenta", {});

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / createMerchant]: " + err);
        handleHTTPError(res, "No se ha podido crear el comerciante");

    }

}

// Login de un comerciante
const loginMerchant = async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        req = matchedData(req);

        // Buscamos al comerciante con el username o email introducido
        const merchants = req.merchantname.includes("@") ? 
            await merchantsModel.selectAllWhere({ email: req.merchantname }) :
            await merchantsModel.selectAllWhere({ merchantname: req.merchantname });

        const merchant = merchants[0];

        // Comprobamos que el comerciante exista
        if(!merchant){
            handleHTTPError(res, FAILED_LOGIN_MESSAGE, NOT_FOUND);
            return;
        }

        // Comprobamos que el comerciante esté habilitado
        if(!merchant.accountEnabled){
            handleHTTPError(res, FAILED_LOGIN_MESSAGE, NOT_FOUND);
            return;
        }

        // Comprobamos que el comerciante esté aceptado
        if(!merchant.accountAccepted){
            handleHTTPError(res, FAILED_LOGIN_MESSAGE, NOT_FOUND);
            return;
        }

        // Comprobamos que la contraseña sea correcta (Mandamos el mismo error para evitar enumeración de usuarios)
        const check = await comparePassword(req.password, merchant.password);
        if(!check){
            handleHTTPError(res, FAILED_LOGIN_MESSAGE, NOT_FOUND);
            return;
        }

        // Devolvemos el comerciante
        merchant.set("password", undefined, { strict: false });
        const data = {
            token: tokenSign(merchant),
            merchant
        };

        handleHTTPResponse(res, "Iniciada la sesión con éxito", data);

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / loginMerchant]: " + err);
        handleHTTPError(res, "No se ha podido iniciar sesión", INTERNAL_SERVER_ERROR);

    }

}

// Recuperación de contraseña (Email) de un comerciante
const restorePasswordEmail = async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        req = matchedData(req);

        // Comprobamos que el email esté registrado
        var merchant = await merchantsModel.selectAllWhere({ email: req.email });
        merchant = merchant[0];

        // Si el comerciante no existe o este no está activado generamos uno con atributos básicos falsos para que el sistema "funcione" sin que tenga que 
        //mandarle un error para evitar enumeración de usuarios
        if(!merchant || !merchant.accountEnabled || !merchant.accountAccepted){
            merchant = {};
            merchant[PROPERTIES.id] = -1;
            merchant.password = "dumb";
            merchant.passwordRestorationID = -1;
        }

        // Generamos un código y se lo incrustamos al comerciante para meterlo en JWT y mandarlo por correo
        merchant.code = generateRandomCode(RESTORE_PASSWORD_CODE_LENGTH);

        // Si el comerciante existe mandamos el correo
        if(merchant[PROPERTIES.id] != -1){

            // Variables necesarias
            const mailOptions = {
                from: NODEMAILER_USER,
                to: req.email,
                subject: 'CommerceGo Restablecer contraseña',
                text: 'Código de recuperación: ' + merchant.code
            }

            // Mandamos el correo
            await nodemailerTransporter.sendMail(mailOptions, (error, info) => {

                if(error){
                    nodemailerLogger.error("ERROR [merchant.controller / restorePasswordEmail]: " + error);
                    handleHTTPError(res, "No se ha podido iniciar la recuperación de contraseña", INTERNAL_SERVER_ERROR);
                    return;
                }

            });

            // Generamos un nuevo registro de recuperación de contraseña
            const passwordRestorationBody = {
                merchantID: merchant[PROPERTIES.id],
                attempts: 0
            }
            const passwordRestorationData = await merchantsPasswordRestorationsModel.insert(passwordRestorationBody);
            merchant.passwordRestorationID = passwordRestorationData[PROPERTIES.id];
            
        }

        // Le mandamos como respuesta el token para introducir el código
        const data = {
            token: tokenSignRestorationCode(merchant)
        };

        handleHTTPResponse(res, "Iniciado el proceso de recuperación de contraseña", data);

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / restorePasswordEmail]: " + err);
        handleHTTPError(res, "No se ha podido iniciar la recuperación de contraseña", INTERNAL_SERVER_ERROR);

    }

}

// Recuperación de contraseña (Código) de un comerciante
const restorePasswordCode = async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        const body = matchedData(req);

        // Obtenemos el registro de restauración de contraseña
        const passwordRestorationData = await merchantsPasswordRestorationsModel.selectOne(req.passwordRestorationID);
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
            await merchantsPasswordRestorationsModel.deleteByID(req.passwordRestorationID);

            return;

        }

        // Comprobamos que no haya cambiado ya de contraseña
        if(req.password != user.password){
            handleHTTPError(res, "Ya has finalizado el proceso de cambio de contraseña");
            return;
        }

        // Comprobamos que el código introducido por el comerciante es el mismo que el generado
        if(body.code != req.restorationCode){
            handleHTTPError(res, "Código no válido");
            const id = passwordRestorationData[PROPERTIES.id];
            await merchantsPasswordRestorationsModel.updateByID(id, {
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

        merchantsLogger.error("ERROR [merchants.controller / restorePasswordCode]: " + err);
        handleHTTPError(res, "No se ha podido comprobar el código", INTERNAL_SERVER_ERROR);

    }

}

// Recuperación de contraseña (Contraseña) de un comerciante
const restorePassword = async (req, res) => {

    try{

        // Nos quedamos con el body de la petición
        const body = matchedData(req);

        // Comprobamos que la contraseña del token sea la misma que la del usuario (Para asegurar que sea de un solo uso)
        const merchant = await merchantsModel.selectOne(req.user[PROPERTIES.id]);
        if(merchant.password != req.password){
            handleHTTPError(res, "Ya has finalizado el proceso de cambio de contraseña");
            return;
        }

        // Hasheamos la contraseña 
        const hashedPassword = await hashPassword(body.password);

        // Actualizamos la contraseña del usuario
        const data = await merchantsModel.updateByID(req.user[PROPERTIES.id], {
            "password": hashedPassword
        });

        // Borramos el registro de la petición de recuperación de contraseña
        await merchantsPasswordRestorationsModel.deleteByID(req.passwordRestorationID);

        
        if(!data[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido restablecer la contraseña, inténtelo de nuevo desde el principio", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Contraseña restablecida con éxito", {});    

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / restorePassword]: " + err);
        handleHTTPError(res, "No se ha podido restablecer la contraseña, inténtelo de nuevo desde el principio", INTERNAL_SERVER_ERROR);

    }

}

// Modificación de un comerciante
const updateMerchant = async (req, res) => {

    try{

        // Obtenemos el comerciante a modificar
        const { id, ...body } = matchedData(req);
        const merchantBeforeUpdate = await merchantsModel.selectOne(id);

        // Comprobamos que no haya otros usuarios con el mismo username o email
        const otherMerchants = process.env.DB_ENGINE === "mysql" ?
            await merchantsModel.selectAllWhere({
                [Op.or]: [
                    { merchantname: body.merchantname },
                    { email: body.email }
                ]
            }) :
            await merchantsModel.find({
                $or: [
                    { merchantname: body.merchantname },
                    { email: body.email }
                ]
            });
        
        if(process.env.DB_ENGINE === "mysql"){
            if(
                otherMerchants.length > 1 || 
                (
                    otherMerchants.length === 1 && 
                    otherMerchants[0][PROPERTIES.id] != merchantBeforeUpdate[PROPERTIES.id]
                )
            ){
                handleHTTPError(res, "El usuario o email introducidos no son válidos");
                return;
            }
        }
        else
            if(
                otherMerchants.length > 1 || 
                (
                    otherMerchants.length === 1 && 
                    otherMerchants[0][PROPERTIES.id].toHexString() != merchantBeforeUpdate[PROPERTIES.id].toHexString()
                )
            ){
                handleHTTPError(res, "El usuario o email introducidos no son válidos");
                return;
            }
        
        // Hasheamos la nueva contraseña
        body.password = await hashPassword(body.password);

        // Realizamos el update
        const data = await merchantsModel.updateByID(id, body);

        if(!data[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido actualizar el usuario", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Usuario modificado con éxito", {});    

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / updateMerchant]: " + err);
        handleHTTPError(res, "No se ha podido actualizar el comerciante", INTERNAL_SERVER_ERROR);

    }

}

// Eliminación de un comerciante
const deleteMerchant = async (req, res) => {

    try{

        // Obtenemos el ID del comerciante a eliminar
        const { id } = matchedData(req);

        // Eliminamos el comerciante y devolvemos la respuesta
        const data = await merchantsModel.deleteByID(id);
        if(data === "OK")
            handleHTTPResponse(res, "Comerciante eliminado con éxito", data);
        else
            handleHTTPError(res, data, NOT_FOUND);

    }
    catch(err){

        // Mostramos el error
        merchantsLogger.error("ERROR [merchants.controller / deleteMerchant]: " + err);
        handleHTTPError(res, "No se ha podido eliminar el comerciante", INTERNAL_SERVER_ERROR);

    }

}

// Activación de un comerciante
const activateMerchant = async (req, res) => {

    try{

        // Obtenemos el comerciante y su ID
        const merchant = req.merchant;
        const merchantID = merchant[PROPERTIES.id];

        // Establecemos la cuenta como activada
        const updateResult = await merchantsModel.updateByID(merchantID, {
            "accountEnabled": true
        });

        if(!updateResult[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido activar la cuenta", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Cuenta activada con éxito, ahora tendrás que esperar a que un administrador te acepte la solicitud", {});

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / activateMerchant]: " + err);
        handleHTTPError(res, "No se ha podido activar la cuenta", INTERNAL_SERVER_ERROR);

    }

}

// Aceptación de un comerciante
const acceptMerchant = async (req, res) => {

    try{

        // Obtenemos el ID del comerciante a aceptar
        const { id } = matchedData(req);

        // Establecemos la cuenta como aceptada
        const updateResult = await merchantsModel.updateByID(id, {
            "accountAccepted": true
        });

        if(!updateResult[0] && process.env.DB_ENGINE === "mysql")
            handleHTTPError(res, "No se ha podido aceptar la cuenta", INTERNAL_SERVER_ERROR);
        else
            handleHTTPResponse(res, "Cuenta aceptada con éxito", {});

    }
    catch(err){

        merchantsLogger.error("ERROR [merchants.controller / acceptMerchant]: " + err);
        handleHTTPError(res, "No se ha podido aceptar la cuenta", INTERNAL_SERVER_ERROR);

    }

}

/* Exportado de Módulo */
module.exports = {
    getMerchants,
    getMerchant,
    createMerchant,
    loginMerchant,
    restorePasswordEmail,
    restorePasswordCode,
    restorePassword,
    updateMerchant,
    deleteMerchant,
    activateMerchant,
    acceptMerchant
};