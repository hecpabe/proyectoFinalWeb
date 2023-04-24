

/*
    Título: Handle Password Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la trabajar con las contraseñas
    Fecha: 18/4/2023
    Última Modificación: 18/4/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const bcryptjs = require("bcryptjs");

/* Definición de Constantes */
const SALT_ROUNDS = 10;

/* Codificación de Funciones */
// Hasheo de contraseñas
const hashPassword = async (password) => {

    const hash = await bcryptjs.hash(password, SALT_ROUNDS);
    return hash;

}

// Comparación de contraseña con su hash
const comparePassword = async (password, hash) => {

    const result = await bcryptjs.compare(password, hash);
    return result;

}

/* Exportado de Módulo */
module.exports = {
    hashPassword,
    comparePassword
}