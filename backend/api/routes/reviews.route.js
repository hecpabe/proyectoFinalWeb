

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

// Bibliotecas propias
const { getReviews, createReview, updateReview, deleteReview } = require("../controllers/reviews.controller");
const { validatorGetByID, validatorCreate, validatorUpdate } = require("../validators/reviews.validators");
const { authMiddleware } = require("../middleware/session.middleware");
const { checkRol } = require("../middleware/rol.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de todas las reseñas de un comerciante
router.get("/webpage/:id", validatorGetByID, getReviews("webpage"));

// Obtención de todas las reseñas de un usuario
router.get("/user/:id", validatorGetByID, getReviews("user"));

// Creación de una reseña
router.post("/", validatorCreate, authMiddleware, checkRol(["user"]), createReview);

// Modificación de una reseña
router.put("/:id", validatorUpdate, authMiddleware, checkRol(["user"]), updateReview);

// Borrado de una reseña
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["user", "admin", "owner"]), deleteReview);

/* Exportado de Módulo */
module.exports = router;