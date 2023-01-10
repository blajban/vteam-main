import React from 'react';
import renderer from 'react-test-renderer';
import locationHandler from '../../models/locationHandler';

jest.mock('expo-constants', () => ({
  manifest: {
    hostUri: 'localhost:3000',
  },
}));

test('tests locationHandler without city', async () => {
  const locations = await locationHandler.fetchLocations();
  expect(locations).toEqual('No city specified');
});

test('tests locationHandler without token', async () => {
  const locations = await locationHandler.fetchLocations('stockholm');
  expect(locations).toEqual('No token specified');
});

test('tests locationHandler with city expect null', async () => {
  const locations = await locationHandler.fetchLocations('stockholm', 'token');
  expect(locations).toEqual([{}]);
});

test('tests locationHandler rate without token', async () => {
  const locations = await locationHandler.fetchRates();
  expect(locations).toEqual('No token specified');
});

test('tests locationHandler rate with token', async () => {
  const locations = await locationHandler.fetchRates('token');
  expect(locations).toEqual([{}]);
});
