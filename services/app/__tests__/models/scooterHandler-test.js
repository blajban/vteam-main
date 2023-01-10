import scooterHandler from '../../models/scooterHandler';
import Constants from 'expo-constants';

jest.mock('expo-constants', () => ({
  manifest: {
    hostUri: 'localhost:3000',
  },
}));

test('fetchScooters tests without city', async () => {
  const locations = await scooterHandler.fetchScooters();
  expect(locations).toEqual('No city specified');
});

test('fetchScooters tests with city expect empty array of objects', async () => {
  const locations = await scooterHandler.fetchScooters('Stockholm');
  expect(locations).toEqual([{}]);
});

test('rentScooter without scooterId and userId', async () => {
  const locations = await scooterHandler.rentScooter();
  expect(locations).toEqual('No scooterId or UserId specified');
});

test('rentScooter with scooterId and userId expect null', async () => {
  const locations = await scooterHandler.rentScooter('1232', '12312');
  expect(locations).toEqual(null);
});

test('parkScooter without scooterId and userId', async () => {
  const locations = await scooterHandler.parkScooter();
  expect(locations).toEqual('No scooterId specified');
});

test('parkScooter with scooterId expect null', async () => {
  const locations = await scooterHandler.parkScooter('1232');
  expect(locations).toEqual(null);
});
