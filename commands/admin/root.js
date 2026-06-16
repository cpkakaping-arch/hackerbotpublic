const config = require("../../config");

// ======================
// 🧠 ROOT STATE
// ======================

if (typeof global.ROOT_ACTIVE === "undefined") {
    global.ROOT_ACTIVE = false;
    global.ROOT_USER = null;
}

// ======================
// 🔧 NORMALISATION
// ======================

function normalize(jid = "") {

    if (typeof jid !== "string") {
        return "";
    }

    return jid
        .replace(/@s\.whatsapp\.net/g, "")
        .replace(/@lid/g, "")
        .replace(/@c\.us/g, "")
        .replace(/@g\.us/g, "")
        .split(":")[0];
}

// ======================
// 🔍 GROUP CHECK
// ======================

function isGroup(jid = "") {
    return jid.endsWith("@g.us");
}

// ======================
// 👤 EXTRAIRE VRAI USER
// ======================

function getRealSender(message = {}) {

    const remoteJid =
        message?.key?.remoteJid || "";

    // 👥 groupe
    if (isGroup(remoteJid)) {

        return (
            message?.key?.participant ||
            ""
        );
    }

    // 📩 privé
    return remoteJid;
}

// ======================
// 📜 COMMANDES ADMIN
// ======================

const adminCommands = [
    {
        name: "root",
        desc: "Active le mode administrateur"
    },

    {
        name: "none",
        desc: "Désactive la session ROOT"
    },

    {
        name: "sudo",
        desc: "Exécute une commande admin"
    },

    {
        name: "planif",
        desc: "Planification système"
    }
];

module.exports = {
    name: "root",

    async execute({
        sock,
        message = {}
    }) {

        // ======================
        // 👤 REAL USER
        // ======================

        const realSender =
            getRealSender(message);

        const senderNorm =
            normalize(realSender);

        const adminNorm =
            normalize(
                config.adminLid ||
                config.adminNumber
            );

        const currentRoot =
            normalize(global.ROOT_USER);

        const remoteJid =
            message?.key?.remoteJid || "";

        const inGroup =
            isGroup(remoteJid);

        const pushName =
            message?.pushName || "Unknown";

        // ======================
        // 🧪 DEBUG
        // ======================

        console.log("\n====================");
        console.log("🧪 ROOT DEBUG");
        console.log("====================");

        console.log("📨 remoteJid =", remoteJid);

        console.log("👤 participant =",
            message?.key?.participant);

        console.log("👤 realSender =", realSender);

        console.log("👤 pushName =", pushName);

        console.log("👥 inGroup =", inGroup);

        console.log("🧠 senderNorm =", senderNorm);

        console.log("👑 adminNorm =", adminNorm);

        console.log("⚡ ROOT ACTIVE =", global.ROOT_ACTIVE);

        console.log("🔐 ROOT USER =", currentRoot);

        console.log("====================\n");

        // ======================
        // 🔐 AUTH CHECK
        // ======================

        if (senderNorm !== adminNorm) {

            return await sock.sendMessage(
                remoteJid,
                {
                    text:
`⛔ ACCÈS REFUSÉ

❌ Tu n'es pas autorisé ROOT

👤 Detecté :
${pushName}
`
                }
            );
        }

        // ======================
        // 🔁 ROOT STATE CHECK
        // ======================

        if (global.ROOT_ACTIVE) {

            // ✔ même user
            if (currentRoot === senderNorm) {

                return await sock.sendMessage(
                    remoteJid,
                    {
                        text:
`👑 ROOT DÉJÀ ACTIF

✔ Tu es déjà connecté

📜 Commandes administrateur :

${adminCommands
.map(cmd =>
`• @${cmd.name}
  └ ${cmd.desc}`
).join("\n\n")}

💡 Exemple :
@sudo restart`
                    }
                );
            }

            // ❌ autre user
            return await sock.sendMessage(
                remoteJid,
                {
                    text:
`⛔ ROOT DÉJÀ UTILISÉ

👤 ROOT ACTIF :
${currentRoot}

💡 Utilise :
@none`
                }
            );
        }

        // ======================
        // ⚡ ACTIVER ROOT
        // ======================

        global.ROOT_ACTIVE = true;

        global.ROOT_USER = senderNorm;

        return await sock.sendMessage(
            remoteJid,
            {
                text:
`👑 ROOT ACTIVÉ

✔ Authentification réussie

👤 ${pushName}

⚡ Mode admin ON

📜 Commandes administrateur :

${adminCommands
.map(cmd =>
`• @${cmd.name}
  └ ${cmd.desc}`
).join("\n\n")}

💡 Utilisez :
@commande infos

Exemple :
@planif infos`
            }
        );
    }
};