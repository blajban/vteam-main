const RatesHandler = require('./ratesHandler');

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
  let e;
  let ed;
  let ratesHandler;
  beforeEach(async () => {
    e = { name: 'a' };
    ed = { _id: 'a', object:{name: 'a'}} ;
    ratesHandler = await new RatesHandler();
  });

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
  it('tests adjustRate without _id', async () => {
    await expect(ratesHandler.adjustRate(mongo, {name: "karl"})).rejects.toEqual(Error("No _id provided"));
  });

  it('tests insertRate', async () => {
    expect(await ratesHandler.insertRate(mongo, e)).toEqual("function called");
    expect(mongo.insertOne).toHaveBeenCalledWith("rates", { name: 'a' });
  });

  it('tests deleteRate', async () => {
    expect(await ratesHandler.deleteRate(mongo, ed)).toEqual("function called");
    expect(mongo.deleteOne).toHaveBeenCalledWith("rates", { _id: 'a' });
  });
  it('tests delete without _id', async () => {
    await expect(ratesHandler.deleteRate(mongo, {name: "karl"})).rejects.toEqual(Error("No _id provided"));
  });
});