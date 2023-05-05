

/*
    Título: Reviews Validators
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar las validaciones de las reseñas
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
const MIN_RATING = 0;
const MAX_RATING = 5;

/* Validaciones */
// Obtención de una reseña por ID
const validatorGetByID = [

    DB_ENGINE === "nosql" ?
        check("id").exists().notEmpty().isMongoId() :
        check("id").exists().notEmpty(),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Creación de una reseña
const validatorCreate = [

    DB_ENGINE === "nosql" ?
        check("webpageID").exists().notEmpty().isMongoId() :
        check("webpageID").exists().notEmpty(),
    check("content").exists().notEmpty(),
    check("rating").exists().notEmpty().isFloat({ min: MIN_RATING, max: MAX_RATING }),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

// Modificación de una reseña
const validatorUpdate = [

    DB_ENGINE === "nosql" ?
        check("id").exists().notEmpty().isMongoId() :
        check("id").exists().notEmpty(),
    check("content").exists().notEmpty(),
    check("rating").exists().notEmpty().isFloat({ min: MIN_RATING, max: MAX_RATING }),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

]

/* Exportado de Módulo */
module.exports = {
    validatorGetByID,
    validatorCreate,
    validatorUpdate
}