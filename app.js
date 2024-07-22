const { createBot, createProvider, createFlow, addKeyword, EVENTS } = require('@bot-whatsapp/bot')

const QRPortalWeb = require('@bot-whatsapp/portal')
const BaileysProvider = require('@bot-whatsapp/provider/baileys')
const MockAdapter = require('@bot-whatsapp/database/mock')
const { delay } = require('@whiskeysockets/baileys')
const path = require("path")
const fs = require("fs")

const menuPath = path.join(__dirname,"mensajes", "menu.txt")
const menu =fs.readFileSync(menuPath,"utf-8")

const flowPrincipal = addKeyword(['hola', 'ole', 'alo','hello','buenas','buenos dias'])
    .addAnswer("!Hola! ☺👋🏻☕Soy el chatbot de Betos Coffee Shop 🧑🏻‍🚀☕¿En qué puedo ayudarte? 😃")
    .addAnswer('Escribe "Menú" para conocer nuestros productos')
    
    
const menuFlow = addKeyword("Menu","Menú").addAnswer(
    menu,
    
    {capture: true},
    async(ctx, {gotoFlow, fallBack, flowDynamic}) => {
        if (!["1","2","3","4","5"].includes(ctx.body)) {
            return fallBack(
                "Respuesta no valida , por favor selecciona una de las opciones..."
            );
            
        }switch(ctx.body){
            case "1" : 
             return await flowDynamic("aqui tienes el menu disponible de betoscoffeeshop:betoscoffeeshop.com");
             case "2" : 
             return await flowDynamic("Dentro de un momento uno de nuestros colaboradores se pondra en contacto contigo");
             case "3" : 
             return await flowDynamic("Dentro de un momento se Brindara informacion sobre eventos ");
             case "4" : 
             return await flowDynamic("Realiza tu pedido en el siguente enlace:betoscoffeeshop.com");
             case "5" : 
             return await flowDynamic("Saliendo del menu de opciones , si desea ingresar de nuevo solo escribe MENU");

        }
    }
);
const flowWelcome = addKeyword("me gustaría ordenar")
    .addAnswer("Su orden está siendo procesada", {
        delay: 1000,
    }, async (ctx, { flowDynamic }) => {
        if (ctx.body.includes("total")) {
            await flowDynamic("Su orden será procesada en un momento");
        } 
    });
const main = async () => {
    const adapterDB = new MockAdapter()
    const adapterFlow = createFlow([flowPrincipal, menuFlow, flowWelcome ])
    const adapterProvider = createProvider(BaileysProvider)

    createBot({
        flow: adapterFlow,
        provider: adapterProvider,
        database: adapterDB,
    })

    QRPortalWeb()
}

main()
