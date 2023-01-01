import React from 'react';
import renderer from 'react-test-renderer';
import EndRideModal from '../components/modals/endRideModal';
import QrModalPopup from '../components/modals/qrCodeModal';
import ModalPopup from '../components/modals/userModal';


test('endRideModal Renders correctly', () => {
    const endRideTree = renderer.create(<EndRideModal />).toJSON();
    expect(endRideTree).toMatchSnapshot();
});

test('qrModal Renders correctly', () => {
    const qrModal = renderer.create(<QrModalPopup />).toJSON();
    expect(qrModal).toMatchSnapshot();
});

test('modalPopup Renders correctly', () => {
    const modalPopup = renderer.create(<ModalPopup />).toJSON();
    expect(modalPopup).toMatchSnapshot();
});