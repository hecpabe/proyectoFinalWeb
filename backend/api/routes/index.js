

/*
    Título: Index
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un fichero general para importar las rutas del programa
    Fecha: 30/3/2023
    Última Modificación: 30/3/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const express = require("express");
const fs = require("fs");

/* Declaraciones Globales */
// Constantes
const router = express.Router();

/* Codificación de Funciones */
/* Remove File Extension: Función con la que obtenemos el nombre de los ficheros
    Parámetros: 
        0: [STRING] Nombre del fichero
    Retorno: [STRING] Nombre sin la extensión
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const removeFileExtension = (fileName) => {

    // Devolvemos la primera parte (antes del punto)
    return fileName.split('.').shift();

}

/* Ejecución Principal */
// Recorremos todas las rutas y las vamos añadiendo
fs.readdirSync(__dirname).filter((file) => {
    
    // Variables necesarias
    const name = removeFileExtension(file);

    // Si no es el fichero filter añadimos la ruta
    if(name !== 'index')
        router.use("/" + name, require('./' + name + ".route"))

});

/* Exportado de módulo */
module.exports = router;