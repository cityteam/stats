import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CityTeam Stats branding', () => {
  render(<App />);
  const linkElement = screen.getByText("CityTeam Stats");
  expect(linkElement).toBeInTheDocument();
});
