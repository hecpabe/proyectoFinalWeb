

/*
    Título: Handle Random Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos una utilidad para gestionar la generación aleatoria de nuestro sistema
    Fecha: 20/4/2023
    Última Modificación: 8/5/2023
*/

/* Declaraciones Globales */
const LOWERCASE = "qwertyuiopasdfghjklzxcvbnm";
const UPPERCASE = LOWERCASE.toUpperCase();
const SPECIAL_CHARACTERS = "._,!";
const DIGITS = "0123456789";
const ALPHABET = LOWERCASE + UPPERCASE;
const ALPHANUMERIC = ALPHABET + DIGITS;
const ALL_CHARS = ALPHANUMERIC + SPECIAL_CHARACTERS;

/* Codificación de Funciones */
/* Get Random Element: Método con el que obtenemos un elemento aleatorio de un array
    Parámetros: 
        0: [ARRAY] Array del que extraer el elemento aleatorio
    Retorno: [ELEMENTO] Elemento obtenido de forma aleatoria
    Precondición: Ninguna.
    Complejidad Temporal: O(1)
    Complejidad Espacial: O(1)
*/
const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

/* Generate Random Code: Método con el que generamos un código aleatorio
    Parámetros: 
        0: [INT] Longitud del código a generar
    Retorno: [STRING] Código generado
    Precondición: Ninguna.
    Complejidad Temporal: O(n) n -> Longitud del código
    Complejidad Espacial: O(n) n -> Longitud del ćodigo
*/
const generateRandomCode = (length) => {

    // Variables necesarias
    var code = "";

    for(let i = 0; i < length; i++)
        code += getRandomElement(DIGITS);
    
    return code;

}

// Generación de una contraseña aleatoria
/* Generate Random Password: Método con el que generamos una contraseña aleatoria
    Parámetros: 
        0: [INT] Longitud de la contraseña
        1: [INT] Cantidad de mayúsculas
        2: [INT] Cantidad de minúsculas
        3: [INT] Cantidad de dígitos
        4: [INT] Cantidad de carácteres especiales
    Retorno: [STRING] Contraseña generada
    Precondición: Ninguna.
    Complejidad Temporal: O(n) n -> Longitud de la contraseña
    Complejidad Espacial: O(n) n -> Longitud de la contraseña
*/
const generateRandomPassword = (length, nUppercase, nLowercase, nDigits, nSpecChars) => {

    // Variables necesarias
    var password = "";
    var uppercaseSetted = 0;
    var lowercaseSetted = 0;
    var digitsSetted = 0;
    var specCharsSetted = 0;

    // Generamos la contraseña
    for(let i = 0; i < length; i++)
        if(nUppercase > uppercaseSetted){
            password += getRandomElement(UPPERCASE);
            uppercaseSetted++;
        }
        else if(nLowercase > lowercaseSetted){
            password += getRandomElement(LOWERCASE);
            lowercaseSetted++;
        }
        else if(nDigits > digitsSetted){
            password += getRandomElement(DIGITS);
            digitsSetted++;
        }
        else if(nSpecChars > specCharsSetted){
            password += getRandomElement(SPECIAL_CHARACTERS);
            specCharsSetted++;
        }
        else
            password += getRandomElement(ALL_CHARS);
    
    return password;

}

/* Exportado de Módulo */
module.exports = {
    getRandomElement,
    generateRandomCode,
    generateRandomPassword
}