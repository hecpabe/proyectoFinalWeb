

/*
    Título: Posts Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la gestión del modelo de publicaciones para MySQL
    Fecha: 5/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util");

/* Modelo de Publicaciones */
const Posts = sequelize.define(

    "posts",
    {
        webpageID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        },
        attachment: {
            type: DataTypes.INTEGER
        }
    },
    {
        timestamps: true
    }

);

/* Codificación de Funciones */
// Creación de adaptadores para realizar las mismas funciones tanto en MySQL como en MongoDB
// Obtener todos los usuarios
Posts.selectAll = function(){
    return Posts.findAll();
}

// Obtener todos los usuarios con restricción
Posts.selectAllWhere = function(conditions){
    return Posts.findAll({ where: conditions });
}

// Obtener un usuario
Posts.selectOne = function(id){
    return Posts.findOne({ where: { id: id } });
}

// Crear un usuario
Posts.insert = function(body){
    return Posts.create(normalizeJSONForSequelize(body));
}

// Modificar un usuario
Posts.updateByID = function(id, body){
    return Posts.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar un usuario
Posts.deleteByID = async function(id){
    
    // Realizamos la operación
    var result = await Posts.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = Posts;