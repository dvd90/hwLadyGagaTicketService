class Admin extends User {
    constructor() {
        super();
    }

    admin?() {
        return true;
    }
}