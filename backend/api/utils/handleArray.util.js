

/*
    Título: Handle Array Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para trabajar con los arrays
    Fecha: 5/5/2023
    Última Modificación: 5/5/2023
*/

/* Codificación de Funciones */
const stringifyArray = (array) => {
    return array.toString();
}

const stringToArray = (string) => {
    return string.split(',').filter((element) => { return element.length > 0 });
}

/* Exportado de Módulo */
module.exports = {
    stringifyArray,
    stringToArray
}