 const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

async function run() {
    try {
        const res = await ai.models.list();

        console.log("🔥 MODELES OK");
        console.log(res.pageInternal?.slice(0, 5)); // petit aperçu

    } catch (err) {
        console.error("❌ ERREUR API:", err.message);
    }
}

run();