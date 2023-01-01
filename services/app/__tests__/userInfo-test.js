import React from 'react';
import renderer from 'react-test-renderer';
import UserInfo from '../components/userInfo';

const tree = renderer.create(<UserInfo />).toJSON();



test('Userinfo Renders correctly', () => {
    expect(tree).toMatchSnapshot();
});