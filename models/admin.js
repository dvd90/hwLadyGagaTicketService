const User = require('./user.js');

module.exports = class Admin extends User {
    constructor(name) {
        super(name);
        this.adminKey = "crazyPassword";
    }

    isAdmin() {
        return true;
    }

    // static checkAdminPassword(pw) {
    //     return adminKey === pw;
    // }
}