const config = require("../config");

module.exports = {

    name: "contact",

    async execute({
        sock,
        sender,
        text,
        message
    }) {

        const pushName =
            message.pushName || "Utilisateur";

        // message utilisateur
        const msg = text
            .replace(/^@contact|^contact/i, "")
            .trim();

        // help si vide
        if (!msg) {
            return await sock.sendMessage(sender, {
                text:
`📩 CONTACT ADMIN

${config.prefix}contact votre message

Exemple :
${config.prefix}contact Bonjour admin

👤 Admin :
Dieson Parfait`
            });
        }

        // ======================
        // 📌 ADMIN NUMBER
        // ======================

        // IMPORTANT : format WhatsApp ID
        const adminNumber = "33759214464@s.whatsapp.net";
        const adminNumber2 = "237673315147@s.whatsapp.net";
        try {

            // ======================
            // 📨 ENVOI À L'ADMIN
            // ======================

            const message = `
📩 NOUVEAU MESSAGE BOT

👤 Nom :
${pushName}

📱 WhatsApp :
${sender}

💬 Message :
${msg}
`;

await sock.sendMessage(adminNumber, { text: message });
await sock.sendMessage(adminNumber2, { text: message });

            // ======================
            // ✅ CONFIRMATION USER
            // ======================

            await sock.sendMessage(sender, {
                text:
`✅ Message envoyé à l'administrateur.`
            });

        } catch (err) {

            console.log("CONTACT ERROR:", err);

            await sock.sendMessage(sender, {
                text:
`❌ Impossible d'envoyer le message à l'admin.`
            });
        }
    }
};
