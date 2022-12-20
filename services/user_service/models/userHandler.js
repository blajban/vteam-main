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
}

module.exports = { UserHandler };
