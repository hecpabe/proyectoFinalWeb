

/*
    Título: MongoDB Config
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar la conectividad con la base de datos en MongoDB
    Fecha: 3/4/2023
    Última Modificación: 3/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const mongoose = require("mongoose");

// Bibliotecas propias
const { mongoDBLogger } = require("../config/winstonLogger.config");

/* Declaraciones Constantes */
const DB_URI = process.env.MONGODB_URI;

/* Codificación de Funciones */
const connectToMongoDB = () => {

    // Inicializzamos la conexión
    mongoDBLogger.info("[MongoDB Controller] Inicializando la conexión con la base de datos...");
    mongoose.set("strictQuery", false);

    try{

        mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        mongoDBLogger.info("[MongoDB Controller] Conexión con la base de datos inicializada con éxito.");

    }
    catch(err){
        mongoDBLogger.error("[MongoDB Controller] No se ha podido establecer conexión con la base de datos, error:\n" + err);
    }

}

/* Exportado de Módulo */
module.exports = connectToMongoDB;