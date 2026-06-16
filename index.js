const fs = require("fs");
const pino = require("pino");

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason
} = require("@whiskeysockets/baileys");

const config = require("./config");

const handleCommands =
    require("./commands/handler");

const clearTerminal = (seconds = 5) => {
    setTimeout(() => {
        console.clear();
    }, seconds * 1000);
};

// ======================
// 📦 LOAD COMMANDS
// ======================

const commands = new Map();

const files =
    fs.readdirSync("./commands");

for (const file of files) {

    if (
        file.endsWith(".js") &&
        ![
            "handler.js",
            "cmd_infos.js"
        ].includes(file)
    ) {

        const command =
            require(`./commands/${file}`);

        if (command?.name) {
            commands.set(command.name, command);
        }
    }
}

// ======================
// 🚀 START BOT
// ======================

async function startBot() {

console.log(`🚀 ${config.botName} STARTING...`);

const { state, saveCreds } =
    await useMultiFileAuthState("./auth");

let isConnected = false; // 🔥 évite double connexion

const sock = makeWASocket({

    auth: state,
    logger: pino({ level: "silent" }),

    printQRInTerminal: false, // 🔥 on gère QR nous-mêmes

    browser: [
        config.botName,
        "Chrome",
        "1.0.0"
    ]
});

// ======================
// 💾 SAUVEGARDE SESSION
// ======================
sock.ev.on("creds.update", saveCreds);

// ======================
// 📡 CONNECTION HANDLER
// ======================
sock.ev.on("connection.update", (update) => {

    const { connection, lastDisconnect, qr } = update;

    // ======================
    // 📱 QR CODE (UNIQUEMENT SI PAS CONNECTÉ)
    // ======================
    if (qr && !isConnected) {
        console.log("\n📱 SCAN CE QR CODE :\n");

        const qrcode = require("qrcode-terminal");
        qrcode.generate(qr, { small: true });
    }

    // ======================
    // ✅ CONNECTÉ
    // ======================
    if (connection === "open") {

        isConnected = true;

        console.log("\n✅ BOT CONNECTÉ");
        console.log(`🏢 ${config.org}`);

        clearTerminal();
    }

    // ======================
    // ❌ DÉCONNEXION
    // ======================
    if (connection === "close") {

        isConnected = false;

        const statusCode =
            lastDisconnect?.error?.output?.statusCode;

        const shouldReconnect =
            statusCode !== DisconnectReason.loggedOut;

        console.log("❌ Connexion fermée:", statusCode);

        if (shouldReconnect) {

            console.log("🔄 Reconnexion...");

            setTimeout(() => {
                startBot(); // relance propre
            }, 3000);

        } else {
            console.log("🛑 Logout détecté → supprimer auth/");
        }
    }

    // ======================
    // 🔄 CONNECTING STATE
    // ======================
    if (connection === "connecting") {
        console.log("🔄 Connexion en cours...");
    }
});

    sock.ev.on("messages.upsert", async ({ messages }) => {

        const message = messages[0];

        if (!message?.message) return;

        if (message.key.remoteJid === "status@broadcast") return;

        const text =
            message.message.conversation ||
            message.message.extendedTextMessage?.text ||
            message.message.imageMessage?.caption ||
            message.message.videoMessage?.caption;

        if (!text) return;

        const sender = message.key.remoteJid;
        const pushName = message.pushName || "Utilisateur";

        console.log(`\n👤 ${pushName}: ${text}`);

        const lower = text.toLowerCase().trim();

        // ======================
        // 👋 GREETINGS SYSTEM
        // ======================

        const greetings = [
            "salut",
            "bonjour",
            "hello",
            "yo",
            "hi",
            "bonsoir",
            `${config.prefix}salut`
        ];

        if (greetings.includes(lower)) {

            const salutCommand = commands.get("salut");

            if (salutCommand) {
                await salutCommand.execute({
                    sock,
                    sender,
                    message
                });
                return;
            }
        }

        // ======================
        // 📦 COMMAND HANDLER
        // ======================

        await handleCommands({
            sock,
            message,
            commands
        });
    });
}

startBot();