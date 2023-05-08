

/*
    Título: Merchants Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de comerciantes para MySQL
    Fecha: 25/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util");
const Webpages = require("./webpages.model");
const Storages = require("./storage.model");

/* Modelo de Comerciantes */
const Merchants = sequelize.define(

    "merchants",
    {
        merchantname: {
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
            allowNull: false,
        },
        cif: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false
        },
        accountEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        accountAccepted: {
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
// Obtener todos los usuarios
Merchants.selectAll = function(){
    return Merchants.findAll();
}

// Obtener todos los usuarios con restricción
Merchants.selectAllWhere = function(conditions){
    return Merchants.findAll({ where: conditions });
}

// Obtener un usuario
Merchants.selectOne = function(id){
    return Merchants.findOne({ where: { id: id }, include: [{
        model: Webpages,
        as: "merchantWebpages",
        include: [{
            model: Storages,
            as: "image"
        }]
    }] });
}

// Crear un usuario
Merchants.insert = function(body){
    return Merchants.create(normalizeJSONForSequelize(body));
}

// Modificar un usuario
Merchants.updateByID = function(id, body){
    return Merchants.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar un usuario
Merchants.deleteByID = async function(id){
    
    // Realizamos la operación
    var result = await Merchants.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = Merchants;