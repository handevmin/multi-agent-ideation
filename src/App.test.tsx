import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

describe('App', () => {
  test('renders learn react link', () => {
    render(<App />);
    const linkElement = screen.getByText(/아이디어 생성 시스템/i);
    expect(linkElement).toBeInTheDocument();
  });
});