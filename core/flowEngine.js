const commands = require("../commands/loader");

const startup = commands.get("startup");

const {
    getSession,
    setSession,
    ensureSession
} = require("../utils/startup_manager");

// ======================
// 🧠 FLOW ENGINE STABLE
// ======================

async function flowEngine({
    sock,
    message,
    text,
    lid,
    gid,
    sender
}) {

    // ======================
    // 1. SAFE INPUT
    // ======================

    if (!message?.key || !sender) {
        return false;
    }

    const input = (text || "").trim();

    // ======================
    // 2. IDENTITÉ UNIQUE (CRUCIAL FIX)
// ======================

    // USER ID stable (priorité absolue)
    const userId = lid || sender;

    // GROUP ID séparé
    const groupId = gid;

    const sessionKey = userId;

    // ======================
    // 3. SESSION SAFE INIT
    // ======================

    let session = getSession(sessionKey);

    if (!session) {
        session = ensureSession(sessionKey, "welcome");
    }

    // ======================
    // 4. STARTUP FLOW PRIORITY
    // ======================

    const startupSteps = [
        "welcome",
        "welcome_choice",
        "discover",
        "profile",
        "edit_name",
        "language",
        "notifications",
        "ai",
        "group",
        "completed"
    ];

    if (startupSteps.includes(session.step)) {

        if (startup) {
            await startup.execute({
                sock,
                message,
                text: input,
                lid: sessionKey,
                gid,
                sender
            });

            return true; // 🔥 IMPORTANT
        }
    }

    // ======================
    // 5. COMMAND SYSTEM
    // ======================

    const commandName = input
        .split(" ")[0]
        ?.replace("@", "")
        ?.toLowerCase();

    const command = commands.get(commandName);

    if (command) {

        await command.execute({
            sock,
            message,
            text: input,
            lid: sessionKey,
            gid,
            sender
        });

        return true;
    }

    // ======================
    // 6. FALLBACK SAFE
    // ======================

    if (input.startsWith("@")) {

        await sock.sendMessage(sender, {
            text:
`⚠ Commande inconnue : ${commandName}

💡 Tape @help pour voir la liste des commandes`
        });

        return true;
    }

    // ======================
    // 7. IGNORE NON COMMAND INPUT
    // ======================

    return false;
}

module.exports = flowEngine;