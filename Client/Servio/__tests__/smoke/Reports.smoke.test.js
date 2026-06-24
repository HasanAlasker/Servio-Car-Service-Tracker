
import React from 'react';
import { render } from '@testing-library/react-native';
import Screen from '../../screens/admin/Reports';
import { useRoute } from "@react-navigation/native";

test('Reports renders', () => {
  const commonParams = { 
    shopId: 's1', 
    id: 'id1', 
    carId: 'c1', 
    openHours: Array.from({ length: 7 }, () => ({ isOpen: true, from: "09:00", to: "18:00" })) 
  };
  useRoute.mockReturnValue({ key: "test-route", name: "Reports", params: commonParams });
  const tree = render(<Screen navigation={{navigate: jest.fn(), setOptions: jest.fn(), goBack: jest.fn(), addListener: jest.fn(() => () => {})}} />).toJSON();
  expect(tree).toBeTruthy();
});
