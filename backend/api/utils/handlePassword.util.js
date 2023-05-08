

/*
    Título: Handle Password Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la trabajar con las contraseñas
    Fecha: 18/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const bcryptjs = require("bcryptjs");

/* Definición de Constantes */
const SALT_ROUNDS = 10;

/* Codificación de Funciones */
/* Hash Passwod: Método con el que hasheamos una contraseña con bcrypt
    Parámetros: 
        0: [STRING] Contraseña en texto claro
    Retorno: [HASH] Contraseña hasheada
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const hashPassword = async (password) => {

    const hash = await bcryptjs.hash(password, SALT_ROUNDS);
    return hash;

}

// Comparación de contraseña con su hash
/* Compare Password: Método con el que verificamos una contraseña en texto claro con un hash
    Parámetros: 
        0: [STRING] Contraseña en texto claro
        1: [HASH] Contraseña hasheada con la que comprobar
    Retorno: [BOOL] Resultado de comparación de contraseña
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const comparePassword = async (password, hash) => {

    const result = await bcryptjs.compare(password, hash);
    return result;

}

/* Exportado de Módulo */
module.exports = {
    hashPassword,
    comparePassword
}