

/*
    Título: Posts Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para las rutas de los posts
    Fecha: 5/5/2023
    Última Modiifcación: 8/5/2023
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
/**
 *  @openapi
 *  /posts:
 *  get:
 *      tags:
 *      - Posts
 *      summary: Get posts
 *      description: Get all posts in the system
 *      responses:
 *          '200':
 *              description: Return the posts
 *          '404':
 *              description: Posts not found
 *          '500':
 *              description: Server error
 */
router.get("/", getPosts);

// Obtención de una publicación por ID
/**
 *  @openapi
 *  /posts/{id}:
 *  get:
 *      tags:
 *      - Posts
 *      summary: Get post
 *      description: Get a post
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the post to get
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the post
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Post not found
 *          '500':
 *              description: Server error
 */
router.get("/:id", validatorGetByID, getPost);

// Obtención de todos los posts de una página
/**
 *  @openapi
 *  /posts/webpage/{id}:
 *  get:
 *      tags:
 *      - Posts
 *      summary: Get webpage posts
 *      description: Get all the posts of a webpage
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the webpage to get the posts
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the posts
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Posts not found
 *          '500':
 *              description: Server error
 */
router.get("/webpage/:id", validatorGetByID, getWebpagePosts);

// Creación de un post
/**
 *  @openapi
 *  /posts:
 *  post:
 *      tags:
 *      - Posts
 *      summary: Upload post
 *      description: Create a new post in the system
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/post"
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
router.post("/", validatorCreate, authMiddleware, checkRol(["merchant"]), createPost);

// Modificación de un post
/**
 *  @openapi
 *  /posts/{id}:
 *  put:
 *      tags:
 *      - Posts
 *      summary: Update post
 *      description: Update a post of the system
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
 *                      $ref: "#/components/schemas/post"
 *      responses:
 *          '200':
 *              description: Returns if the post has been updated propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Post not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol(["merchant"]), updatePost);

// Eliminación de un post
/**
 *  @openapi
 *  /posts/{id}:
 *  delete:
 *      tags:
 *      - Posts
 *      summary: Delete post
 *      description: Delete a post
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the post being deleted
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
 *              description: Post not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["merchant", "admin", "owner"]), deletePost);

/* Exportado de Módulo */
module.exports = router;