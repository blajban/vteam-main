import React from 'react';
import renderer from 'react-test-renderer';
import locationHandler from '../../models/locationHandler';

jest.mock('expo-constants', () => ({
  manifest: {
    hostUri: 'localhost:3000',
  },
}));

test('tests without city', async () => {
  const locations = await locationHandler.fetchLocations();
  expect(locations).toEqual('No city specified');
});

test('tests without token', async () => {
  const locations = await locationHandler.fetchLocations('stockholm');
  expect(locations).toEqual('No token specified');
});

test('tests with city expect null', async () => {
  const locations = await locationHandler.fetchLocations('stockholm', 'token');
  expect(locations).toEqual([{}]);
});
