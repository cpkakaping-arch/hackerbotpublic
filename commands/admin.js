const config = require("../config");

module.exports = {

    name: "admin",

    async execute({
        sock,
        sender,
        message
    }) {

        const pushName =
            message.pushName || "Utilisateur";

        await sock.sendMessage(sender, {
            text:
`👑 ADMINISTRATION BOT

👋 Salut ${pushName}

 Bot :
${config.botName}

👤 Créateur :
Dieson Parfait

📱 WhatsApp :
https://wa.me/33759214464

📘 Facebook :
https://facebook.com/share/1eYYcmJgN9

📸 Instagram :
https://instagram.com/tonprofil

💻 GitHub :
https://github.com/cpkakaping-arch

💡 Utilisez :

${config.prefix}help

pour voir toutes les commandes.

🏢 ${config.org}`
        });
    }
};