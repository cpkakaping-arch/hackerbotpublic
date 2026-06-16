const config = require("../config");

module.exports = {

    name: "help",

    async execute({ sock, sender }) {

        await sock.sendMessage(sender, {
            text:
`🤖 ${config.botName}

📌 MENU PRINCIPAL

🤖 IA
${config.prefix}ai → IA automatique
${config.prefix}fastai → IA rapide
${config.prefix}smartai → IA avancée

🖼 IMAGE
${config.prefix}image → génération d'image IA

🎥 VIDÉO
${config.prefix}video → génération vidéo IA

👑 ADMIN
${config.prefix}admin → informations du créateur
${config.prefix}contact → contacter l'administrateur

⚡ UTILITAIRES
${config.prefix}ping → test réseau
${config.prefix}info → infos bot
${config.prefix}salut → message accueil

📩 CONTACT
${config.prefix}contact votre_message
→ envoyer un message directement à l'admin

📚 AIDE AVANCÉE

👉 ${config.prefix}commande infos
(ex: ${config.prefix}ping infos)

💡 Astuce :
Chaque commande possède une documentation détaillée via cmd_infos.js

🏢 ${config.org}`
        });

    }
};