

/*
    Título: Password Restorations Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de recuperación de contraseñas para MySQL
    Fecha: 20/4/2023
    Última Modificación: 20/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util");
const Users = require("./users.model");

/* Modelo de Recuperación de Contraseñas */
const PasswordRestorations = sequelize.define(
    "passwordRestorations",
    {
        userID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attempts: {
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
// Obtener todos los admines
PasswordRestorations.selectAll = function(){
    return PasswordRestorations.findAll();
}

// Obtener todos los admines con restricción
PasswordRestorations.selectAllWhere = function(conditions){
    return PasswordRestorations.findAll({ where: conditions });
}

// Obtener un admin
PasswordRestorations.selectOne = function(id){
    return PasswordRestorations.findOne({ where: { id: id } });
}

// Crear un admin
PasswordRestorations.insert = function(body){
    return PasswordRestorations.create(normalizeJSONForSequelize(body));
}

// Modificar un admin
PasswordRestorations.updateByID = function(id, body){
    return PasswordRestorations.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar un admin
PasswordRestorations.deleteByID = function(id){
    
    // Realizamos la operación
    var result = PasswordRestorations.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = PasswordRestorations;