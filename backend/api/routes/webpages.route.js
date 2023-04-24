

/*
    Título: Webpages Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la gestión de la rutas de páginas de comercios
    Fecha: 31/3/2023
    Última Modificación: 31/3/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas Propias

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de lista de comercios
router.get("/:search/:rating/:country/:city/:type/:preferences/:fav/:startlimit", (req, res) => {

    res.send("Obtención de la lista de comercios");

});

// Obtención de un comercio
router.get("/:merchantname/:startlimit", (req, res) => {
    res.send("Obtención de un comercio");
});

/* Exportado de Módulo */
module.exports = router;