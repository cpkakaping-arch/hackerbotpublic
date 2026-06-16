const {
    updateSession,
    deleteSession
} = require("../../utils/startup_manager");

function normalize(text = "") {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
}

module.exports = {

name: "startup",

async execute({
    sock,
    sender,
    lid,
    text = "",
    message
}) {

    const input = normalize(text);
    const pushName = message.pushName || "Utilisateur";

    let session = require("../../utils/startup_manager").getSession(lid);

    // ======================
    // 🚀 WELCOME
    // ======================
    if (session.step === "welcome") {

        updateSession(lid, { step: "welcome_choice" });

        return sock.sendMessage(sender, {
            text:
`━━━━━━━━━━━━━━━━━━
🤖 HACKER BOT SETUP
━━━━━━━━━━━━━━━━━━

Bienvenue.

1️⃣ Installation rapide
2️⃣ Découvrir le bot
3️⃣ Quitter`
        });
    }

    // ======================
    // 📖 WELCOME CHOICE
    // ======================
    if (session.step === "welcome_choice") {

        if (input === "1") {
            updateSession(lid, { step: "install" });
        }

        if (input === "2") {
            updateSession(lid, { step: "discover" });
        }

        if (input === "3") {
            deleteSession(lid);

            return sock.sendMessage(sender, {
                text: "❌ Installation annulée. @start"
            });
        }

        return sock.sendMessage(sender, {
            text: "1 / 2 / 3"
        });
    }

    // ======================
    // 📖 DISCOVER
    // ======================
    if (session.step === "discover") {

        updateSession(lid, { step: "install" });

        return sock.sendMessage(sender, {
            text:
`📖 BOT INFO

IA, planif, admin, groupe.

Continuer ? 1 / 2`
        });
    }

    // ======================
    // ⚙ INSTALL
    // ======================
    if (session.step === "install") {

        updateSession(lid, { step: "profile" });

        return sock.sendMessage(sender, {
            text:
`👤 PROFIL

Nom: ${pushName}
ID: ${lid}

1️⃣ OK
2️⃣ Modifier
3️⃣ Quitter`
        });
    }

    // ======================
    // 👤 PROFILE
    // ======================
    if (session.step === "profile") {

        if (input === "1") {
            updateSession(lid, { step: "language" });
        }

        if (input === "2") {
            updateSession(lid, { step: "edit_name" });
        }

        if (input === "3") {
            deleteSession(lid);
            return sock.sendMessage(sender, { text: "❌ annulé" });
        }

        return sock.sendMessage(sender, {
            text: "1 / 2 / 3"
        });
    }

    // ======================
    // ✏ EDIT NAME
    // ======================
    if (session.step === "edit_name") {

        updateSession(lid, {
            step: "language",
            data: { name: text }
        });

        return sock.sendMessage(sender, {
            text: "✅ Nom enregistré"
        });
    }

    // ======================
    // 🌍 LANGUAGE
    // ======================
    if (session.step === "language") {

        updateSession(lid, { step: "notifications" });

        return sock.sendMessage(sender, {
            text: "1 FR / 2 EN / 3 AUTO"
        });
    }

    // ======================
    // 🔔 NOTIFICATIONS
    // ======================
    if (session.step === "notifications") {

        updateSession(lid, { step: "ai" });

        return sock.sendMessage(sender, {
            text: "1 all / 2 important / 3 off"
        });
    }

    // ======================
    // 🧠 AI
    // ======================
    if (session.step === "ai") {

        updateSession(lid, { step: "group" });

        return sock.sendMessage(sender, {
            text: "AI ? 1 / 2"
        });
    }

    // ======================
    // 👥 GROUP
    // ======================
    if (session.step === "group") {

        updateSession(lid, { step: "completed" });

        return sock.sendMessage(sender, {
            text:
`✅ INSTALLATION TERMINÉE

Tape @help`
        });
    }

    // ======================
    // 🚀 COMPLETED
    // ======================
    if (session.step === "completed") {

        return sock.sendMessage(sender, {
            text: "Déjà installé → @help"
        });
    }
}
};