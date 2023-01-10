import React from 'react';
import renderer from 'react-test-renderer';
import UserInfo from '../../components/userInfo';

jest.mock('expo-constants', () => ({
  manifest: {
    hostUri: 'localhost:3000',
  },
}));
