import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { AdazahiEasterEgg } from './AdazahiEasterEgg';

describe('AdazahiEasterEgg', () => {
  it('renders the easter egg widget image', () => {
    render(<AdazahiEasterEgg />);
    const eggWidget = screen.getByTestId('adazahi-easter-egg');
    expect(eggWidget).toBeInTheDocument();
    const img = screen.getByAltText('Adazahi Easter Egg');
    expect(img).toHaveAttribute('src', '/backgrounds/easteregg-adazahi.webp');
  });

  it('spawns a floating heart when clicked', async () => {
    const user = userEvent.setup();
    render(<AdazahiEasterEgg />);
    const eggWidget = screen.getByTestId('adazahi-easter-egg');

    expect(screen.queryByText('❤️')).not.toBeInTheDocument();

    await user.click(eggWidget);

    expect(screen.getByText('❤️')).toBeInTheDocument();
  });
});
