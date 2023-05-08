

/*
    Título: JSON Normalizer Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos una utilidad para normalizar los JSONs
    Fecha: 18/4/2023
    Última Modificación: 8/5/2023
*/

/* Codificación de Funciones */
// Función para normalizar un JSON de datos de tipo MongoDB a uno que admita Sequelize
/* Normalize JSON For Sequelize: Método con el que normalizamos un JSON de datos a un formato que admita Sequelize
    Parámetros: 
        0: [JSON] JSON a transformar
    Retorno: [JSON] JSON Adaptado
    Precondición: Ninguna.
    Complejidad Temporal: O(n) n -> Cantidad total de entradas y subentradas que tenga el JSON
    Complejidad Espacial: O(n) n -> Cantidad total de entradas y subentradas que tenga el JSON
*/
const normalizeJSONForSequelize = (json) => {

    // Variables necesarias
    var normalizedJSON = {};

    // Iteramos por los elementos del JSON buscando elementos hijos que sean JSON para normalizarlos también
    Object.keys(json).forEach((key) => {

        // Si el hijo es un JSON, lo normalizamos y lo incluímos en el nuevo JSON como padre_hijo
        if(typeof json[key] === "object"){

            // Normalizamos el JSON
            var normalizedSubJSON = normalizeJSONForSequelize(json[key]);

            // Iteramos por los elementos del hijo normalizado y los vamos agregando al padre
            Object.keys(normalizedSubJSON).forEach((subKey) => {
                normalizedJSON[key + "_" + subKey] = normalizedSubJSON[subKey];
            });

        }
        // Sino lo agregamos tal cual al JSON normalizado
        else
            normalizedJSON[key] = json[key];

    });

    return normalizedJSON;

}

/* Exportado de Módulo */
module.exports = {
    normalizeJSONForSequelize
}