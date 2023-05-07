

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
/**
 *  @openapi
 *  /favs:
 *  get:
 *      tags:
 *      - Favs
 *      summary: Get favs
 *      description: Get all favourites in the system
 *      responses:
 *          '200':
 *              description: Return the favs
 *          '404':
 *              description: Favs not found
 *          '500':
 *              description: Server error
 */
router.get("/", getFavs);

// Obtención de todos los favoritos de un usuario
/**
 *  @openapi
 *  /favs/user/{id}:
 *  get:
 *      tags:
 *      - Favs
 *      summary: Get user favs
 *      description: Get all the favs of a user
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the user to get the favs
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the favs
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Favs not found
 *          '500':
 *              description: Server error
 */
router.get("/user/:id", validatorGetAndCreateByID, getFavsByUser("user"));

// Obtención de la cantidad de favoritos que tiene un comercio
/**
 *  @openapi
 *  /favs/webpage/{id}:
 *  get:
 *      tags:
 *      - Favs
 *      summary: Get webpage favs
 *      description: Get all the favs of a webpage
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the webpage to get the favs
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the favs
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Favs not found
 *          '500':
 *              description: Server error
 */
router.get("/webpage/:id", validatorGetAndCreateByID, getFavsByUser("merchant"));

// Obtención de un favorito por ID
/**
 *  @openapi
 *  /favs/{id}:
 *  get:
 *      tags:
 *      - Favs
 *      summary: Get fav
 *      description: Get a fav by ID
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the fav to get
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the favs
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Fav not found
 *          '500':
 *              description: Server error
 */
router.get("/:id", validatorGetAndCreateByID, getFav);

// Comprobación de si un favorito existe
/**
 *  @openapi
 *  /favs/check/{id}:
 *  get:
 *      tags:
 *      - Favs
 *      summary: Check fav
 *      description: Check if user has a webpage in favs
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the webpage to check
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the favs
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/check/:id", validatorGetAndCreateByID, authMiddleware, checkRol(["user", "admin", "owner"]), checkFavExists);

// Añadido a favoritos
/**
 *  @openapi
 *  /favs:
 *  post:
 *      tags:
 *      - Favs
 *      summary: Upload fav
 *      description: Add a webpage to favs
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/fav"
 *      responses:
 *          '200':
 *              description: Returns the inserted object
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/", validatorGetAndCreateByID, authMiddleware, checkRol(["user", "admin", "owner"]), createFav);

// Borrado de favoritos
/**
 *  @openapi
 *  /favs/{id}:
 *  delete:
 *      tags:
 *      - Favs
 *      summary: Delete fav
 *      description: Delete a webpage from favs
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the fav being deleted
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
 *              description: Fav not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", validatorGetAndCreateByID, authMiddleware, checkRol(["user", "admin", "owner"]), deleteFav);

/* Exportado de Módulo */
module.exports = router;