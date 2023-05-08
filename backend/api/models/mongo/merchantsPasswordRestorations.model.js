

/*
    Título: Merchants Password Restorations Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de recuperaciones de contraseñas para MongoDB
    Fecha: 27/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const mongoose = require("mongoose");

/* Esquema de Recuperaciones de Contraseñas de Comerciantes */
const MerchantsPasswordRestorationsScheme = mongoose.Schema(

    {
        merchantID: {
            type: mongoose.Types.ObjectId,
        },
        attempts: {
            type: Number
        }
    },
    {
        timestamp: true,
        versionKey: false
    }

);

/* Codificación de Funciones */
// Creación de adaptadores para realizar las mismas funciones tanto en MySQL como en MongoDB
// Obtener todas las recuperaciones de contraseña de comerciantes
MerchantsPasswordRestorationsScheme.statics.selectAll = function(){
    return this.find({});
}

// Obtener todas las recuperaciones de contraseña de comerciantes con restricción
MerchantsPasswordRestorationsScheme.statics.selectAllWhere = function(conditions){

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

// Obtener una recuperación de contraseña de un comerciante
MerchantsPasswordRestorationsScheme.statics.selectOne = function(id){
    return this.findById(id);
}

// Crear una recuperación de contraseña de un comerciante
MerchantsPasswordRestorationsScheme.statics.insert = function(body){
    return this.create(body);
}

// Modificar una recuperación de contraseña de un comerciante
MerchantsPasswordRestorationsScheme.statics.updateByID = function(id, body){
    return this.findByIdAndUpdate(id, body);
}

// Eliminar una recuperación de contraseña de un comerciante
MerchantsPasswordRestorationsScheme.statics.deleteByID = async function(id){
    const data = await this.deleteOne({ _id: id });
    return data["acknowledged"] ? "OK" : "NOT_FOUND";
}

/* Exportado de Módulo */
module.exports = mongoose.model("merchantsPasswordRestorations", MerchantsPasswordRestorationsScheme);