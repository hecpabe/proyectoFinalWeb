

/*
    Título: App
    Nombre: Héctor Paredes Benavides
    Descripción: Fichero de arranque del backend
    Fecha: 30/3/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");
const cors = require("cors");
const morganBody = require("morgan-body");
const swaggerUI = require("swagger-ui-express")
require("dotenv").config();

// Bibliotecas propias
const connectToMongoDB = require("./api/config/mongodb.config");
const { sequelize, connectToMySQL } = require("./api/config/mysql.config");
const { appLogger } = require("./api/config/winstonLogger.config");
const { usersModel, storageModel } = require("./api/models");
const { generateRandomPassword } = require("./api/utils/handleRandom.util");
const { hashPassword } = require("./api/utils/handlePassword.util");
const { setModelRelations } = require("./api/utils/handleRelations.util");
const { INTERNAL_SERVER_ERROR } = require("./api/utils/handleResponse.util");
const loggerStream = require("./api/utils/handleSlackLogger.util");
const swaggerSpecs = require("./api/docs/swagger.docs");

/* Declaraciones Globales */
const PORT = process.env.PORT || 3000;
const DB_ENGINE = process.env.DB_ENGINE || "mysql";

/* Ejecución Principal */
// Inicializamos el servidor web
const app = express();

// Le instalamos las políticas
app.use(cors());
app.use(express.json());

// Inicializamos el logger a Slack
morganBody(app, {
    noColors: true,
    skip: function(req, res){
        return res.statusCode < INTERNAL_SERVER_ERROR
    },
    stream: loggerStream
});

// Cargamos las rutas
app.use("/docs/", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
app.use("/", require("./api/routes"));
app.use(express.static("./api/storage"));

// Inicializamos el servidor web
app.listen(PORT, async () => {

    // Inicializamos la conexión con la base de datos
    if(DB_ENGINE === "nosql"){
        connectToMongoDB();
        if(!(await existUsers("owner")))
            createOwnerUser();
    }
    else{
        connectToMySQL();
        //await syncSequelize();
        setModelRelations();
    }

    appLogger.info("Servidor escuchando en el puerto " + PORT + "...");

});

/* Codificación de Funciones */
/* Exist Users: Método con el que comprobamos si existen usuarios de un determinado rol
    Parámetros: 
        0: [STRING] Rol por el que buscar
    Retorno: TRUE si existen y FALSe si no
    Precondición: La conexión con la base de datos tiene que haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(n) n -> Cantidad de usuarios que existen
*/
const existUsers = async (rol) => {

    const data = await usersModel.selectAllWhere({ rol: rol });
    return data.length > 0;

}

/* Create Owner User: Método con el que generamos un nuevo usuario con permisos de owner
    Parámetros: Ninguno
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos debe haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const createOwnerUser = async () => {

    // Variables necesarias
    const ownerPassword = generateRandomPassword(25, 4, 4, 4, 4);

    // Creación del usuario
    const body = {
        username: "owner",
        name: "Owner",
        email: "changeme",
        password: await hashPassword(ownerPassword),
        description: "Owner of the app",
        rol: "owner",
        avatar: 1,
        accountEnabled: true
    }

    appLogger.info("Generando nuevo usuario OWNER...");
    await usersModel.insert(body);
    appLogger.info(`Usuario OWNER generado (Username: ${body.username} | Password: ${ownerPassword})`);

}

// Creación de la imagen de usuario por defecto
/* Create Default User Image: Método con el que subimos al sistema la imagen de usuario por defecto
    Parámetros: Ninguno.
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos debe haber sido inicializada
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const createDefaultUserImage = async () => {

    const fileData = {
        filename: "defaultuser.png",
        url: process.env.PUBLIC_URL+"/defaultuser.png"
    }

    await storageModel.create(fileData);

}

// Sincronización de los modelos con la base de datos
/* Sync Sequelize: Método con el que sincronizamos la base de datos con los modelos de sequelize
    Parámetros: Ninguno.
    Retorno: Ninguno.
    Precondición: La conexión con la base de datos debe haber sido inicializada y la base de datos debe estar limpia
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const syncSequelize = async () => {

    try{

        // Sincronización
        appLogger.info("Sincronizando base de datos con los modelos...");
        await sequelize.sync();
        appLogger.info("Base de datos sincronizada con éxito.");

        // Creación de la imagen de usuario por defecto
        await createDefaultUserImage();

        // Creación de un usuario OWNER
        await createOwnerUser();

    }
    catch(err){

        appLogger.error("Error al sincronizar la base de datos: " + err);

    }

}

/* Exportado de Módulo */
module.exports = app;