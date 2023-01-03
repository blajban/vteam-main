const LocationHandler = require('../models/locationHandler');

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

  it('tests getLocations without specified location', async () => {
    expect(await locationHandler.getLocations(mongo)).toEqual(TypeError("Cannot read properties of undefined (reading 'location')"));
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

  it('tests insertLocation without object and location', async () => {
    expect(await locationHandler.insertLocation(mongo)).toEqual(TypeError("Cannot read properties of undefined (reading 'location')"));
  });

  it('tests deleteLocation', async () => {
    expect(await locationHandler.deleteLocation(mongo, ed)).toEqual('function called');
    expect(mongo.deleteOne).toHaveBeenCalledWith('stockholm', { _id: 'a', name: 'a' });
  });
  it('tests deleteLocation without object', async () => {
    expect(await locationHandler.deleteLocation(mongo)).toEqual(TypeError("Cannot read properties of undefined (reading 'location')"));
  });
});
