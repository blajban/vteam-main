const LocationHandler = require('./locationHandler');

const mongo = {
  find: jest.fn(() => {
    return { id: 'a', rate: 0.5 };
  }),
  insertOne: jest.fn(() => {
    return 'function called';
  }),
  updateOne: jest.fn(() => {
    return 'function called';
  }),
  deleteOne: jest.fn(() => {
    return 'function called';
  }),
};

describe('locationHandler', () => {
  let locationHandler;
  let e;
  let ed;
  beforeEach(async () => {
    e = { location: 'stockholm', object: { name: 'a' } };
    ed = { location: 'stockholm', object: { _id: 'a', name: 'a' } };
    locationHandler = await new LocationHandler();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('tests getLocations', async () => {
    expect(await locationHandler.getLocations(mongo, e)).toEqual({ id: 'a', rate: 0.5 });
    expect(mongo.find).toHaveBeenCalledWith('stockholm');
  });

  it('tests adjustLocation', async () => {
    expect(await locationHandler.adjustLocation(mongo, ed)).toEqual('function called');
    expect(mongo.updateOne).toHaveBeenCalledWith('stockholm', { _id: 'a' }, { name: 'a' });
  });
  it('tests adjustLocation without _id', async () => {
    await expect(locationHandler.adjustLocation(mongo, { name: 'karl' })).rejects.toEqual(Error("Cannot read properties of undefined (reading '_id')"));
  });

  it('tests insertLocation', async () => {
    expect(await locationHandler.insertLocation(mongo, e)).toEqual('function called');
    expect(mongo.insertOne).toHaveBeenCalledWith('stockholm', { name: 'a' });
  });

  it('tests deleteLocation', async () => {
    expect(await locationHandler.deleteLocation(mongo, ed)).toEqual('function called');
    expect(mongo.deleteOne).toHaveBeenCalledWith('stockholm', { _id: 'a', name: 'a' });
  });
});
