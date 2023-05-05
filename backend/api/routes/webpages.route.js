

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
const { 
    getWebpages, 
    getWebpage, 
    getFilteredWebpages, 
    getFilteredWebpagesAsLoggedUser, 
    createWebpage, 
    updateWebpage, 
    deleteWebpage 
} = require("../controllers/webpages.controller");

const { 
    validatorGetByID, 
    validatorGetFiltered, 
    validatorGetFilteredAsLoggedUser, 
    validatorCreate 
} = require("../validators/webpages.validators");

const { authMiddleware } = require("../middleware/session.middleware");
const { checkRol } = require("../middleware/rol.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de lista de comercios
router.get("/", getWebpages);

// Obtención de lista de comercios con filtros
router.get("/:search/:rating/:country/:city/:type", validatorGetFiltered, getFilteredWebpages);

// Obtención de lista de comercios con filtros para usuarios registrados
router.get(
    "/:search/:rating/:country/:city/:type/:preferences/:fav", 
    validatorGetFilteredAsLoggedUser, 
    authMiddleware, 
    checkRol(["user", "admin", "owner"]), 
    getFilteredWebpagesAsLoggedUser
);

// Obtención de un comercio
router.get("/:id", validatorGetByID, getWebpage);

// Registro de un comercio
router.post("/", validatorCreate, authMiddleware, checkRol(["merchant"]), createWebpage);

// Modificación de un comercio
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol("merchant"), updateWebpage);

// Eliminación de un comercio
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["merchant", "admin", "owner"]), deleteWebpage);

/* Exportado de Módulo */
module.exports = router;