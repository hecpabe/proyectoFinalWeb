

/*
    Título: Admins Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar la ruta de admins
    Fecha: 3/4/2023
    Última Modificación: 8/5/2023
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
/**
 *  @openapi
 *  /admins:
 *  get:
 *      tags:
 *      - Admins
 *      summary: Get admins
 *      description: Get all admins in the system
 *      responses:
 *          '200':
 *              description: Return the users
 *          '401':
 *              description: Authentication / Authorization error
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/", authMiddleware, checkRol(["admin", "owner"]), getUsers(["admin", "owner"]));

// Obtención de un admin
/**
 *  @openapi
 *  /admins/{id}:
 *  get:
 *      tags:
 *      - Admins
 *      summary: Get admin
 *      description: Get an admin
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the admin to get
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the tracks
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Admin not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/:id", validatorGetByID, authMiddleware, checkRol(["admin", "owner"]), getUser(["admin", "owner"]));

// Creación de un admin
/**
 *  @openapi
 *  /admins/register:
 *  post:
 *      tags:
 *      - Admins
 *      summary: Register admin
 *      description: Create a new admin in the system
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/user"
 *      responses:
 *          '200':
 *              description: Returns that the admin has been created
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/register", validatorCreate, authMiddleware, checkRol(["owner"]), createUser("admin"));

// Modificación de un admin
/**
 *  @openapi
 *  /admins/{id}:
 *  put:
 *      tags:
 *      - Admins
 *      summary: Update admin
 *      description: Update an admin in the system
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
 *              description: Returns if the track has been updated propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Admin not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol(["admin", "owner"]), checkSameOrGreaterAdminRol("admin"), updateUser);

// Borrado de un admin
/**
 *  @openapi
 *  /admins/{id}:
 *  delete:
 *      tags:
 *      - Admins
 *      summary: Delete admin
 *      description: Delete an admin
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the admin being deleted
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
 *              description: Admin not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["admin", "owner"]), checkSameOrGreaterAdminRol("admin"), deleteUser);

// Ascenso de un admin a owner
/**
 *  @openapi
 *  /admins/promote/{id}:
 *  put:
 *      tags:
 *      - Admins
 *      summary: Promote admin
 *      description: Promote an admin in the system to owner
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: id that need to be promoted
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Returns if the track has been updated propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Admin not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/promote/:id", validatorGetByID, authMiddleware, checkRol(["owner"]), promoteUser("owner"));

/* Exportado de Módulo */
module.exports = router;