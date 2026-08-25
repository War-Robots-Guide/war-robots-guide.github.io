import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SupportBanner } from './SupportBanner';

describe('SupportBanner Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the support banner with text and clickable code link', () => {
    render(<SupportBanner />);

    expect(screen.getByTestId('support-banner')).toBeInTheDocument();
    expect(screen.getByText(/To help keep the site ad-free, consider supporting us by using code/i)).toBeInTheDocument();
    
    const link = screen.getByRole('link', { name: 'Adazahi' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://wr.my.games/Adazahi');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    expect(screen.getByText(/on your next webstore purchase!/i)).toBeInTheDocument();
  });

  it('dismisses the banner when the close button is clicked and stores preference in localStorage', async () => {
    const user = userEvent.setup();
    render(<SupportBanner />);

    const closeBtn = screen.getByRole('button', { name: /dismiss banner/i });
    await user.click(closeBtn);

    expect(screen.queryByTestId('support-banner')).not.toBeInTheDocument();
    expect(localStorage.getItem('wrg_hide_support_banner')).toBe('true');
  });

  it('does not render if previously dismissed in localStorage', () => {
    localStorage.setItem('wrg_hide_support_banner', 'true');
    render(<SupportBanner />);

    expect(screen.queryByTestId('support-banner')).not.toBeInTheDocument();
  });

  it('handles localStorage throwing an error gracefully', async () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Access denied');
    });
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Access denied');
    });

    const user = userEvent.setup();
    render(<SupportBanner />);

    expect(screen.getByTestId('support-banner')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: /dismiss banner/i });
    await user.click(closeBtn);

    expect(screen.queryByTestId('support-banner')).not.toBeInTheDocument();

    getItemSpy.mockRestore();
    setItemSpy.mockRestore();
  });
});
