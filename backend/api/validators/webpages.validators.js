

/*
    Título: Webpages Validators
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar las validaciones de las páginas de los comercios
    Fecha: 30/4/2023
    Última Modificación: 30/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { check } = require("express-validator");

// Bibliotecas propias
const { validateResults } = require("../utils/handleValidator.util");

/* Declaraciones Constantes */
const DB_ENGINE = process.env.DB_ENGINE;

const NAME_MIN_LENGTH = 3;
const NAME_MAX_LENGTH = 50;

/* Validaciones */
// Obtención de comercios por ID
const validatorGetByID = [

    DB_ENGINE === "nosql" ?
        check("id").exists().notEmpty().isMongoId() :
        check("id").exists().notEmpty(),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Obtención de comercios por filtros
const validatorGetFiltered = [

    check("search").exists().notEmpty(),
    check("rating").exists().notEmpty(),
    check("country").exists().notEmpty(),
    check("city").exists().notEmpty(),
    check("type").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

]

// Obtención de comercios por filtros como usuario loggeado
const validatorGetFilteredAsLoggedUser = [

    check("search").exists().notEmpty(),
    check("rating").exists().notEmpty(),
    check("country").exists().notEmpty(),
    check("city").exists().notEmpty(),
    check("type").exists().notEmpty(),
    check("preferences").exists().notEmpty().isBoolean(),
    check("fav").exists().notEmpty().isBoolean(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Creación de comercios
const validatorCreate = [

    check("name").exists().notEmpty().isLength({ min: NAME_MIN_LENGTH, max: NAME_MAX_LENGTH }),
    check("type").exists().notEmpty(),
    check("avatar").exists().notEmpty(),
    check("country").exists().notEmpty(),
    check("city").exists().notEmpty(),
    check("address").exists().notEmpty(),
    check("phone").exists().notEmpty().isMobilePhone(),
    check("email").exists().notEmpty().isEmail(),
    check("description").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

/* Exportado de Módulo */
module.exports = {
    validatorGetByID,
    validatorGetFiltered,
    validatorGetFilteredAsLoggedUser,
    validatorCreate,
}