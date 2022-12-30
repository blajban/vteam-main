/**
 * UserHandler handles add users, update information and remove users.
 */
class UserHandler {
  /**
   * Creates a new AuthHandler instance and initializes the db conncetion.
   * @param {object} mongoWrapper - A MongoWrapper object
   */
  constructor(mongoWrapper) {
    this.db = mongoWrapper;
    this.collectionName = 'users';
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
      return error;
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
      return error;
    }
  }

  /**
   * Inserts a new user to the database.
   * @param {Object} newUser - The new user's data.
   * @returns {Promise<object>} The inserted user.
   */
  async addUser(newUser) {
    try {
      await this.db.insertOneUser(this.collectionName, newUser);
      return newUser;
    } catch (error) {
      return error;
    }
  }

  /**
   * Updates information about the user.
   * @param {Object} userToUpdate - The user's updated data.
   * @returns {Object} - The updated user.
   */
  async updateUser(userToUpdate) {
    try {
      // Copy of object because can't update a object with _id
      const objectWithoutId = JSON.parse(JSON.stringify(userToUpdate));
      // Remove _id from object to be updated
      delete objectWithoutId._id;

      await this.db.updateOneUser(
        this.collectionName,
        userToUpdate._id,
        objectWithoutId,
      );
      return userToUpdate;
    } catch (error) {
      return error;
    }
  }

  /**
   * Removes a user from the database.
   * @param {number} userToRemove - The user to delete.
   * @returns {Object} - The removed user.
   */
  async removeUser(userId) {
    try {
      const user = await this.getUser(userId);
      await this.db.deleteOneUser(this.collectionName, userId);
      return user;
    } catch (error) {
      return error;
    }
  }
}

module.exports = { UserHandler };
