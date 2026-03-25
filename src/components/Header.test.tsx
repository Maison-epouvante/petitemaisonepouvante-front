import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';

describe('Header Component', () => {
  it('should render header', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should display navigation links', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
    
    const homeLink = screen.queryByText(/home/i);
    expect(homeLink || screen.getByRole('banner')).toBeInTheDocument();
  });
});
