

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

/* Declaraciones Constantes */
const router = express.Router();

/* Rutas */
// Obtención de todos los comerciantes
router.get("/", (req, res) => {
    res.send("Obtención de todos los comerciantes");
});

// Obtención de un comerciante
router.get("/:id", (req, res) => {
    res.send("Obtención de un comerciante");
});

// Registro de un comerciante
router.post("/register", (req, res) => {
    res.send("Registro de un comerciante");
});

// Inicio de sesión de un comerciante
router.post("/login", (req, res) => {
    res.send("Inicio de sesión de un comerciante");
});

// Restablecimiento de contraseña de un comerciante [Correo]
router.post("/restorepassword/email", (req, res) => {
    res.send("Restablecimiento de contraseá de un comerciante [Correo]");
});

// Restablecimiento de contraseña de un comerciante [Código]
router.post("/restorepassword/code", (req, res) => {
    res.send("Restablecimiento de contraseña de un comerciante [Código]");
});

// Restablecimiento de contraseña de un comerciante [Contraseña]
router.put("/restorepassword", (req, res) => {
    res.send("Restablecimiento de contraseña de un comerciante [Contraseña]");
});

// Modificación de un comerciante
router.put("/:id", (req, res) => {
    res.send("Modificación de un comerciante");
});

// Borrado de un comerciante
router.delete("/:id", (req, res) => {
    res.send("Borrado de un comerciante");
});

/* Exportado de Módulo */
module.exports = router;