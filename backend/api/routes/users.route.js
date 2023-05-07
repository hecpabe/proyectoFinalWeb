


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
const { createUser, getUsers, getUser, getUsersByPreference, updateUser, deleteUser } = require("../controllers/users.controller");
const { validatorCreate, validatorGetByID, validatorGetUsersByPreference } = require("../validators/users.validators");
const { authMiddleware, checkSameOrGreaterAdminRol } = require("../middleware/session.middleware");
const { checkRol } = require("../middleware/rol.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Register
/**
 *  @openapi
 *  /user/register:
 *  post:
 *      tags:
 *      - Users
 *      summary: Register user
 *      description: Register a new user in the system
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/user"
 *      responses:
 *          '200':
 *              description: Returns if the user has been registered successfully
 *          '400':
 *              description: Validation error
 *          '500':
 *              description: Server error
 */
router.post("/register", validatorCreate, createUser("user"));

// Obtención de todos los usuarios
/**
 *  @openapi
 *  /users:
 *  get:
 *      tags:
 *      - Users
 *      summary: Get users
 *      description: Get all users in the system
 *      responses:
 *          '200':
 *              description: Return the users
 *          '404':
 *              description: Users not found
 *          '500':
 *              description: Server error
 */
router.get("/", getUsers("all"));

// Obtención de los datos de un usuario
/**
 *  @openapi
 *  /users/{id}:
 *  get:
 *      tags:
 *      - Users
 *      summary: Get user
 *      description: Get a user
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the user to get
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the user
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: User not found
 *          '500':
 *              description: Server error
 */
router.get("/:id", validatorGetByID, getUser("all"));

// Obtención de usuarios con una preferencia
/**
 *  @openapi
 *  /user/preferences/{type}:
 *  get:
 *      tags:
 *      - Users
 *      summary: Get users by preferences
 *      description: Get all users by preference who allows advertising
 *      parameters:
 *          -   name: type
 *              in: path
 *              description: Preferences type
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the users
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Users not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/preferences/:type", validatorGetUsersByPreference, authMiddleware, checkRol(["merchant"]), getUsersByPreference);

// Modificación de un usuario
/**
 *  @openapi
 *  /users/{id}:
 *  put:
 *      tags:
 *      - Users
 *      summary: Update user
 *      description: Update a user in the system
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: id that need to be updated
 *              required: true
 *              schema:
 *                  type: string
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/user"
 *      responses:
 *          '200':
 *              description: Returns if the user has been updated propperly
 *          '400':
 *              description: Validaation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: User not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol(["user", "admin", "owner"]), checkSameOrGreaterAdminRol("user"), updateUser);

// Borrado de un usuario
/**
 *  @openapi
 *  /users/{id}:
 *  delete:
 *      tags:
 *      - Users
 *      summary: Delete user
 *      description: Delete a user
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the user being deleted
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Returns if all ran propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error   
 *          '404':
 *              description: User not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["user", "admin", "owner"]), checkSameOrGreaterAdminRol("user"), deleteUser);

/* Exportado de Módulo */
module.exports = router;