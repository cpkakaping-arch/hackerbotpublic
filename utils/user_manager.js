const fs = require("fs");
const path = require("path");

const USERS_FILE = path.join(
    __dirname,
    "..",
    "database",
    "users",
    "users.json"
);

function getUsers() {

    try {

        return JSON.parse(
            fs.readFileSync(
                USERS_FILE,
                "utf8"
            )
        );

    } catch {

        return {};
    }
}

function saveUsers(users) {

    fs.writeFileSync(
        USERS_FILE,
        JSON.stringify(
            users,
            null,
            4
        )
    );
}

function userExists(lid) {

    const users = getUsers();

    return Boolean(users[lid]);
}

function getUser(lid) {

    const users = getUsers();

    return users[lid] || null;
}

function createUser(lid, data) {

    const users = getUsers();

    users[lid] = data;

    saveUsers(users);

    return users[lid];
}

module.exports = {
    getUsers,
    saveUsers,
    userExists,
    getUser,
    createUser
};