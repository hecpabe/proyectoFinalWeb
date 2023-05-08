

/*
    Título: Favs Validators
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar las validaciones de los favoritos
    Fecha: 7/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { check } = require("express-validator");

// Bibliotecas propias
const { validateResults } = require("../utils/handleValidator.util");

/* Declaraciones Constantes */
const DB_ENGINE = process.env.DB_ENGINE;

/* Validaciones */
const validatorGetAndCreateByID = [

    DB_ENGINE === "nosql" ?
        check("id").exists().notEmpty().isMongoId() :
        check("id").exists().notEmpty(),
    
    (req, res, next) => {
        return validateResults(req, res, next);
    }

]

/* Exportado de Módulo */
module.exports = {
    validatorGetAndCreateByID
}