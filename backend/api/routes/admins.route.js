

/*
    Título: Admins Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar la ruta de admins
    Fecha: 3/4/2023
    Última Modificación: 3/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas propias
const { 
    getUsers, 
    getUser, 
    createUser, 
    updateUser,
    deleteUser,
    promoteUser
} = require("../controllers/users.controller");

const { 
    validatorGetByID, 
    validatorCreate
} = require("../validators/users.validators");

const { authMiddleware, checkSameOrGreaterAdminRol } = require("../middleware/session.middleware");
const { checkRol } = require("../middleware/rol.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de todos los admins
router.get("/", authMiddleware, checkRol(["admin", "owner"]), getUsers(["admin", "owner"]));

// Obtención de un admin
router.get("/:id", validatorGetByID, authMiddleware, checkRol(["admin", "owner"]), getUser(["admin", "owner"]));

// Creación de un admin
router.post("/register", validatorCreate, authMiddleware, checkRol(["owner"]), createUser("admin"));

// Modificación de un admin
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol(["admin", "owner"]), checkSameOrGreaterAdminRol("admin"), updateUser);

// Borrado de un admin
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["admin", "owner"]), checkSameOrGreaterAdminRol("admin"), deleteUser);

// Ascenso de un admin a owner
router.put("/promote/:id", validatorGetByID, authMiddleware, checkRol(["owner"]), promoteUser("owner"));

/* Exportado de Módulo */
module.exports = router;