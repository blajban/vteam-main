const locationHandler = require('./locationHandler');

const mongo = {
  find: jest.fn(() => {
    return { id: 'a', rate: 0.5 };
  }),
  insertOne: jest.fn(() => {
    return "function called";
  }),
  updateOne: jest.fn(() => {
    return "function called";
  }),
  deleteOne: jest.fn(() => {
    return "function called";
  })
};

describe('ratesHandler', () => {
  const e = {location:"stockholm", name: 'a' };
  const ed = {location:"stockholm", object:{ _id: 'a', name: 'a'}} ;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('tests getLocations', async () => {
    expect(await locationHandler.getLocations(mongo, e)).toEqual({ id: 'a', rate: 0.5 });
    expect(mongo.find).toHaveBeenCalledWith("stockholm");
  });

  it('tests adjustLocation', async () => {
    expect(await locationHandler.adjustLocation(mongo, ed)).toEqual("function called");
    expect(mongo.updateOne).toHaveBeenCalledWith("stockholm", {"_id": "a"}, {"name": "a"});
  });

  it('tests insertLocation', async () => {
    expect(await locationHandler.insertLocation(mongo, ed)).toEqual("function called");
    expect(mongo.insertOne).toHaveBeenCalledWith("stockholm", { _id: 'a', name: 'a'});
  });

  it('tests deleteLocation', async () => {
    expect(await locationHandler.deleteLocation(mongo, ed)).toEqual("function called");
    expect(mongo.deleteOne).toHaveBeenCalledWith("stockholm", { _id: 'a', name: 'a'});
  });
});