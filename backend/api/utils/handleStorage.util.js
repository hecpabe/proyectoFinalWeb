

/*
    Título: Handle Storage
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para las utilidades gestión del almacenamiento
    Fecha: 5/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const multer = require("multer");

/* Codificación de Funciones */
const storage = multer.diskStorage({

    destination: function(req, file, callBack){
        const pathStorage = __dirname + "/../storage"
        callBack(null, pathStorage);
    },

    filename: function(req, file, callBack){
        
        const ext = file.originalname.split(".").pop();
        const filename = "file-" + Date.now() + "." + ext;
        callBack(null, filename);

    }

});

// Middleware entre la ruta y el controlador
const uploadMiddleware = multer({storage});

/* Exportado de Módulo */
module.exports = uploadMiddleware;