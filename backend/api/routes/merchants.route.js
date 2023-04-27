

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
router.get("/", authMiddleware, checkRol(["admin", "owner"]), getMerchants);

// Obtención de un comerciante
router.get("/:id", authMiddleware, validatorGetByID, checkRol(["merchant", "admin", "owner"]), checkSameOrGreaterAdminRol("merchant"), getMerchant);

// Registro de un comerciante
router.post("/register", validatorCreate, createMerchant);

// Inicio de sesión de un comerciante
router.post("/login", validatorLogin, loginMerchant);

// Restablecimiento de contraseña de un comerciante [Correo]
router.post("/restorepassword/email", validatorRestorePasswordEmail, restorePasswordEmail);

// Restablecimiento de contraseña de un comerciante [Código]
router.post("/restorepassword/code", validatorRestorePasswordCode, passwordRestorationEmailAuthMiddleware("merchant"), restorePasswordCode);

// Restablecimiento de contraseña de un comerciante [Contraseña]
router.put("/restorepassword", validatorRestorePasswordPassword, passwordRestorationPasswordAuthMiddleware("merchant"), restorePassword);

// Modificación de un comerciante
router.put("/:id", validatorGetByID, validatorCreate, authMiddleware, checkRol(["merchant", "admin", "owner"]), checkSameOrGreaterAdminRol("merchant"), updateMerchant);

// Borrado de un comerciante
router.delete("/:id", validatorGetByID, authMiddleware, checkRol(["merchant", "admin", "owner"]), checkSameOrGreaterAdminRol("merchant"), deleteMerchant);

// Activar un comerciante
router.put("/activate/:token", validatorActivateAccount, activateMerchantMiddleware, activateMerchant);

// Aceptación de un comerciante
router.put("/accept/:id", validatorGetByID, authMiddleware, checkRol(["admin", "owner"]), acceptMerchant);

/* Exportado de Módulo */
module.exports = router;