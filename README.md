# hacker_bot
un bot whatsapp avec fonctionnalité de hack
Voici un **README.md complet, propre et professionnel** pour ton bot WhatsApp Baileys + IA Gemini, de A à Z.

---

# 🤖 Open Formation Bot

Bot WhatsApp avancé basé sur **Baileys + Gemini AI**, conçu pour automatiser les conversations, gérer les groupes et fournir une intelligence artificielle intégrée.

---

# 🚀 Fonctionnalités

## 🤖 Intelligence Artificielle

* Chat IA via Gemini
* Mode rapide et intelligent (`fastai`, `smartai`)
* Compréhension naturelle des messages
* Réponses contextuelles

---

## ⚡ Commandes système

* Système de commandes modulaire
* Chargement automatique depuis `/commands`
* Prefix configurable (`@`)
* Commandes dynamiques + extensibles

---

## 👋 Système intelligent de salutations

* Détection automatique :

  * salut
  * bonjour
  * hello
  * yo
  * @salut
* Réponse automatique sans prefix

---

## 📡 Réseau

* `@ping` → ping réel système Linux
* support `-c` (nombre de paquets)
* retour console réel

---

## 📚 Aide intégrée

* `@help` → menu principal
* `@menu` → fonctionnalités du bot
* `@command infos` → documentation avancée

---

## 👥 Groupes (prévu / évolutif)

* gestion membres
* messages de bienvenue
* anti-spam
* contrôle d’adhésion
* système de likes

---

## 🎵 Multimédia (prévu)

* YouTube downloader
* audio / voice messages
* stickers
* génération de contenu

---

## 🌍 Multi-langue (prévu)

* français
* anglais
* détection automatique de langue

---

## 🧠 Architecture modulaire

* chaque commande est un fichier séparé
* système scalable
* facile à maintenir
* base plugin-ready

---

# 📁 Structure du projet

```
hacker_bot/
│
├── auth/                         # 🔐 session WhatsApp Baileys
hacker_bot/
│
├── commands/
│   │
│   ├── admin/                    # 👑 système admin
│   │   ├── admin_handler.js
│   │   ├── none.js
│   │   ├── planif_engine.js
│   │   ├── planif.js
│   │   ├── root.js
│   │   └── sudo.js
│   │
│   ├── system/                   # 🧠 CORE SYSTEM
│   │   ├── profile.js           # 👤 gestion profil user
│   │   ├── save.js              # 💾 sauvegarde données
│   │   ├── startup.js           # 🔥 initialisation bot
│   │   └── target.js            # 🎯 logique user/groupe
│   │
│   ├── admin.js                 # ⚙️ commandes admin global
│   ├── ai.js                    # 🤖 IA
│   ├── cmd_infos.js            # 📚 infos commandes
│   ├── contact.js              # 📇 contacts
│   ├── handler.js              # ⚡ routeur principal commandes
│   ├── help.js                 # 📘 aide
│   ├── image.js                # 🖼️ génération image
│   ├── infos.js                # ℹ️ infos bot
│   ├── loader.js               # 📦 chargeur de commandes
│   ├── menu.js                 # 📜 menu principal
│   ├── ping.js                 # 📡 test latence
│   ├── salut.js                # 👋 test simple
│   ├── test.js                 # 🧪 debug
│   ├── video.js                # 🎥 outils vidéo
│   └── testcontact.txt         # 🧾 fichier test (à supprimer si inutile)
│
├── core/
│   └── flowEngine.js           # 🧠 moteur principal du bot
│
├── database/
│   │
│   ├── commands/
│   │   └── planif/
│   │       └── planif.json     # 📅 données planification
│   │
│   └── users/
│       ├── startup_session.json # 🔐 session startup
│       └── users.json          # 👥 base utilisateurs
│
├── utils/
│   ├── startup_manager.js       # ⚙️ gestion démarrage
│   └── user_manager.js         # 👤 gestion users
│
├── config.js                   # ⚙️ configuration globale
├── index.js                    # 🚀 point d’entrée du bot
├── package.json                # 📦 dépendances npm
├── package-lock.json
├── README.md                   # 📘 documentation projet
└── tets.js                     # ⚠️ fichier test (probablement typo)
```

---

# ⚙️ Installation

## 1. Cloner le projet

```bash
git clone https://github.com/cpkakaping-arch/hacker_bot.git
cd hacker_bot
```

---

## 2. Installer les dépendances

```bash
npm install
```

---

## 3. Configuration `.env`

```env
GEMINI_API_KEY=ton_api_key_ici
```

---

## 4. Lancer le bot

```bash
node index.js
```

---

# ⚙️ Configuration (`config.js`)

```js
require("dotenv").config();

if (!process.env.GEMINI_API_KEY) 
    {
        console.warn("⚠ GEMINI_API_KEY non exportée");
    }

module.exports = {

    prefix: "@",

    botName: "Open Formation Bot",

    creator: "Hacker Génie",

    org: "Area Reform (Open Formation)",

    debug: true,

    geminiApiKey: process.env.GEMINI_API_KEY,

    geminiModel: "gemini-2.5-flash",

    version: "1.0.0",

        
    paths: 
    {

        commands: "./commands",

        adminCommands: "./admin_commands",

        database: "./database",

        planif: "./database/dbcommands/planif/planif.json",


    },
};
```

---

# 🤖 Commandes disponibles

## ⚡ IA

### Chat IA

```text
@ai explique javascript
```

### Modes futurs

```text
@fastai question rapide
@smartai question complexe
```

---

## 📡 Ping système

```text
@ping -c 4 8.8.8.8
```

---

## 👋 Salutation automatique

```text
salut
bonjour
hello
yo
```

---

## 📚 Help

```text
@help
```

---

## ℹ️ Infos bot

```text
@info
```

---

## 📖 Documentation commande

```text
@ping infos
@ai infos
```

---

# 🧠 Système cmd_infos.js

Chaque commande possède une documentation structurée :

```js
ping: {
    advanced: true,

    description: "Permet de tester une adresse IP avec un vrai ping système.",

    format: `${config.prefix}ping -c nombre ip`,

    example: `${config.prefix}ping -c 4 8.8.8.8`,

    details: [
        "-c définit le nombre de paquets",
        "Compatible IPv4",
        "Retourne le vrai résultat terminal Linux"
    ]
}
```

---

# 🧩 Architecture technique

* Baileys (WhatsApp Web API)
* Node.js v24+
* Gemini AI (@google/generative-ai et @google/genai)
* système de modules dynamique
* event-driven architecture

---

# ⚠️ Limitations actuelles

* génération vidéo (Veo) non supportée via SDK actuel
* génération image (Imagen) limitée selon API
* dépendance à Google Gemini API quota

---

# 🚀 Roadmap

## 🔥 Phase 1 (actuelle)

* bot fonctionnel WhatsApp
* IA Gemini
* commandes de base

## 🚀 Phase 2

* système cmd_infos dynamique
* menus automatiques
* catégories commandes

## 🤖 Phase 3

* IA multi-modèles (fast / smart / pro)
* router intelligent

## 🌍 Phase 4

* groupe management avancé
* anti-spam
* analytics

## 🎮 Phase 5

* jeux + XP + economy system

---

# 👨‍💻 Auteur

* **Nom** : Hacker Génie
* **Projet** : Hacker Bot
* **Organisation** : Area Reform (Open Formation)

---

# ⭐ Objectif du projet

Créer un **bot WhatsApp intelligent complet**, capable de :

* répondre comme une IA moderne
* gérer des groupes automatiquement
* évoluer comme une plateforme (Meta AI-like)
* rester modulaire et scalable

---

# 📌 Conclusion

Ce bot est conçu comme une base solide pour devenir :

👉 un assistant IA WhatsApp complet
👉 un système automatisé de gestion de groupes
👉 une plateforme évolutive multi-modules

---
