

/*
    Título: Favs Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la ruta de favoritos
    Fecha: 31/3/2023
    Última Modificación: 31/3/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas propias

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de todos los favoritos de un usuario
router.get("/user/:username", (req, res) => {
    res.send("Obtención de todos los favoritos de un usuario.");
});

// Obtención de la cantidad de favoritos que tiene un comercio
router.get("/webpage/:merchantname", (req, res) => {
    res.send("Obtención de la cantidad de favoritos que tiene un comercio.");
});

// Añadido a favoritos
router.post("/", (req, res) => {
    res.send("Añadiendo a favoritos.");
});

// Borrado de favoritos
router.delete("/:username/:merchantname", (req, res) => {
    res.send("Borrado de favoritos.");
});

/* Exportado de Módulo */
module.exports = router;