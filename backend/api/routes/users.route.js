


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

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Login
router.post("/login", (req, res) => {
    res.send("Inicio de sesión");
});

// Register
router.post("/register", (req, res) => {
    res.send("Registro de usuarios");
});

// Recuperación de contraseña [Email que quiere recuperar la contraseña]
router.post("/restorepassword/email", (req, res) => {
    res.send("Recuperación de contraseña, paso de email");
});

// Recuperación de contraseña [Confirmar código de recuperación para garantizar la autenticación de la persona]
router.post("/restorepassword/code", (req, res) => {
    res.send("Recuperación de contraseña, paso de código");
});

// Recuperación de contraseña [Restaurar una contraseña nueva]
router.put("/restorepassword", (req, res) => {
    res.send("Recuperación de contraseña, restaurar contraseña");
});

// Obtención de todos los usuarios
router.get("/", (req, res) => {
    res.send("Obtención de todos los usuarios");
});

// Obtención de los datos de un usuario
router.get("/:username", (req, res) => {
    res.send("Obtención de un usuario");
});

// Modificación de un usuario
router.put("/:username", (req, res) => {
    res.send("Modificación de un usuario");
});

// Borrado de un usuario
router.delete("/:username", (req, res) => {
    res.send("Borrado de un usuario");
});

/* Exportado de Módulo */
module.exports = router;