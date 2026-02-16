import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the DealSniper header', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /dealsniper/i })).toBeInTheDocument();
});
