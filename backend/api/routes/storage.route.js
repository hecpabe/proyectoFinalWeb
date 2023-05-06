

/*
    Título: Storage Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el almacenamiento de la API
    Fecha: 5/5/2023
    Última Modificación: 5/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas propias
const uploadMiddleware = require("../utils/handleStorage.util");
const { createStorage } = require("../controllers/storage.controller");
const { authMiddleware } = require("../middleware/session.middleware");

/* Declaraciones Globales */
const router = express.Router();

/* Rutas */
router.post("/images", authMiddleware, uploadMiddleware.single("image"), createStorage);

/* Exportado de Módulo */
module.exports = router;