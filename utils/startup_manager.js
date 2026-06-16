const fs = require("fs");
const path = require("path");

const SESSION_FILE = path.join(
    __dirname,
    "..",
    "database",
    "users",
    "startup_session.json"
);

// ======================
// 📦 LOAD SAFE
// ======================
function load() {
    try {
        if (!fs.existsSync(SESSION_FILE)) {
            fs.mkdirSync(path.dirname(SESSION_FILE), { recursive: true });
            fs.writeFileSync(SESSION_FILE, "{}");
        }

        const raw = fs.readFileSync(SESSION_FILE, "utf8");
        return raw ? JSON.parse(raw) : {};
    } catch (e) {
        console.log("SESSION LOAD ERROR", e);
        return {};
    }
}

// ======================
// 💾 SAVE SAFE
// ======================
function save(data) {
    try {
        fs.writeFileSync(SESSION_FILE, JSON.stringify(data, null, 4));
    } catch (e) {
        console.log("SESSION SAVE ERROR", e);
    }
}

// ======================
// 👤 GET
// ======================
function getSession(lid) {
    return load()[lid] || null;
}

// ======================
// 🔁 UPSERT (IMPORTANT)
// ======================
function updateSession(lid, patch) {
    const data = load();

    data[lid] = {
        ...(data[lid] || {
            step: "welcome",
            data: {}
        }),
        ...patch,
        data: {
            ...((data[lid] || {}).data || {}),
            ...(patch.data || {})
        },
        updatedAt: Date.now()
    };

    save(data);
    return data[lid];
}

// ======================
// ❌ DELETE
// ======================
function deleteSession(lid) {
    const data = load();
    delete data[lid];
    save(data);
}

// ======================
// 🚀 INIT
// ======================
function initSession(lid) {
    const data = load();

    if (!data[lid]) {
        data[lid] = {
            step: "welcome",
            data: {},
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        save(data);
    }

    return data[lid];
}

module.exports = {
    getSession,
    updateSession,
    deleteSession,
    initSession
};