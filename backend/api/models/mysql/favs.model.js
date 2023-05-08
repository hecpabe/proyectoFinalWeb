

/*
    Título: Favs Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la gestión del modelo de favoritos para MySQL
    Fecha: 5/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas Propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util");
const Users = require("./users.model");
const Webpages = require("./webpages.model");
const Storages = require("./storage.model");

/* Modelo de Favoritos */
const Favs = sequelize.define(

    "favs",
    {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        webpageID: {
            type: DataTypes.INTEGER,
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
Favs.selectAll = function(){
    return Favs.findAll({ include: [{
        model: Users,
        as: "user",
        include: [{
            model: Storages,
            as: "image"
        }]
    },
    {
        model: Webpages,
        as: "webpage",
        include: [{
            model: Storages,
            as: "image"
        }]
    }] 
    });
}

// Obtener todos los usuarios con restricción
Favs.selectAllWhere = function(conditions){
    return Favs.findAll({ where: conditions, include: [{
        model: Users,
        as: "user",
        include: [{
            model: Storages,
            as: "image"
        }]
    },
    {
        model: Webpages,
        as: "webpage",
        include: [{
            model: Storages,
            as: "image"
        }]
    }] 
    });
}

// Obtener un usuario
Favs.selectOne = function(id){
    return Favs.findOne({ where: { id: id }, include: [{
        model: Users,
        as: "user",
        include: [{
            model: Storages,
            as: "image"
        }]
    },
    {
        model: Webpages,
        as: "webpage",
        include: [{
            model: Storages,
            as: "image"
        }]
    }] 
    });
}

// Crear un usuario
Favs.insert = function(body){
    return Favs.create(normalizeJSONForSequelize(body));
}

// Modificar un usuario
Favs.updateByID = function(id, body){
    return Favs.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar un usuario
Favs.deleteByID = async function(id){
    
    // Realizamos la operación
    var result = await Favs.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = Favs;