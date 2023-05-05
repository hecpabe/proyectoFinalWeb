

/*
    Título: Posts Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para las rutas de los posts
    Fecha: 5/5/2023
    Última Modiifcación: 5/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas propias
const { getPosts, getPost, getWebpagePosts, createPost, updatePost, deletePost } = require("../controllers/posts.controller");
const { validatorGetByID, validatorCreate } = require("../validators/posts.validators");
const { authMiddleware } = require("../middleware/session.middleware");
const { checkRol } = require("../middleware/rol.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de todos los posts
router.get("/", getPosts);

// Obtención de una publicación por ID
router.get("/:id", validatorGetByID, getPost);

// Obtención de todos los posts de una página
router.get("/webpage/:id", validatorGetByID, getWebpagePosts);

// Creación de un post
router.post("/", validatorCreate, authMiddleware, checkRol(["merchant"]), createPost);

// Modificación de un post
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol(["merchant"]), updatePost);

// Eliminación de un post
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["merchant", "admin", "owner"]), deletePost);

/* Exportado de Módulo */
module.exports = router;