import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login text', () => {
  render(<App />);
  const linkElement = screen.getByText("Login");
  expect(linkElement).toBeInTheDocument();
});
