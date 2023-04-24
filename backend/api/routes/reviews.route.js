

/*
    Título: Reviews Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar la ruta de las reseñas
    Fecha: 2/4/2023
    Última Modificación: 2/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas externas

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de todas las reseñas de un comerciante
router.get("/webpage/:merchantname", (req, res) => {
    res.send("Obtención de todas las reseñas de un comerciante");
});

// Obtención de todas las reseñas de un usuario
router.get("/user/:username", (req, res) => {
    res.send("Obtención de todas las reseñas de un usuario");
});

// Creación de una reseña
router.post("/", (req, res) => {
    res.send("Creación de una reseña");
});

// Modificación de una reseña
router.put("/:reviewid", (req, res) => {
    res.send("Modificación de una reseña");
});

// Borrado de una reseña
router.delete("/:reviewid", (req, res) => {
    res.send("Borrado de una reseña");
});

/* Exportado de Módulo */
module.exports = router;