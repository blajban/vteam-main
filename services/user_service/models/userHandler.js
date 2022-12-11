const { MongoWrapper } = require('../../../shared/mongowrapper');

class UserHandler {
    constructor() {
        return this.#init();
    }

    async #init() {
        this.db = await new MongoWrapper("usersb");
        return this;
    }

    async testUser() {
        const newUser = {
            "userId": 1,
            "name": "Selma Helin",
            "mobile": "0705556747",
            "mail": "selma.helin@hallaryd.se",
            "city": "Hällaryd",
            "address": "Hällarydsvägen 14",
            "zip": "37470",
            "admin": false,
            "balance": 0
        }
        const addUser = await this.db.insertOne("usersb", newUser);
        console.log("Har lagt till en användare");
        const findUser = await this.db.find("usersb");
        console.log(findUser);
    }
}

const testFunc = async () => {
    const sh = await new UserHandler();
    await sh.testUser();
}
testFunc();

// module.exports = { UserHandler };
