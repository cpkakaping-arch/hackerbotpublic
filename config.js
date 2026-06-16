require("dotenv").config();

if (!process.env.GEMINI_API_KEY) 
    {
        console.warn("⚠ GEMINI_API_KEY non exportée");
    }

module.exports = {

    prefix: "@",

    botName: "Hacker Bot",

    creator: "Hacker Génie",

    org: "Area Reform (Open Formation)",

    geminiApiKey: process.env.GEMINI_API_KEY,

    geminiModel: "gemini-3.5-flash",

    adminNumber: "33759214464@s.whatsapp.net",

    adminName: "dieson parfait",

    adminLid: "205875633496113@lid",

    debug: true,

    version: "1.0.0",

    paths: 
    {

        commands: "./commands",

        adminCommands: "./commands/admin",

        database: "./database",

        planif: "./database/dbcommands/planif/planif.json",


    },
};