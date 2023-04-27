

/*
    Título: Merchants Validators
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar los validadores de los comerciantes
    Fecha: 25/4/2023
    Última Modificación: 25/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas 
const { check } = require("express-validator");

// Bibliotecas propias
const { validateResults } = require("../utils/handleValidator.util");

/* Declaraciones Constantes */
const DB_ENGINE = process.env.DB_ENGINE;

const MERCHANTNAME_MIN_LENGTH = 3;
const MERCHANTNAME_MAX_LENGTH = 20;
const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 75;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MIN_LOWERCASE = 1;
const PASSWORD_MIN_UPPERCASE = 1;
const PASSWORD_MIN_NUMBERS = 1;
const PASSWORD_MIN_SYMBOLS = 1;

/* Validaciones */
// Obtención de comerciantes por id
const validatorGetByID = [

    DB_ENGINE === "mysql" ?
        check("id").exists().notEmpty() :
        check("id").exists().notEmpty().isMongoId(),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Registro de comerciantes
const validatorCreate = [

    check("merchantname").exists().notEmpty().isLength({ min: MERCHANTNAME_MIN_LENGTH, max: MERCHANTNAME_MAX_LENGTH }),
    check("name").exists().notEmpty().isLength({ min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH }),
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isStrongPassword({
        minLength: PASSWORD_MIN_LENGTH,
        minLowercase: PASSWORD_MIN_LOWERCASE,
        minUppercase: PASSWORD_MIN_UPPERCASE,
        minNumbers: PASSWORD_MIN_NUMBERS,
        minSymbols: PASSWORD_MIN_SYMBOLS
    }),
    check("cif").exists().notEmpty(),
    check("phone").exists().notEmpty().isMobilePhone(),
    check("country").exists().notEmpty(),
    check("city").exists().notEmpty(),
    check("address").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Inicio de sesión de comerciantes
const validatorLogin = [

    check("merchantname").exists().notEmpty(),
    check("password").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Recuperación de contraseña (Email)
const validatorRestorePasswordEmail = [

    check("email").exists().notEmpty().isEmail(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Recuperación de contraseña (Código)
const validatorRestorePasswordCode = [

    check("code").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Recuperación de contraseña (Contraseña)
const validatorRestorePasswordPassword = [

    check("password").exists().notEmpty().isStrongPassword({
        minLength: PASSWORD_MIN_LENGTH,
        minLowercase: PASSWORD_MIN_LOWERCASE,
        minUppercase: PASSWORD_MIN_UPPERCASE,
        minNumbers: PASSWORD_MIN_NUMBERS,
        minSymbols: PASSWORD_MIN_SYMBOLS
    }),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Activación de cuenta
const validatorActivateAccount = [

    check("token").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

/* Exportado de Módulo */
module.exports = {
    validatorGetByID,
    validatorCreate,
    validatorLogin,
    validatorRestorePasswordEmail,
    validatorRestorePasswordCode,
    validatorRestorePasswordPassword,
    validatorActivateAccount
}