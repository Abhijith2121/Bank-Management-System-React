
import React from 'react';
import { render, screen } from '@testing-library/react';
import Heading from '../components/Heading';
import '@testing-library/jest-dom'

test('renders heading component with text', () => {
  const headingText = 'Test Heading';
  render(<Heading text={headingText} />);
  const headingElement = screen.getByRole('heading', { name: headingText });
  expect(headingElement).toBeInTheDocument();
});
