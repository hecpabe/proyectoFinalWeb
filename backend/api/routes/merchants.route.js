

/*
    Título: Merchants Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la gestión de la ruta de comerciantes
    Fecha: 2/4/2023
    Última Modificación: 2/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas externas
const { 
    getMerchants, 
    getMerchant, 
    createMerchant, 
    loginMerchant,
    restorePasswordEmail,
    restorePasswordCode,
    restorePassword,
    updateMerchant,
    deleteMerchant,
    activateMerchant, 
    acceptMerchant 
} = require("../controllers/merchants.controller");

const { 
    validatorGetByID, 
    validatorCreate, 
    validatorLogin,
    validatorRestorePasswordEmail,
    validatorRestorePasswordCode,
    validatorRestorePasswordPassword,
    validatorActivateAccount 
} = require("../validators/merchants.validators");

const { 
    authMiddleware, 
    checkSameOrGreaterAdminRol, 
    activateMerchantMiddleware, 
    passwordRestorationEmailAuthMiddleware,
    passwordRestorationPasswordAuthMiddleware,
} = require("../middleware/session.middleware");

const { checkRol } = require("../middleware/rol.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de todos los comerciantes
/**
 *  @openapi
 *  /merchants:
 *  get:
 *      tags:
 *      - Merchants
 *      summary: Get merchants
 *      description: Get all merchants in the system
 *      responses:
 *          '200':
 *              description: Return the merchants
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Merchant not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/", authMiddleware, checkRol(["admin", "owner"]), getMerchants);

// Obtención de un comerciante
/**
 *  @openapi
 *  /merchants/{id}:
 *  get:
 *      tags:
 *      - Merchants
 *      summary: Get merchant
 *      description: Get a merchant
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the merchant to get
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Return the merchants
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Merchant not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.get("/:id", authMiddleware, validatorGetByID, checkRol(["merchant", "admin", "owner"]), checkSameOrGreaterAdminRol("merchant"), getMerchant);

// Registro de un comerciante
/**
 *  @openapi
 *  /merchants/register:
 *  post:
 *      tags:
 *      - Merchants
 *      summary: Register merchant
 *      description: Create a new merchant in the system
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/merchant"
 *      responses:
 *          '200':
 *              description: Returns that the merchant has been created successfully
 *          '400':
 *              description: Validation error
 *          '500':
 *              description: Server error
 */
router.post("/register", validatorCreate, createMerchant);

// Inicio de sesión de un comerciante
/**
 *  @openapi
 *  /merchants/login:
 *  post:
 *      tags:
 *      - Merchants
 *      summary: Login merchant
 *      description: Login a merchant in the system
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/loginMerchant"
 *      responses:
 *          '200':
 *              description: Returns the token of the session
 *          '400':
 *              description: Validation error
 *          '500':
 *              description: Server error
 */
router.post("/login", validatorLogin, loginMerchant);

// Restablecimiento de contraseña de un comerciante [Correo]
/**
 *  @openapi
 *  /merchants/restorepassword/email:
 *  post:
 *      tags:
 *      - Merchants
 *      summary: Merchants password restoration
 *      description: Starts a new merchants password restoration process
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/restorePasswordEmail"
 *      responses:
 *          '200':
 *              description: Returns the token to continue the password restoration process
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: Email not found
 *          '500':
 *              description: Server error
 */
router.post("/restorepassword/email", validatorRestorePasswordEmail, restorePasswordEmail);

// Restablecimiento de contraseña de un comerciante [Código]
/**
 *  @openapi
 *  /merchants/restorepassword/code:
 *  post:
 *      tags:
 *      - Merchants
 *      summary: Merchants password restoration
 *      description: Verifies the authentication of the merchant to restore its password
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/restorePasswordCode"
 *      responses:
 *          '200':
 *              description: Returns the token to restore the password
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/restorepassword/code", validatorRestorePasswordCode, passwordRestorationEmailAuthMiddleware("merchant"), restorePasswordCode);

// Restablecimiento de contraseña de un comerciante [Contraseña]
/**
 *  @openapi
 *  /merchants/restorepassword:
 *  put:
 *      tags:
 *      - Merchants
 *      summary: Merchants password restoration
 *      description: Restores the password of the merchant
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/restorePasswordPassword"
 *      responses:
 *          '200':
 *              description: Returns that the password has been restored
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/restorepassword", validatorRestorePasswordPassword, passwordRestorationPasswordAuthMiddleware("merchant"), restorePassword);

// Modificación de un comerciante
/**
 *  @openapi
 *  /merchants/{id}:
 *  put:
 *      tags:
 *      - Merchants
 *      summary: Update merchant
 *      description: Update a merchant in the system
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
 *                      $ref: "#/components/schemas/merchant"
 *      responses:
 *          '200':
 *              description: Returns if the merchant has been updated propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Merchant not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol(["merchant", "admin", "owner"]), checkSameOrGreaterAdminRol("merchant"), updateMerchant);

// Borrado de un comerciante
/**
 *  @openapi
 *  /merchants/{id}:
 *  delete:
 *      tags:
 *      - Merchants
 *      summary: Delete merchant
 *      description: Delete a merchant
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: ID of the merchant being deleted
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
 *              description: Merchant not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["merchant", "admin", "owner"]), checkSameOrGreaterAdminRol("merchant"), deleteMerchant);

// Activar un comerciante
/**
 *  @openapi
 *  /merchants/activate/{token}:
 *  put:
 *      tags:
 *      - Merchants
 *      summary: Activate merchant
 *      description: Activate a merchant of the system
 *      parameters:
 *          -   name: token
 *              in: path
 *              description: Activation token of the merchant, obtained when registering a new merchant
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Returns if the merchant has been activated propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Activation token error
 *          '500':
 *              description: Server error
 */
router.put("/activate/:token", validatorActivateAccount, activateMerchantMiddleware, activateMerchant);

// Aceptación de un comerciante
/**
 *  @openapi
 *  /merchants/accept/{id}:
 *  put:
 *      tags:
 *      - Merchants
 *      summary: Accept merchant
 *      description: Accept a merchant of the system
 *      parameters:
 *          -   name: id
 *              in: path
 *              description: id of the merchant to accept
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Returns if the merchant has been accepted propperly
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: Authentication / Authorization error
 *          '404':
 *              description: Merchant not found
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/accept/:id", validatorGetByID, authMiddleware, checkRol(["admin", "owner"]), acceptMerchant);

/* Exportado de Módulo */
module.exports = router;