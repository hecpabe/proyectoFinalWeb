

/*
    Título: Merchants Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de comerciantes de MongoDB
    Fecha: 27/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const mongoose = require("mongoose");

/* Esquema de Comerciantes */
const MerchantsScheme = mongoose.Schema(

    {
        merchantname: {
            type: String,
            unique: true
        },
        name: {
            type: String
        },
        email: {
            type: String,
            unique: true
        },
        password: {
            type: String
        },
        cif: {
            type: String,
            unique: true
        },
        phone: {
            type: String,
            unique: true
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        address: {
            type: String
        },
        accountEnabled: {
            type: Boolean
        },
        accountAccepted: {
            type: Boolean
        }
    },
    {
        timestamp: true,
        versionKey: false
    }

);

/* Codificación de Funciones */
// Creación de adaptadores para realizar las mismas funciones tanto en MySQL como en MongoDB
// Obtener todos los comerciantes
MerchantsScheme.statics.selectAll = function(){
    return this.find({});
}

// Obtener todos los comerciantes con restricción
MerchantsScheme.statics.selectAllWhere = function(conditions){

    // Variables necesarias
    var processedConditions = {}

    // Si se dan varias condiciones las metemos en un AND
    if(Object.keys(conditions).length > 1){

        // Establecemos la condición AND
        processedConditions["$and"] = [];

        // Añadimos cada condición al AND
        Object.keys(conditions).forEach((key) => {

            // Variables necesarias
            var andCondition = {};
        
            // Si es un array comprobamos que sea uno de los elementos, sino, el elmento en sí
            if(Array.isArray(conditions[key]))
                andCondition[key] = { $in: conditions[key] };
            else
                andCondition[key] = conditions[key];
            
            processedConditions["$and"].push(andCondition);
        });

    }
    else
        processedConditions = conditions;

    return this.find(processedConditions);
}

// Obtener un comerciante
MerchantsScheme.statics.selectOne = function(id){
    return this.findById(id);
}

// Crear un comerciante
MerchantsScheme.statics.insert = function(body){
    return this.create(body);
}

// Modificar un comerciante
MerchantsScheme.statics.updateByID = function(id, body){
    return this.findByIdAndUpdate(id, body);
}

// Eliminar un comerciante
MerchantsScheme.statics.deleteByID = async function(id){
    const data = await this.deleteOne({ _id: id });
    return data["acknowledged"] ? "OK" : "NOT_FOUND";
}

/* Exportado de Módulo */
module.exports = mongoose.model("merchants", MerchantsScheme);