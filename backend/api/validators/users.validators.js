

/*
    Título: Users Validator
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para el middleware de validación de usuarios
    Fecha: 20/4/2023
    Última Modificación: 20/4/2023
*/

/* Importado de bibliotecas */
// Bibliotecas externas
const { check } = require("express-validator");

// Bibliotecas propias
const { validateResults } = require("../utils/handleValidator.util");

/* Declaraciones Constantes */
const DB_ENGINE = process.env.DB_ENGINE;

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MIN_LOWERCASE = 1;
const PASSWORD_MIN_UPPERCASE = 1;
const PASSWORD_MIN_NUMBERS = 1;
const PASSWORD_MIN_SYMBOLS = 1;

/* Validaciones */
// Obtención de usuarios (por id)
const validatorGetByID = [

    DB_ENGINE === "nosql" ?
        check("id").exists().notEmpty().isMongoId() :
        check("id").exists().notEmpty(),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Creación de usuarios
const validatorCreate = [

    check("username").exists().notEmpty().isLength({ min: 3, max: 20 }),
    check("name").exists().notEmpty().isLength({ min: 3, max: 75 }),
    check("email").exists().notEmpty().isEmail(),
    check("password").exists().notEmpty().isStrongPassword({
        minLength: PASSWORD_MIN_LENGTH,
        minLowercase: PASSWORD_MIN_LOWERCASE,
        minUppercase: PASSWORD_MIN_UPPERCASE,
        minNumbers: PASSWORD_MIN_NUMBERS,
        minSymbols: PASSWORD_MIN_SYMBOLS
    }),
    check("description").exists().notEmpty(),
    check("avatar").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Inicio de sesión de usuarios
const validatorLogin = [

    check("username").exists().notEmpty(),
    check("password").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Recuperación de contraseña (email)
const validatorRestorePasswordEmail = [

    check("email").exists().notEmpty().isEmail(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Recuperación de contraseña (código)
const validatorRestorePasswordCode = [

    check("code").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Recuperación de contraseña (contraseña)
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