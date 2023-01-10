import React from 'react';
import renderer from 'react-test-renderer';
import authHandler from '../../models/authHandler';
const API_KEY = require('../../api-key.json');
const clientId = process.env.GITHUB_CLIENT_ID;

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

it('tests getGitHubUser with valid input', async () => {
  await authHandler.getGitHubUser('token');
  expect(fetch).toHaveBeenCalledWith('http://localhost:3500/v1/getGitHubUser', {
    headers:
  {
    'x-access-token': 'token',
    'x-api-key': API_KEY.key }
  },
  ),
});

it('tests req with valid input', async () => {
  await authHandler.req('token');
  expect(fetch).toHaveBeenCalledWith('https://github.com/login/device/code', {
    body: '{}',
    headers:
     { Accept: 'application/json',
       'Content-Type': 'application/json',
     },
    method: 'post',
  });
});

it('tests checkForAuth with valid input', async () => {
  await authHandler.checkForAuth({device_code: 'dsadw'});
  expect(fetch).toHaveBeenCalledWith('https://github.com/login/oauth/access_token', {
    body: JSON.stringify({
      client_id: clientId,
      device_code: 'dsadw',
      grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
    }),
    headers:
     { Accept: 'application/json',
       'Content-Type': 'application/json',
     },
    method: 'post',
  });
});
