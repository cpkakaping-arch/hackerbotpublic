const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config");

const genAI = new GoogleGenerativeAI(config.geminiApiKey);

module.exports = {
    name: "image",

    async execute({ sock, sender, text }) {

        try {

            const prompt = (text || "")
                .replace(/^image/i, "")
                .trim();

            if (!prompt) {

                return sock.sendMessage(sender, {
                    text:
`🖼 IMAGE GENERATOR

Utilisation :

@image un chat cyberpunk
@image une ville futuriste
@image un robot hacker`
                });
            }

            await sock.sendMessage(sender, {
                text: "🎨 Génération de l'image en cours..."
            });

            const model = genAI.getGenerativeModel({
                model: "models/gemini-3.1-flash-image"
            });

            const result = await model.generateContent(prompt);

            console.log(
                "IMAGE RESULT:",
                JSON.stringify(result, null, 2)
            );

            await sock.sendMessage(sender, {
                text:
`✅ Requête image envoyée.

Prompt :
"${prompt}"

📋 Vérifiez les logs pour voir la structure exacte retournée par le modèle.`
            });

        } catch (err) {

            console.log("IMAGE ERROR:", err);

            await sock.sendMessage(sender, {
                text:
`❌ Erreur génération image

${err.message || "Erreur inconnue"}`
            });
        }
    }
};