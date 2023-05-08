

/*
    Título: Posts Validators
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar las validaciones de las publicaciones
    Fecha: 5/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { check } = require("express-validator");

// Bibliotecas propias
const { validateResults } = require("../utils/handleValidator.util");

/* Declaraciones Constantes */
const DB_ENGINE = process.env.DB_ENGINE;

const CONTENT_MIN_LENGTH = 5;
const CONTENT_MAX_LENGTH = 500;

/* Validaciones */
const validatorGetByID = [

    DB_ENGINE === "nosql" ?
        check("id").exists().notEmpty().isMongoId() :
        check("id").exists().notEmpty(),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

const validatorCreate = [

    DB_ENGINE === "nosql" ?
        check("webpageID").exists().notEmpty().isMongoId() :
        check("webpageID").exists().notEmpty(),
    
    check("content").exists().notEmpty().isLength({ min: CONTENT_MIN_LENGTH, max: CONTENT_MAX_LENGTH }),
    check("attachment").exists().notEmpty(),

    (req, res, next) => {
        return validateResults(req, res, next);
    }

];

/* Exportado de Módulo */
module.exports = {
    validatorGetByID,
    validatorCreate
}