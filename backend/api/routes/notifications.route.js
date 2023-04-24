

/*
    Título: Notifications Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la ruta de notificaciones
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
// Obtención de notificaciones
router.get("/:username", (req, res) => {
    res.send("Obtención de notificaciones.");
});

// Eliminado de notificaciones
router.delete("/:notificationid", (req, res) => {
    res.send("Eliminado de notificaciones.");
});

/* Exportado de Módulo */
module.exports = router;