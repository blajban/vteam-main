const ratesHandler = require('./ratesHandler');

jest.mock('../../../shared/location_service/rates', () => (
  [{
      "a": 200,
      "b": 300,
      "c": 400,
      "d": 650
  }]), { virtual: true });



describe('ratesHandler', () => {

  afterEach(() => {
    jest.restoreAllMocks();
  });

    it('tests getRate with a', () => {
      expect(ratesHandler.getRates("a")).toEqual(expect.any(Number));
    });
    it('tests getRate with b', () => {
      expect(ratesHandler.getRates("b")).toEqual(expect.any(Number));
    });
    it('tests getRate with c', () => {
      expect(ratesHandler.getRates("c")).toEqual(expect.any(Number));
    });
    it('tests getRate with d', () => {
      expect(ratesHandler.getRates("d")).toEqual(expect.any(Number));
    });
    it('tests getRate without input', () => {
      expect(ratesHandler.getRates()).toEqual(expect.any(Object));
    });
});