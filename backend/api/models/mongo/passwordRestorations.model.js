

/*
    Título: Password Restorations Model
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el modelo de recuperación de contraseñas para MongoDB
    Fecha: 24/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const mongoose = require("mongoose");

/* Esquema de Recuperación de Contraseñas */
const PasswordRestorationsScheme = new mongoose.Schema(

    {
        userID: {
            type: mongoose.Types.ObjectId
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

/* Modelo de Recuperación de Contraseñas */
const PasswordRestorations = mongoose.model("passwordRestorations", PasswordRestorationsScheme);

/* Codificación de Funciones */
// Creación de adaptadores para realizar las mismas funciones tanto en MySQL como en MongoDB
// Obtener todos los admines
PasswordRestorations.selectAll = function(){
    return PasswordRestorations.find({});
}

// Obtener todos los admines con restricción
PasswordRestorations.selectAllWhere = function(conditions){
    return PasswordRestorations.find(conditions);
}

// Obtener un admin
PasswordRestorations.selectOne = function(id){
    return PasswordRestorations.findById(id);
}

// Crear un admin
PasswordRestorations.insert = function(body){
    return PasswordRestorations.create(body);
}

// Modificar un admin
PasswordRestorations.updateByID = function(id, body){
    return PasswordRestorations.findOneAndUpdate(id, body);
}

// Eliminar un admin
PasswordRestorations.deleteByID = function(id){
    return PasswordRestorations.deleteOne({ _id: id });
}

/* Exportado de Módulo */
module.exports = PasswordRestorations;