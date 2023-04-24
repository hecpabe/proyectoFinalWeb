

/*
    Título: App
    Nombre: Héctor Paredes Benavides
    Descripción: Fichero de arranque del backend
    Fecha: 30/3/2023
    Última Modificación: 30/3/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Bibliotecas propias
const connectToMongoDB = require("./api/config/mongodb.config");
const { sequelize, connectToMySQL } = require("./api/config/mysql.config");
const { appLogger } = require("./api/config/winstonLogger.config");
const { usersModel } = require("./api/models");
const { generateRandomPassword } = require("./api/utils/handleRandom.util");
const { hashPassword } = require("./api/utils/handlePassword.util");

/* Declaraciones Globales */
const PORT = process.env.PORT || 3000;
const DB_ENGINE = process.env.DB_ENGINE || "mysql";

/* Ejecución Principal */
// Inicializamos el servidor web
const app = express();

// Le instalamos las políticas
app.use(cors());
app.use(express.json());

// Cargamos las rutas
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
        await connectToMySQL();
        //await syncSequelize();
    }

    appLogger.info("Servidor escuchando en el puerto " + PORT + "...");

});

/* Codificación de Funciones */
// Comprobación de existencia de usuarios de un rol
const existUsers = async (rol) => {

    const data = await usersModel.selectAllWhere({ rol: rol });
    return data.length > 0;

}

// Creación del primer usuario
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
        avatar: "NONE",
        accountEnabled: true
    }

    appLogger.info("Generando nuevo usuario OWNER...");
    await usersModel.insert(body);
    appLogger.info(`Usuario OWNER generado (Username: ${body.username} | Password: ${ownerPassword})`);

}

// Sincronización de los modelos con la base de datos
const syncSequelize = async () => {

    try{

        // Sincronización
        appLogger.info("Sincronizando base de datos con los modelos...");
        await sequelize.sync();
        appLogger.info("Base de datos sincronizada con éxito.");

        // Creación de un usuario OWNER
        await createOwnerUser();

    }
    catch(err){

        appLogger.error("Error al sincronizar la base de datos: " + err);

    }

}