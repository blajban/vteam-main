const { ScooterManager} = require('./scooter_service');

// dummy tests
test('returns correct scooter data for scooter with scooterId', () => {
  const scooterManager = new ScooterManager();
  const data = scooterManager.unlockScooter(5);
  expect(data.scooterId).toBe(5);
});

test('returns true on scooter update', () => {
  const scooterManager = new ScooterManager();
  const value = scooterManager.updateScooter({});
  expect(value).toBe(true);
});
