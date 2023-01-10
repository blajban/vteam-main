import React from 'react';
import renderer from 'react-test-renderer';
import userHandler from '../../models/userHandler';

jest.mock('expo-constants', () => ({
  manifest: {
    hostUri: 'localhost:3000',
  },
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ ret: 'hello' }),
  }),
);

beforeEach(() => {
  fetch.mockClear();
});

it('tests getUser with valid input', async () => {
  const user = await userHandler.getUser('token', 'userId', 'loginId');
  expect(user).toEqual({ ret: 'hello' });
});

test('tests getUser without token expect No token specified', async () => {
  const user = await userHandler.getUser();
  expect(user).toEqual('No token specified');
});

test('tests getUser with without userId expect No userid specified', async () => {
  const user = await userHandler.getUser('token');
  expect(user).toEqual('No userid specified');
});

test('tests getUser with without loginId expect No loginId specified', async () => {
  const user = await userHandler.getUser('token', 'loginId');
  expect(user).toEqual('No loginId specified');
});

test('tests updateUser without token expect No token specified', async () => {
  const updaeteUser = await userHandler.updateUser();
  expect(updaeteUser).toEqual('No token specified');
});

test('tests updateUser with without userId expect No userid specified', async () => {
  const updaeteUser = await userHandler.updateUser('token');
  expect(updaeteUser).toEqual('No userid specified');
});

test('tests updateUser with without loginId expect No loginId specified', async () => {
  const updaeteUser = await userHandler.updateUser('token', 'loginId');
  expect(updaeteUser).toEqual('No loginId specified');
});
