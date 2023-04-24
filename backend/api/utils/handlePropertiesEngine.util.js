

/*
    Título: Handle Properties Engine Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo que gestione las propiedades en función del motor de base de datos que estemos utilizando
    Fecha: 18/4/2023
    Última Modificación: 18/4/2023
*/

/* Definciión de Constantes */
const DB_ENGINE = process.env.DB_ENGINE;

/* Codificación de Funciones */
const getProperties = () => {

    const data = {
        nosql: {
            id: "_id"
        },
        mysql: {
            id: "id"
        }
    }

    return data[DB_ENGINE];

}

/* Exportado de Módulo */
module.exports = {
    getProperties
};