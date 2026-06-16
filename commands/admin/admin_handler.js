const config = require("../../config");

if (typeof global.ROOT_ACTIVE === "undefined") {
    global.ROOT_ACTIVE = false;
    global.ROOT_USER = null;
}

module.exports = async function adminHandler({
    sock,
    message,
    commandName,
    args
}) {

    const sender = message.key.remoteJid;

    // ======================
    // 👑 ROOT COMMAND EXCEPTION
    // ======================

    // 👉 root doit toujours passer ici
    if (commandName === "root") {
        const command = require("../loader").get("root");

        if (!command) {
            return await sock.sendMessage(sender, {
                text: "❌ Commande root introuvable"
            });
        }

        return await command.execute({
            sock,
            sender,
            message,
            text: args.join(" "),
            args
        });
    }

    // ======================
    // 🔐 CHECK ROOT STATE
    // ======================

    if (!global.ROOT_ACTIVE || global.ROOT_USER !== sender) {

        return await sock.sendMessage(sender, {
            text:
`⛔ ACCÈS REFUSÉ

❌ Mode ROOT non activé

👉 utilisez : ${config.prefix}root`
        });
    }

    // ======================
    // ⚡ EXECUTION ADMIN COMMANDS
    // ======================

    const command = require("../loader").get(commandName);

    if (!command) {
        return await sock.sendMessage(sender, {
            text: `❌ Commande admin inconnue : ${commandName}`
        });
    }

    return await command.execute({
        sock,
        sender,
        message,
        text: args.join(" "),
        args
    });
};