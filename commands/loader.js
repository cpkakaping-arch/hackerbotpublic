const fs = require("fs");
const path = require("path");

const commands = new Map();

// 🔥 ROOT ABSOLU DU PROJET
const baseDir = path.join(__dirname);

// ❌ fichiers à ignorer (MINIMAL FIX)
const EXCLUDED_FILES = new Set([
    "loader.js",
    "handler.js",
    "cmd_infos.js"
]);

function loadCommands(dir) {

    const files = fs.readdirSync(dir);

    for (const file of files) {

        const fullPath = path.join(dir, file);
        const stat = fs.lstatSync(fullPath);

        // ❌ IGNORE CACHE + HIDDEN + FILES SYSTEM
        if (
            file.startsWith(".") ||
            file.includes("checkpoint") ||
            EXCLUDED_FILES.has(file)
        ) {
            continue;
        }

        if (stat.isDirectory()) {

            loadCommands(fullPath);

        } else if (file.endsWith(".js")) {

            try {

                const command = require(fullPath);

                if (command?.name) {
                    commands.set(command.name, command);
                    console.log(`✅ CMD LOAD : ${command.name}`);
                }

            } catch (err) {
                console.log(`❌ ERROR CMD ${file}:`, err.message);
            }
        }
    }
}

// 🔥 ON CHARGE DEPUIS LE BON DOSSIER
loadCommands(baseDir);

module.exports = commands;