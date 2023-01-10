import React from 'react';
import renderer from 'react-test-renderer';
import LoginPage from '../../components/loginPage';

jest.mock('expo-constants', () => ({
  manifest: {
    hostUri: 'localhost:3000',
  },
}));

test('LoginPage Renders correctly', () => {
  const loginPage = renderer.create(<LoginPage />).toJSON();
  expect(loginPage).toMatchSnapshot();
});
