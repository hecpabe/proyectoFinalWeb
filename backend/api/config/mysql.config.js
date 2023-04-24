

/*
    Título: MySQL Config
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar la conexión con la base de datos de MySQL
    Fecha: 3/4/2023
    Última Modificación: 3/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { Sequelize } = require("sequelize");

// Bibliotecas propias
const { sequelizeLogger } = require("../config/winstonLogger.config");

/* Declaraciones Constantes */
const HOST = process.env.MYSQL_HOST;
const USER = process.env.MYSQL_USER;
const PASSWORD = process.env.MYSQL_PASSWORD;
const DATABASE = process.env.MYSQL_DATABASE;

const sequelize = new Sequelize(
    DATABASE,
    USER,
    PASSWORD,
    {
        HOST,
        dialect: "mysql"
    }
);

/* Codificación de Funciones */
const connectToMySQL = async () => {

    try{

        sequelizeLogger.info("[MySQL Controller] Inicializando la conexión con la base de datos...");
        await sequelize.authenticate();
        sequelizeLogger.info("[MySQL Controller] Conexión con la base de datos inicializada con éxito.");

    }
    catch(err){
        sequelizeLogger.error("[MySQL Controller] No se ha podido establecer conexión con la base de datos, error:\n" + err);
    }

}

/* Exportado de Módulo */
module.exports = {
    sequelize,
    connectToMySQL
}