

/*
    Título: Accounts Route
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar las rutas de gestión básica de cuentas, como puede ser gestionar la activación o recuperar la contraseña
    Fecha: 23/4/2023
    Última Modificación: 23/4/2023
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
router.put("/activate/:token", validatorActivateAccount, activateAccountMiddleware, activateUser);

// Inicio de sesión de un usuario
router.post("/login", validatorLogin, loginUser);

// Recuperación de contraseña de un admin [Correo]
router.post("/restorepassword/email", validatorRestorePasswordEmail, restorePasswordEmail);

// Recuperación de contraseña de un admin [Código]
router.post("/restorepassword/code", validatorRestorePasswordCode, passwordRestorationEmailAuthMiddleware("user"), restorePasswordCode);

// Recuperación de contraseña de un admin [Contraseña]
router.put("/restorepassword", validatorRestorePasswordPassword, passwordRestorationPasswordAuthMiddleware("user"), restorePassword);

/* Exportado de Módulo */
module.exports = router;