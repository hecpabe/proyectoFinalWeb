

/*
    Título: Storage Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo del almacenamiento para MySQL
    Fecha: 5/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util");

/* Modelo de Almacenamiento */
const Storage = sequelize.define(

    "storage",
    {
        filename: {
            type: DataTypes.STRING,
            allowNull: false
        },
        url: {
            type: DataTypes.STRING,
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
Storage.selectAll = function(){
    return Storage.findAll();
}

// Obtener todos los usuarios con restricción
Storage.selectAllWhere = function(conditions){
    return Storage.findAll({ where: conditions });
}

// Obtener un usuario
Storage.selectOne = function(id){
    return Storage.findOne({ where: { id: id } });
}

// Crear un usuario
Storage.insert = function(body){
    return Storage.create(normalizeJSONForSequelize(body));
}

// Modificar un usuario
Storage.updateByID = function(id, body){
    return Storage.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar un usuario
Storage.deleteByID = async function(id){
    
    // Realizamos la operación
    var result = await Storage.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = Storage;