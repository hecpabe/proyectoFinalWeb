

/*
    Título: Handle Slack Logger
    Nombre: Héctor Paredes Benavides
    Descripción: Creamos un módulo para la gestión del logger de Slack
    Fecha: 7/5/2023
    Última Modificación: 8/5/2023
*/

/* Importado de Bibliotecas */
// Bibliotecas externas
const { IncomingWebhook } = require("@slack/webhook");

/* Declaraciones Constantes */
const SLACK_WEBHOOK = process.env.SLACK_WEBHOOK;

/* Webhook */
const webhook = new IncomingWebhook(SLACK_WEBHOOK);

/* Logger Stream */
const loggerStream = {

    write: message => {
        webhook.send({
            text: message
        });
    }

};

/* Exportado de Módulo */
module.exports = loggerStream;