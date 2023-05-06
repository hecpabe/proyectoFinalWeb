

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
    passwordRestorationsModel: require(path + "/passwordRestorations.model"),
    merchantsModel: require(path + "/merchants.model"),
    merchantsPasswordRestorationsModel: require(path + "/merchantsPasswordRestorations.model"),
    webpagesModel: require(path + "/webpages.model"),
    reviewsModel: require(path + "/reviews.model"),
    postsModel: require(path + "/posts.model"),
    storageModel: require(path + "/storage.model")
}

/* Exportado de Módulos */
module.exports = models;