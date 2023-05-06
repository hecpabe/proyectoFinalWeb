

/*
    Título: Merchants Password Restorations Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de recuperación de contraseñas de comerciantes
    Fecha: 27/4/2023
    Última Modificación: 27/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util");
const Merchants = require("./merchants.model");

/* Modelo de Recuperación de Contraseñas */
const MerchantsPasswordRestorations = sequelize.define(
    "merchantsPasswordRestorations",
    {
        merchantID: {
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
MerchantsPasswordRestorations.selectAll = function(){
    return MerchantsPasswordRestorations.findAll();
}

// Obtener todos los admines con restricción
MerchantsPasswordRestorations.selectAllWhere = function(conditions){
    return MerchantsPasswordRestorations.findAll({ where: conditions });
}

// Obtener un admin
MerchantsPasswordRestorations.selectOne = function(id){
    return MerchantsPasswordRestorations.findOne({ where: { id: id } });
}

// Crear un admin
MerchantsPasswordRestorations.insert = function(body){
    return MerchantsPasswordRestorations.create(normalizeJSONForSequelize(body));
}

// Modificar un admin
MerchantsPasswordRestorations.updateByID = function(id, body){
    return MerchantsPasswordRestorations.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar un admin
MerchantsPasswordRestorations.deleteByID = function(id){
    
    // Realizamos la operación
    var result = MerchantsPasswordRestorations.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = MerchantsPasswordRestorations;