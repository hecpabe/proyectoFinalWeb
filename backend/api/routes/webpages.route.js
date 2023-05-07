

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
/**
 *  @openapi
 *  /webpages:
 *  get:
 *      tags:
 *      - Webpages
 *      summary: Get webpages
 *      description: Get all webpages in the system
 *      responses:
 *          '200':
 *              description: Return the webpages
 *          '404':
 *              description: Webpages not found
 *          '500':
 *              description: Server error
 */
router.get("/", getWebpages);

// Obtención de lista de comercios con filtros
/**
 *  @openapi
 *  /webpages/{search}/{rating}/{country}/{city}/{type}:
 *  get:
 *      tags:
 *      - Webpages
 *      summary: Get filtered webpages
 *      description: Get the webpages matching with the filters
 *      parameters:
 *          -   name: search
 *              in: path
 *              description: Sarch key to match with the name of the commerces
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: rating
 *              in: path
 *              description: Indicate to order the rating in ascending or descending way
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: country
 *              in: path
 *              description: Search commerces by its country
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: city
 *              in: path
 *              description: Sarch commerces by its city
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: type
 *              in: path
 *              description: Sarch commerces by its type
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the webpages
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Webpages not found
 *          '500':
 *              description: Server error
 */
router.get("/:search/:rating/:country/:city/:type", validatorGetFiltered, getFilteredWebpages);

// Obtención de lista de comercios con filtros para usuarios registrados
/**
 *  @openapi
 *  /webpages/{search}/{rating}/{country}/{city}/{type}/{preferences}/{fav}:
 *  get:
 *      tags:
 *      - Webpages
 *      summary: Get filtered webpages
 *      description: Get the webpages matching with the filters
 *      parameters:
 *          -   name: search
 *              in: path
 *              description: Sarch key to match with the name of the commerces
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: rating
 *              in: path
 *              description: Indicate to order the rating in ascending or descending way
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: country
 *              in: path
 *              description: Search commerces by its country
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: city
 *              in: path
 *              description: Sarch commerces by its city
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: type
 *              in: path
 *              description: Sarch commerces by its type
 *              required: true
 *              schema:
 *                  type: string
 *          -   name: preferences
 *              in: path
 *              description: Sarch commerces matching user preferences
 *              required: true
 *              schema:
 *                  type: boolean
 *          -   name: fav
 *              in: path
 *              description: Sarch commerces matching user favs
 *              required: true
 *              schema:
 *                  type: boolean
 *      responses:
 *          '200':
 *              description: Return the webpages
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Webpages not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.get(
    "/:search/:rating/:country/:city/:type/:preferences/:fav", 
    validatorGetFilteredAsLoggedUser, 
    authMiddleware, 
    checkRol(["user", "admin", "owner"]), 
    getFilteredWebpagesAsLoggedUser
);

// Obtención de un comercio
/**
 *  @openapi
 *  /webpages/{id}:
 *  get:
 *      tags:
 *      - Webpages
 *      summary: Get webpage
 *      description: Get a webpage
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the webpage to get
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the webpage
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Webpage not found
 *          '500':
 *              description: Server error
 */
router.get("/:id", validatorGetByID, getWebpage);

// Registro de un comercio
/**
 *  @openapi
 *  /webpages:
 *  post:
 *      tags:
 *      - Webpages
 *      summary: Upload webpage
 *      description: Create a new webpage in the system
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/webpage"
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
router.post("/", validatorCreate, authMiddleware, checkRol(["merchant"]), createWebpage);

// Modificación de un comercio
/**
 *  @openapi
 *  /webpages/{id}:
 *  put:
 *      tags:
 *      - Webpages
 *      summary: Update webpage
 *      description: Update a webpage in the system
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
 *                      $ref: "#/components/schemas/webpage"
 *      responses:
 *          '200':
 *              description: Returns if the webpage has been updated propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Webpage not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol("merchant"), updateWebpage);

// Eliminación de un comercio
/**
 *  @openapi
 *  /webpages/{id}:
 *  delete:
 *      tags:
 *      - Webpages
 *      summary: Delete webpage
 *      description: Delete a webpage
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the webpage being deleted
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
 *              description: Webpage not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["merchant", "admin", "owner"]), deleteWebpage);

/* Exportado de Módulo */
module.exports = router;