const { MongoWrapper } = require('../../../shared/mongowrapper');

/**
 * UserHandler handles add users, update information and remove users.
 */
class UserHandler {
    constructor() {
        return this.#init();
    }

    async #init() {
        this.db = await new MongoWrapper('users');
        this.collectionName = 'users';
        return this;
    }

    /**
     * Returns the user with the specified userID.
     * @param {number} userId - the user's id.
     * @returns {Object} The user object.
     */
    async getUser(userId) {
        try {
            const user = await this.db.findOneUser(this.collectionName, userId);
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Returns all users.
     * @returns {Object} The users object.
     */
    async getUsers() {
        try {
            const users = await this.db.findUser(this.collectionName);
            return users;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Inserts a new user to the database.
     * @param {Object} newUser - The new user's data.
     * @returns {Object} The result of the insert operation.
     */
    async addUser(newUser) {
        try {
            const user = await this.db.insertOneUser(this.collectionName, newUser);
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Updates information about the user.
     * @param {Object} userToUpdate - The user's updated data.
     * @returns {Object} - The result of the update operation.
     */
    async updateUser(userToUpdate) {
        try {
            // Copy of object because can't update a object with _id
            let objectWithoutId = JSON.parse(JSON.stringify(userToUpdate));
            // Remove _id from object to be updated
            delete objectWithoutId._id;
            const user = await this.db.updateOneUser(this.collectionName, userToUpdate._id,
                objectWithoutId);
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Removes a user from the database.
     * @param {number} userToRemove - The user to delete.
     * @returns {Object} - The result of the delete operation.
     */
    async removeUser(userId) {
        try {
            const user = await this.db.deleteOneUser(this.collectionName, userId);
            return user;
        } catch (error) {
            console.log(error);
        }
    }

    // testfunktion, ska flyttas från denna filen
    async newTestUser() {
        // testar att hämta alla användare
        const allUsers = await this.getUsers();
        console.log("Alla användare innan jag lagt till någon");
        console.log(allUsers);

        const newUser = {
            "_id": 1,
            "name": "Pontus Andersson",
            "mobile": "0705556747",
            "mail": "adam.karlsson@karlskrona.se",
            "city": "Karlskrona",
            "address": "Karlskronagatan 15",
            "zip": "37470",
            "admin": false,
            "balance": 0
        }
    
        // testar ett lägga till en användare
        const addUser = await this.addUser(newUser);
        console.log("");
        console.log("Lägger till användare");
        console.log(addUser);

        // testar att hitta alla användare
        const allUsers2 = await this.getUsers();
        console.log("");
        console.log("Alla användare nu");
        console.log(allUsers2);
        console.log("");

        // testar att hitta en användare
        const findOneUser = await this.getUser(1);
        if (findOneUser) {
            console.log("Användaren 1 finns");
            console.log(findOneUser);
        } else {
            console.log("Användaren 1 finns inte");
        }

        console.log("");
        // testar att hitta en användare som inte finns
        const findOneUser2 = await this.getUser(2);
        if (findOneUser2) {
            console.log("Användaren 2 finns");
        } else {
            console.log("Användaren 2 finns inte");
        }

        console.log(" ");
        // testar att uppdatera en användare
        findOneUser.balance = 20.90;
        findOneUser.name = "Arne Nilsson";
        const updateUser2 = await this.updateUser(findOneUser);
        console.log(updateUser2);
        const findOneUser3 = await this.getUser(1);
        console.log(findOneUser3);
        console.log("Användare 1 nu uppdaterad");
        console.log("");

        // testar att ta bort en användare
        console.log("Tar bort användare 1");
        const remove2 = await this.removeUser(1);
        console.log(remove2);
        const findOneUser4 = await this.getUser(1);
        console.log(findOneUser4);
        console.log("Användare 1 nu borttagen");
    }
}

//const testFunc = async () => {
    //const sh = await new UserHandler();
    //await sh.newTestUser();
//}
//testFunc();

module.exports = { UserHandler };
