

/*
    Título: Webpages Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestioanr el modelo de los perfiles de empresas para SQL
    Fecha: 28/4/2023
    Última Modificación: 28/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { DataTypes } = require("sequelize");

// Bibliotecas propias
const { sequelize } = require("../../config/mysql.config");
const { normalizeJSONForSequelize } = require("../../utils/handleJSON.util");

/* Modelo de Páginas */
const Webpages = sequelize.define(

    "webpages",
    {
        merchantID: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        type: {
            type: DataTypes.STRING,
            allowNull: false
        },
        avatar: {
            type: DataTypes.STRING,
            allowNull: false
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
        phone: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        timestamps: true
    }

);

/* Relaciones */
/* Webpages.hasMany(Reviews, {
    foreignKey: "webpageID"
}); */

/* Codificación de Funciones */
// Creación de adaptadores para realizar las mismas funciones tanto en MySQL como en MongoDB
// Obtener todas las páginas
Webpages.selectAll = function(){
    return Webpages.findAll();
}

// Obtener todas las páginas con restricción
Webpages.selectAllWhere = function(query){
    return Webpages.findAll(query);
}

// Obtener una página
Webpages.selectOne = function(id){
    return Webpages.findOne({ where: { id: id }});
}

// Crear una página
Webpages.insert = function(body){
    return Webpages.create(normalizeJSONForSequelize(body));
}

// Modificar una página
Webpages.updateByID = function(id, body){
    return Webpages.update(
        normalizeJSONForSequelize(body),
        { where: { id: id } }
    );
}

// Eliminar una página
Webpages.deleteByID = async function(id){
    
    // Realizamos la operación
    var result = await Webpages.destroy({ where: { id: id } });

    // Mandamos la respuesta en función del resultado
    if(result === 1)
        return "OK"
    else
        return "DELETE_ERROR"

}

/* Exportado de Módulo */
module.exports = Webpages;