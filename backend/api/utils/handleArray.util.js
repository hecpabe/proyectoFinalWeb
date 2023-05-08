

/*
    Título: Handle Array Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para trabajar con los arrays
    Fecha: 5/5/2023
    Última Modificación: 8/5/2023
*/

/* Codificación de Funciones */
/* Stringify Array: Método con el que transformamos un array a string
    Parámetros:
        0: [ARRAY] Array a convertir
    Retorno: [STRING] Array convertido
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const stringifyArray = (array) => {
    return array.toString();
}

/* String To Array: Método con el que transformamos un string a array
    Parámetros:
        0: [STRING] String a convertir
    Retorno: [ARRAY] String convertido
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const stringToArray = (string) => {
    return string.split(',').filter((element) => { return element.length > 0 });
}

/* Exportado de Módulo */
module.exports = {
    stringifyArray,
    stringToArray
}