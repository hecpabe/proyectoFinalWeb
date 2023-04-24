

/*
    Título: Users Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de usuarios para SQL con Sequelize
    Fecha: 3/4/2023
    Última Modificación: 18/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util")

/* Modelo de Usuarios */
const Users = sequelize.define(
    "users",
    {
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        rol: {
            type: DataTypes.ENUM,
            values: ["user", "merchant", "admin", "owner"],
            defaultValue: "user"
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountEnabled: {
            type: DataTypes.BOOLEAN,
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
Users.selectAll = function(){
    return Users.findAll();
}

// Obtener todos los admines con restricción
Users.selectAllWhere = function(conditions){
    return Users.findAll({ where: conditions });
}

// Obtener un admin
Users.selectOne = function(id){
    return Users.findOne({ where: { id: id } });
}

// Crear un admin
Users.insert = function(body){
    return Users.create(normalizeJSONForSequelize(body));
}

// Modificar un admin
Users.updateByID = function(id, body){
    return Users.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar un admin
Users.deleteByID = async function(id){
    
    // Realizamos la operación
    var result = await Users.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = Users;