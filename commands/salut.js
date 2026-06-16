const config = require("../config");

module.exports = {

    name: "salut",

  async execute({
        sock,
        sender,
        message
    }) {

        const pushName =
            message.pushName || "Utilisateur";
        console.log("user =", pushName);
        await sock.sendMessage(sender, {
            text:
`👋 Salut ${pushName}

🤖 Bienvenue sur ${config.botName}

💡 Utilisez :

${config.prefix}help

pour voir toutes les commandes.

🏢 ${config.org}`
        });

    }
};
/*
 async execute({
        sock,
        sender,
        message,
        text
    }) {

        // =========================
        // VARIABLES DEBUG
        // =========================

        const remoteJid =
            message.key.remoteJid;

        const fromMe =
            message.key.fromMe;

        const messageId =
            message.key.id;

        const participant =
            message.key.participant || null;

        const pushName =
            message.pushName || "Unknown";

        const messageType =
            Object.keys(message.message || {})[0];

        // =========================
        // DEBUG
        // =========================

        console.log("\n====================");

        console.log("📩 DEBUG MESSAGE");

        console.log("====================");

        console.log("🆔 ID :", messageId);

        console.log("👤 PushName :", pushName);

        console.log("📱 Sender :", sender);

        console.log("📦 Type :", messageType);

        console.log("👥 Participant :", participant);

        console.log("📨 RemoteJid :", remoteJid);

        console.log("🤖 FromMe :", fromMe);

        console.log("💬 Text :", text);

        console.log("====================\n");

        // réponse test
        await sock.sendMessage(sender, {
            text: "Salut 👋"
        });

    }
};
*/