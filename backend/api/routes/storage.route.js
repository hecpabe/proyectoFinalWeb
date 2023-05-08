

/*
    Título: Storage Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar el almacenamiento de la API
    Fecha: 5/5/2023
    Última Modificación: 8/5/2023
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
// Subida de ficheros
/**
 *  @openapi
 *  /storage/images:
 *  post:
 *      tags:
 *      - Storage
 *      summary: Upload image
 *      description: Uploads a new image to the server
 *      responses:
 *          '200':
 *              description: Returns the inserted object
 *          '401':
 *              description: Authentication / Authorization error
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/images", authMiddleware, uploadMiddleware.single("image"), createStorage);

/* Exportado de Módulo */
module.exports = router;