

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
const { getFavs, getFavsByUser, getFav, checkFavExists, createFav, deleteFav } = require("../controllers/favs.controller");
const { validatorGetAndCreateByID } = require("../validators/favs.validators");
const { authMiddleware } = require("../middleware/session.middleware");
const { checkRol } = require("../middleware/rol.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de todos los favoritos
router.get("/", getFavs);

// Obtención de todos los favoritos de un usuario
router.get("/user/:id", validatorGetAndCreateByID, getFavsByUser("user"));

// Obtención de la cantidad de favoritos que tiene un comercio
router.get("/webpage/:id", validatorGetAndCreateByID, getFavsByUser("merchant"));

// Obtención de un favorito por ID
router.get("/:id", validatorGetAndCreateByID, getFav);

// Comprobación de si un favorito existe
router.get("/check/:id", validatorGetAndCreateByID, authMiddleware, checkRol(["user", "admin", "owner"]), checkFavExists);

// Añadido a favoritos
router.post("/", validatorGetAndCreateByID, authMiddleware, checkRol(["user", "admin", "owner"]), createFav);

// Borrado de favoritos
router.delete("/:id", validatorGetAndCreateByID, authMiddleware, checkRol(["user", "admin", "owner"]), deleteFav);

/* Exportado de Módulo */
module.exports = router;