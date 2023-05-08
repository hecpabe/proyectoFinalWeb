

/*
    Título: Reviews Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar la ruta de las reseñas
    Fecha: 2/4/2023
    Última Modificación: 8/5/2023
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
/**
 *  @openapi
 *  /reviews/webpage/{id}:
 *  get:
 *      tags:
 *      - Reviews
 *      summary: Get reviews
 *      description: Get all the reviews of a webpage
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the webpage to get the reviews
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the posts
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Reviews not found
 *          '500':
 *              description: Server error
 */
router.get("/webpage/:id", validatorGetByID, getReviews("webpage"));

// Obtención de todas las reseñas de un usuario
/**
 *  @openapi
 *  /reviews/user/{id}:
 *  get:
 *      tags:
 *      - Reviews
 *      summary: Get reviews
 *      description: Get all the reviews of a user
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the user to get the reviews
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the posts
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Reviews not found
 *          '500':
 *              description: Server error
 */
router.get("/user/:id", validatorGetByID, getReviews("user"));

// Creación de una reseña
/**
 *  @openapi
 *  /reviews:
 *  post:
 *      tags:
 *      - Reviews
 *      summary: Upload review
 *      description: Create a new review in the system
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/review"
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
router.post("/", validatorCreate, authMiddleware, checkRol(["user"]), createReview);

// Modificación de una reseña
/**
 *  @openapi
 *  /reviews/{id}:
 *  put:
 *      tags:
 *      - Reviews
 *      summary: Update review
 *      description: Update a review of the system
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
 *                      $ref: "#/components/schemas/review"
 *      responses:
 *          '200':
 *              description: Returns if the review has been updated propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Review not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/:id", validatorUpdate, authMiddleware, checkRol(["user"]), updateReview);

// Borrado de una reseña
/**
 *  @openapi
 *  /reviews/{id}:
 *  delete:
 *      tags:
 *      - Reviews
 *      summary: Delete review
 *      description: Delete a review
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the review being deleted
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
 *              description: Review not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["user", "admin", "owner"]), deleteReview);

/* Exportado de Módulo */
module.exports = router;