

/*
    Título: Messages Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la ruta de mensajes
    Fecha: 31/3/2023
    Última Modificación: 31/3/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas externas

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtenemos todos los mensajes de un chat
router.get("/:chatid/:startlimit", (req, res) => {
    res.send("Obtenemos todos los mensajes de un chat.");
});

// Obtenemos la cantidad total de mensajes sin leer de un usuario
router.get("/unread/user/quantity/:username", (req, res) => {
    res.send("Obtenemos la cantidad total de mensajes sin leer de un usuario.")
});

// Obtenemos la cantidad total de mensajes sin leer de un chat
router.get("/unread/chat/quantity/:chatid", (req, res) => {
    res.send("Obtenemos la cantidad total de mensajes sin leer de un chat.");
});

// Obtenemos los mensajes sin leer de un chat
router.get("/unread/chat/:chatid", (req, res) => {
    res.send("Obtenemos los mensajes sin leer de un chat.");
});

// Añadimos un nuevo mensaje
router.post("/", (req, res) => {
    res.send("Añadimos un nuevo mensaje.");
});

// Eliminamos un mensaje
router.delete("/:messageid", (req, res) => {
    res.send("Eliminamos un mensaje.");
});

/* Exportado de Módulo */
module.exports = router;