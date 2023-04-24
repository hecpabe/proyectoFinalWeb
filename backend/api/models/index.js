

/*
    Título: Index
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo que redirija a los modelos en función del motor de base de datos
    Fecha: 3/4/2023
    Última Modificación: 3/4/2023
*/

/* Enrutado de ficheros */
const path = process.env.DB_ENGINE === "nosql" ? "./mongo" : "./mysql";

const models = {
    usersModel: require(path + "/users.model"),
    passwordRestorationsModel: require(path + "/passwordRestorations.model")
}

/* Exportado de Módulos */
module.exports = models;