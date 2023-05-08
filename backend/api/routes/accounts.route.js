

/*
    Título: Accounts Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar las rutas de gestión básica de cuentas, como puede ser gestionar la activación o recuperar la contraseña
    Fecha: 23/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");

// Bibliotecas propias
const { restorePasswordEmail, restorePasswordCode, restorePassword, activateUser, loginUser } = require("../controllers/users.controller");
const { 
    validatorRestorePasswordEmail,
    validatorRestorePasswordCode, 
    validatorRestorePasswordPassword, 
    validatorActivateAccount,
    validatorLogin
} = require("../validators/users.validators");

const { 
    activateAccountMiddleware, 
    passwordRestorationEmailAuthMiddleware, 
    passwordRestorationPasswordAuthMiddleware 
} = require("../middleware/session.middleware");

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Activación de cuenta
/**
 *  @openapi
 *  /accounts/activate/{token}:
 *  put:
 *      tags:
 *      - Accounts
 *      summary: Activate account
 *      description: Activates a new account
 *      parameters:
 *          -   name: token
 *              in: path
 *              description: token of the user to be activated, provided by the API when a new user is created
 *              required: true
 *              schema:
 *                  type: string
 *      responses:
 *          '200':
 *              description: Returns that the user has been correctly activated
 *          '400':
 *              description: Validation error
 *          '401':
 *              description: There is a problem with the inserted token
 *          '500':
 *              description: Server error
 */
router.put("/activate/:token", validatorActivateAccount, activateAccountMiddleware, activateUser);

// Inicio de sesión de un usuario
/**
 * @openapi
 * /accounts/login:
 *  post:
 *      tags:
 *      - Accounts
 *      summary: Users login
 *      description: Users login
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/login"
 *      responses:
 *          '200':
 *              description: Returns the token of the loged user
 *          '400':
 *              description: Validation error
 *          '404':
 *              description: The user does not exist
 *          '500':
 *              description: Server error
 */
router.post("/login", validatorLogin, loginUser);

// Recuperación de contraseña de un admin [Correo]
/**
 * @openapi
 * /accounts/restorepassword/email:
 *  post:
 *      tags:
 *      - Accounts
 *      summary: Users password restoration
 *      description: Starts a user password restoration process
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
 *              description: The email does not exist
 *          '500':
 *              description: Server error
 */
router.post("/restorepassword/email", validatorRestorePasswordEmail, restorePasswordEmail);

// Recuperación de contraseña de un admin [Código]
/**
 * @openapi
 * /accounts/restorepassword/code:
 *  post:
 *      tags:
 *      - Accounts
 *      summary: Users password restoration
 *      description: Verify the users authentication in the password restoration process
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
 *              description: Inserted token errors
 *          '500':
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.post("/restorepassword/code", validatorRestorePasswordCode, passwordRestorationEmailAuthMiddleware("user"), restorePasswordCode);

// Recuperación de contraseña de un admin [Contraseña]
/**
 *  @openapi
 *  /accounts/restorepassword:
 *  put:
 *      tags:
 *      - Accounts
 *      summary: Users password restoration
 *      description: Restores a user password
 *      requestBody:
 *          content:
 *              application/json:
 *                  schema:
 *                      $ref: "#/components/schemas/restorePasswordPassword"
 *      responses:
 *          '200':
 *              description: Returns that the password has been succesfully restored
 *          '400':
 *              description: Validation error
 *          '401': 
 *              description: Inserted token error
 *          '500': 
 *              description: Server error
 *      security:
 *          - bearerAuth: []
 */
router.put("/restorepassword", validatorRestorePasswordPassword, passwordRestorationPasswordAuthMiddleware("user"), restorePassword);

/* Exportado de Módulo */
module.exports = router;