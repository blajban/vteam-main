const { UserHandler } = require('./userHandler');

/**
 * Mock for MongoWrapper class.
 */
class MockMongoWrapper {
  constructor(users) {
    this.users = users;
  }

  async insertOneUser(collectionName, user) {
    this.users.push(user);
    return user;
  }

  async findUser(collectionName) {
    return this.users;
  }

  async findOneUser(collectionName, userId) {
    for (let i = 0; i < this.users.length; i += 1) {
      if (this.users[i]._id === userId) {
        return this.users[i];
      }
    }
    return null;
  }

  async updateOneUser(collectionName, userId, userToUpdate) {
    for (let i = 0; i < this.users.length; i += 1) {
      if (this.users[i]._id === userId) {
        this.users[i].name = userToUpdate.name;
        this.users[i].mobile = userToUpdate.mobile;
        this.users[i].mail = userToUpdate.mail;
        this.users[i].city = userToUpdate.city;
        this.users[i].address = userToUpdate.address;
        this.users[i].zip = userToUpdate.zip;
        this.users[i].admin = userToUpdate.admin;
        this.users[i].balance = userToUpdate.balance;
        return userToUpdate;
      }
    }
    return null;
  }

  async deleteOneUser(collectionName, userId) {
    for (let i = 0; i < this.users.length; i += 1) {
      if (this.users[i]._id === userId) {
        this.users.splice(i, 1);
        return true;
      }
    }
    return false;
  }
}

describe('UserHandler', () => {
  let userHandler;
  let db;

  beforeEach(async () => {
    db = new MockMongoWrapper([
      {
        _id: 1,
        name: 'Pontus Andersson',
        mobile: '0705556747',
        mail: 'pontus.andersson@karlskrona.se',
        city: 'Karlskrona',
        address: 'Karlskronagatan 15',
        zip: 37170,
        admin: false,
        balance: 0,
      },
      {
        _id: 2,
        name: 'Lisa Karlsson',
        mobile: '0705556738',
        mail: 'lisa.karlsson@karlshamn.se',
        city: 'Karlshamn',
        address: 'Karlshamnsvägen 57',
        zip: '37470',
        admin: false,
        balance: 0,
      },
      {
        _id: 3,
        name: 'Mats Svensson',
        mobile: '0705556795',
        mail: 'mats.svensson@ronneby.se',
        city: 'Ronneby',
        address: 'Ronnebystigen 33',
        zip: '37230',
        admin: false,
        balance: 0,
      },
    ]);
    userHandler = await new UserHandler(db);
  });

  describe('getUsers', () => {
    it('return all users', async () => {
      const users = await userHandler.getUsers();
      const usersFromDb = await db.findUser('users');
      expect(users).toEqual(usersFromDb);
    });

    it('return one user with an ID', async () => {
      const user = await userHandler.getUser(1);
      const userFromDb = await db.findOneUser('users', 1);
      expect(user).toEqual(userFromDb);
    });
  });

  describe('addUser', () => {
    it('add user', async () => {
      const newUserInfo = {
        _id: 4,
        name: 'Maria Rosenkvist',
        mobile: '0705556752',
        mail: 'maria.rosenkvist@kalmar.se',
        city: 'Kalmar',
        address: 'Kalmarvägen 18',
        zip: '39235',
        admin: false,
        balance: 0,
      };
      const newUser = await userHandler.addUser(newUserInfo);
      const userFromDb = await db.findOneUser('users', newUserInfo._id);
      expect(newUser).toEqual(userFromDb);
    });
  });

  describe('updateUser', () => {
    it('update user', async () => {
      const updateUserInfo = {
        _id: 3,
        name: 'Mats Svensson',
        mobile: '0705556795',
        mail: 'mats.svensson@ronneby.se',
        city: 'Kristianstad',
        address: 'Kristianstadsgatan 46',
        zip: '29140',
        admin: true,
        balance: 250.90,
      };
      const updateUser = await userHandler.updateUser(updateUserInfo);
      const userFromDb = await db.findOneUser('users', updateUserInfo._id);
      expect(updateUser).toEqual(userFromDb);
    });
  });

  describe('removeUser', () => {
    it('remove user', async () => {
      await userHandler.removeUser(2);
      const userFromDb = await db.findOneUser('users', 2);
      expect(userFromDb).toEqual(null);
    });
  });
});
