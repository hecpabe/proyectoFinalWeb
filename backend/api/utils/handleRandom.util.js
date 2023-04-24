

/*
    Título: Handle Random Util
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos una utilidad para gestionar la generación aleatoria de nuestro sistema
    Fecha: 20/4/2023
    Última Modificación: 20/4/2023
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
// Obtención de un elemento aleatorio de un array
const getRandomElement = (array) => {
    return array[Math.floor(Math.random() * array.length)];
}

// Generación de un código aleatorio
const generateRandomCode = (length) => {

    // Variables necesarias
    var code = "";

    for(let i = 0; i < length; i++)
        code += getRandomElement(DIGITS);
    
    return code;

}

// Generación de una contraseña aleatoria
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