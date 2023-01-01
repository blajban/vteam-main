import React from 'react';
import renderer from 'react-test-renderer';
import locationHandler from '../models/locationHandler';

test('tests without city', async () => {
    const locations = await locationHandler.fetchLocations();
    expect(locations).toEqual("No city specified");
});

test('tests with city expect null', async () => {
    const locations = await locationHandler.fetchLocations("stockholm");
    expect(locations).toEqual(null);
});