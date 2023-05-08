

/*
    Título: Handle Relations Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la gestión de las relaciones de Sequelize
    Fecha: 5/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas propias
const { 
    merchantsModel,
    merchantsPasswordRestorationsModel,
    passwordRestorationsModel,
    postsModel,
    reviewsModel,
    storageModel,
    usersModel,
    webpagesModel,
    favsModel
} = require("../models");

/* Codificación de Funciones */
/* Set Model Relations: Método con el que generamos las relaciones entre todos los modelos
    Parámetros: Ninguno.
    Retorno: Ninguno.
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const setModelRelations = () => {

    // Merchants (1) -> MerchantsPasswordRestorations (n)
    merchantsModel.hasMany(merchantsPasswordRestorationsModel, {
        foreignKey: "merchantID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "merchantPasswordRestorations"
    });
    merchantsPasswordRestorationsModel.belongsTo(merchantsModel, {
        foreignKey: "merchantID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "merchant"
    });

    // Merchants (1) -> Webpages (n)
    merchantsModel.hasMany(webpagesModel, {
        foreignKey: "merchantID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "merchantWebpages"
    });
    webpagesModel.belongsTo(merchantsModel, {
        foreignKey: "merchantID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "merchant"
    });

    // Storages (1) -> Posts (n)
    storageModel.hasMany(postsModel, {
        foreignKey: "attachment",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "posts"
    });
    postsModel.belongsTo(storageModel, {
        foreignKey: "attachment",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "image"
    });

    // Storages (1) -> Users (n)
    storageModel.hasMany(usersModel, {
        foreignKey: "avatar",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "users"
    });
    usersModel.belongsTo(storageModel, {
        foreignKey: "avatar",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "image"
    });

    // Storages (1) -> Webpages (n)
    storageModel.hasMany(webpagesModel, {
        foreignKey: "avatar",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "webpages"
    });
    webpagesModel.belongsTo(storageModel, {
        foreignKey: "avatar",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "image"
    });

    // Users (1) -> PasswordRestorations (n)
    usersModel.hasMany(passwordRestorationsModel, {
        foreignKey: "userID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "userPasswordRestorations"
    });
    passwordRestorationsModel.belongsTo(usersModel, {
        foreignKey: "userID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "user"
    });

    // Users (1) -> Reviews (n)
    usersModel.hasMany(reviewsModel, {
        foreignKey: "userID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "reviewsUser"
    });
    reviewsModel.belongsTo(usersModel, {
        foreignKey: "userID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "user"
    });

    // Users (1) -> Favs (n)
    usersModel.hasMany(favsModel, {
        foreignKey: "userID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "favsUser"
    });
    favsModel.belongsTo(usersModel, {
        foreignKey: "userID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "user"
    });

    // Webpages (1) -> Posts (n)
    webpagesModel.hasMany(postsModel, {
        foreignKey: "webpageID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "posts"
    });
    postsModel.belongsTo(webpagesModel, {
        foreignKey: "webpageID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "webpage"
    });

    // Webpages (1) -> Reviews (n)
    webpagesModel.hasMany(reviewsModel, {
        foreignKey: "webpageID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });
    reviewsModel.belongsTo(webpagesModel, {
        foreignKey: "webpageID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
    });

    // Webpages (1) -> Favs (n)
    webpagesModel.hasMany(favsModel, {
        foreignKey: "webpageID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "favsWebpage"
    });
    favsModel.belongsTo(webpagesModel, {
        foreignKey: "webpageID",
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        as: "webpage"
    });

}

/* Exportado de Módulo */
module.exports = {
    setModelRelations
}