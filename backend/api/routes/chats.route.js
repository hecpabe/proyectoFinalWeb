

/*
    Título: Chats Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la ruta de chats
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
// Obtenemos los chats de un usuario / comercio / admin
router.get("/:username", (req, res) => {
    res.send("Obtenemos los chats de un usuario / comercio / admin.");
});

// Comprobamos si un chat existe
router.get("/:fromusername/:tousername", (req, res) => {
    res.send("comprobamos si un chat existe.");
});

// Creamos un nuevo chat
router.post("/", (req, res) => {
    res.send("Creamos un nuevo chat.");
});

// Borramos un chat
router.delete("/:fromusername/:tousername", (req, res) => {
    res.send("Borramos un chat.");
});

/* Exportado de Módulo */
module.exports = router;