const config = require("../config");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

// ======================
// 🧠 MODELS
// ======================

const MODELS = {
    smart: "models/gemini-2.5-pro",
    fast: "models/gemini-3.5-flash",
    auto: "models/gemini-3.5-flash"
};

// ======================
// 🧠 MEMORY STORE (RAM)
// ======================
// structure:
// { userId: [{role, text}, ...] }

const memory = {};
const MAX_MEMORY = 10;

// ======================
// 🧠 DETECT MODE
// ======================

function detectMode(text) {
    const t = text.toLowerCase();

    if (t.startsWith("smartai")) return "smart";
    if (t.startsWith("fastai")) return "fast";

    return "auto";
}

// ======================
// 🧠 CLEAN PROMPT
// ======================

function cleanPrompt(text) {
    return (text || "")
        .replace(/^smartai|^fastai|^ai/i, "")
        .trim();
}

// ======================
// 🧠 MEMORY HELPERS
// ======================

function getMemory(userId) {
    if (!memory[userId]) memory[userId] = [];
    return memory[userId];
}

function addMemory(userId, role, text) {
    const mem = getMemory(userId);

    mem.push({ role, text });

    if (mem.length > MAX_MEMORY) {
        mem.shift(); // supprime ancien message
    }
}

// ======================
// 🤖 MAIN
// ======================

module.exports = {
    name: "ai",

    async execute({ sock, sender, text }) {

        try {

            const userId = sender;
            const mode = detectMode(text);
            const prompt = cleanPrompt(text);

            if (!prompt) {
                return sock.sendMessage(sender, {
                    text:
`🤖 IA SYSTEM

Utilisation :

@ai question
@fastai question (rapide)
@smartai question (puissant)`
                });
            }

            // ======================
            // 🧠 LOAD MEMORY
            // ======================

            const history = getMemory(userId);

            // format history pour Gemini
            const contents = history.map(m => ({
                role: m.role,
                parts: [{ text: m.text }]
            }));

            // ajoute question actuelle
            contents.push({
                role: "user",
                parts: [{ text: prompt }]
            });

            // ======================
            // 🤖 MODEL CALL
            // ======================

            const model = genAI.getGenerativeModel({
                model: MODELS[mode]
            });

            const result = await model.generateContent({
                contents
            });

            const response = result.response.text();

            // ======================
            // 🧠 SAVE MEMORY
            // ======================

            addMemory(userId, "user", prompt);
            addMemory(userId, "model", response);

            return sock.sendMessage(sender, {
                text: response
            });

        } catch (err) {

            console.log("AI ERROR:", err);

            return sock.sendMessage(sender, {
                text: "❌ IA indisponible pour le moment"
            });
        }
    }
};
