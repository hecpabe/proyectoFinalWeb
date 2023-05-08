

/*
    Título: Nodemailer Config
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para gestionar la configuración de nodemailer
    Fecha: 20/4/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const nodemailer = require("nodemailer");

// Bibliotecas propias
const { nodemailerLogger } = require("./winstonLogger.config");

/* Declaraciones Globales */
const NODEMAILER_HOST = process.env.NODEMAILER_HOST;
const NODEMAILER_PORT = process.env.NODEMAILER_PORT;
const NODEMAILER_SECURE = process.env.NODEMAILER_SECURE;
const NODEMAILER_USER = process.env.NODEMAILER_USER;
const NODEMAILER_PASSWORD = process.env.NODEMAILER_PASSWORD;

/* Configuración del Transporter */
var nodemailerTransporter = nodemailer.createTransport({
    host: NODEMAILER_HOST,
    port: NODEMAILER_PORT,
    secure: NODEMAILER_SECURE,
    auth: {
      user: NODEMAILER_USER,
      pass: NODEMAILER_PASSWORD
    }
});

/* Verificación del Transporter */
nodemailerLogger.info("[Nodemailer Controller] Inicializando sistema de email...");
nodemailerTransporter.verify().then(() => {
    nodemailerLogger.info("[Nodemailer Controller] Sistema de email inicializado con éxito.");
}).catch((err) => {
    nodemailerLogger.error("[Nodemailer Controller] ERROR: No se ha podido inicializar el sistema de email.");
});

/* Exportado de Módulo */
module.exports = {
    nodemailerTransporter
}