const ratesHandler = require('./ratesHandler');

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
  const e = { name: 'a' };
  const ed = { _id: 'a', name: 'a'} ;

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('tests getRate', async () => {
    expect(await ratesHandler.getRates(mongo)).toEqual({ id: 'a', rate: 0.5 });
    expect(mongo.find).toHaveBeenCalledWith("rates");
  });

  it('tests adjustRate', async () => {
    expect(await ratesHandler.adjustRate(mongo, ed)).toEqual("function called");
    expect(mongo.updateOne).toHaveBeenCalledWith("rates",{_id: "a"} ,{ name: 'a'});
  });

  it('tests insertRate', async () => {
    expect(await ratesHandler.insertRate(mongo, e)).toEqual("function called");
    expect(mongo.insertOne).toHaveBeenCalledWith("rates", { name: 'a' });
  });

  it('tests deleteRate', async () => {
    expect(await ratesHandler.deleteRate(mongo, e)).toEqual("function called");
    expect(mongo.deleteOne).toHaveBeenCalledWith("rates", { name: 'a' });
  });
});