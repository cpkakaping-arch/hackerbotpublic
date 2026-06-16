const config = require("../config");
const flowEngine = require("../core/flowEngine");
const cmdInfos = require("./cmd_infos");
const commands = require("./loader");
// 🧠 ADMIN HANDLER
const adminHandler = require("./admin/admin_handler");

function getText(message) {
    return (
        message?.message?.conversation ||
        message?.message?.extendedTextMessage?.text ||
        message?.message?.imageMessage?.caption ||
        message?.message?.videoMessage?.caption ||
        ""
    );
}


module.exports = async function handleCommands({
    sock,
    message,
}) {

    try {

        const text = getText(message)?.trim();
        if (!text) return;

        if (!text.startsWith(config.prefix)) return;

        const sender = message.key.remoteJid;

        const body = text
            .slice(config.prefix.length)
            .trim();

        const args = body.split(" ").filter(Boolean);

        const commandName = (args.shift() || "").toLowerCase();

        const command = commands.get(commandName);

        // ======================
        // ❌ COMMANDE INCONNUE
        // ======================

        if (!command) {

            return await sock.sendMessage(sender, {
                text:
`❌ Commande inconnue : ${commandName}

💡 Utilisez ${config.prefix}help`
            });
        }

        const infos = cmdInfos[commandName];

        // ======================
        // 📘 HELP AUTO
        // ======================

        if (
            infos?.advanced &&
            args.length === 0
        ) {

            return await sock.sendMessage(sender, {
                text:
`📘 ${config.prefix}${commandName}

📝 ${infos.description}

📌 Format :
${infos.format}

💡 Exemple :
${infos.example}

📚 Utilisez :
${config.prefix}${commandName} infos`
            });
        }

        // ======================
        // 📚 INFOS DÉTAILLÉES
        // ======================

        if (
            infos?.advanced &&
            args[0]?.toLowerCase() === "infos"
        ) {

            return await sock.sendMessage(sender, {
                text:
`📚 Documentation ${config.prefix}${commandName}

📝 ${infos.description}

📌 Format :
${infos.format}

💡 Exemple :
${infos.example}

📖 Détails :

${infos.details.map(d => `• ${d}`).join("\n")}`
            });
        }

        // ======================
        // 👑 ADMIN REDIRECTION
        // ======================

        const adminCommands = [
            "root",
            "none",
            "sudo",
            "planif"
        ];

        if (adminCommands.includes(commandName)) {

            return await adminHandler({
                sock,
                message,
                commands,
                commandName,
                args
            });
        }

        // ======================
        // ⚙️ EXECUTION NORMALE
        // ======================

        return await command.execute({
            sock,
            sender,
            message,
            text,
            args
        });

    } catch (err) {

    console.log("❌ HANDLER ERROR:", err);

    await sock.sendMessage(
        message.key.remoteJid,
        {
            text:
`❌ Une erreur est survenue.

Consultez les logs du bot.`
        }
    );
}
};