

/*
    Título: Users Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de users para MongoDB con Mongoose
    Fecha: 18/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const mongoose = require("mongoose");

/* Esquema de Usuarios */
const UsersScheme = new mongoose.Schema(

    {
        username: {
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
        rol: {
            type: String,
            enum: ["user", "admin", "owner"],
            default: "owner"
        },
        description: {
            type: String
        },
        avatar: {
            type: String
        },
        country: {
            type: String
        },
        city: {
            type: String
        },
        preferences: {
            type: String
        },
        allowAdvertising: {
            type: Boolean
        },
        accountEnabled: {
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
// Obtener todos los admines
UsersScheme.statics.selectAll = function(){
    return this.find({});
}

// Obtener todos los admines con restricción
UsersScheme.statics.selectAllWhere = function(conditions){

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

// Obtener un admin
UsersScheme.statics.selectOne = function(id){
    return this.findById(id);
}

// Crear un admin
UsersScheme.statics.insert = function(body){
    return this.create(body);
}

// Modificar un admin
UsersScheme.statics.updateByID = function(id, body){
    return this.findByIdAndUpdate(id, body);
}

// Eliminar un admin
UsersScheme.statics.deleteByID = async function(id){
    const data = await this.deleteOne({ _id: id });
    return data["acknowledged"] ? "OK" : "NOT_FOUND";
}

/* Exportado de Módulo */
module.exports = mongoose.model("users", UsersScheme);