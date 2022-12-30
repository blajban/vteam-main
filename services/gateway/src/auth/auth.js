
const { MongoWrapper } = require('../../../../shared/mongowrapper');
const mongoWrapper = new MongoWrapper('gateway');
const { scryptSync, randomBytes, timingSafeEqual } = require('crypto');

const collectionName = 'keys';


const newKey = () => {
  return randomBytes(32).toString('base64');
}

const newHash = (key) => {
  const salt = randomBytes(8).toString('hex');
  const buffer = scryptSync(key, salt, 64);
  return `${buffer.toString('hex')}.${salt}`;
}

const storeKey = async (keyHash) => {
  const mongo = await mongoWrapper;
  await mongo.insertOne(collectionName, { keyHash });
}

const compareKeys = (storedKey, suppliedKey) => {
  const [hashedKey, salt] = storedKey.split('.');
  const buffer = scryptSync(suppliedKey, salt, 64);
  return timingSafeEqual(Buffer.from(hashedKey, 'hex'), buffer);
}

const getAllStoredKeys = async () => {
  const mongo = await mongoWrapper;
  return await mongo.find(collectionName);
}

exports.generateKey = async () => {
  try {
    const key = newKey();
    const hash = newHash(key);
    storeKey(hash);
    return key;
  } catch (e) {
    console.log(e);
  }
}

exports.isValid = async (suppliedKey) => {
  try {
    const storedKeys = await getAllStoredKeys();
    for (const storedKey of storedKeys) {
      if (compareKeys(storedKey.keyHash, suppliedKey)) {
        return true;
      }
    }
  
    return false;
  } catch (e) {
    console.log(e);
  }
  
}
