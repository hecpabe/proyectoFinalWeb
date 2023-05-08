

/*
    Título: Reviews Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de reseñas para Sequelize
    Fecha: 30/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util");
const Users = require("./users.model");
const Storages = require("./storage.model");

/* Módulo de Reseñas */
const Reviews = sequelize.define(

    "reviews",
    {
        webpageID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rating: {
            type: DataTypes.FLOAT,
            allowNull: false
        }
    },
    {
        timestamps: true
    }

);

/* Codificación de Funciones */
// Creación de adaptadores para realizar las mismas funciones tanto en MySQL como en MongoDB
// Obtener todos los usuarios
Reviews.selectAll = function(){
    return Reviews.findAll();
}

// Obtener todos los usuarios con restricción
Reviews.selectAllWhere = function(conditions){
    return Reviews.findAll({ where: conditions, include: [{
        model: Users,
        as: "user",
        include: [{
            model: Storages,
            as: "image"
        }]
    }] });
}

// Obtener un usuario
Reviews.selectOne = function(id){
    return Reviews.findOne({ where: { id: id } });
}

// Crear un usuario
Reviews.insert = function(body){
    return Reviews.create(normalizeJSONForSequelize(body));
}

// Modificar un usuario
Reviews.updateByID = function(id, body){
    return Reviews.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar un usuario
Reviews.deleteByID = async function(id){
    
    // Realizamos la operación
    var result = await Reviews.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = Reviews;