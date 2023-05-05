


/*
    Título: Users Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar las rutas de autenticación de usuarios
    Fecha: 30/3/2023
    Última Modificación: 30/3/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas propias
const { createUser, getUsers, getUser, updateUser, deleteUser } = require("../controllers/users.controller");
const { validatorCreate, validatorGetByID } = require("../validators/users.validators");
const { authMiddleware, checkSameOrGreaterAdminRol } = require("../middleware/session.middleware");
const { checkRol } = require("../middleware/rol.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Register
router.post("/register", validatorCreate, createUser("user"));

// Obtención de todos los usuarios
router.get("/", getUsers("all"));

// Obtención de los datos de un usuario
router.get("/:id", validatorGetByID, getUser("all"));

// Modificación de un usuario
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol(["user", "admin", "owner"]), checkSameOrGreaterAdminRol("user"), updateUser);

// Borrado de un usuario
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["user", "admin", "owner"]), checkSameOrGreaterAdminRol("user"), deleteUser);

/* Exportado de Módulo */
module.exports = router;