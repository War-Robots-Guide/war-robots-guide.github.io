import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { RatingBar } from './RatingBar';

describe('RatingBar Component', () => {
  describe('default unitType (robot)', () => {
    it('renders correctly with a standard positive rating (Fair)', () => {
      render(<RatingBar rating={28} />);

      expect(screen.getByText('Fair (28)')).toBeInTheDocument();
      const segments = screen.getAllByTestId(/rating-segment-/);
      expect(segments).toHaveLength(5);
      // Fair is index 2, so segments 0, 1, 2 should be active
      expect(segments[0]).not.toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
      expect(segments[1]).not.toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
      expect(segments[2]).not.toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
      expect(segments[3]).toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
      expect(segments[4]).toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
    });

    it('renders correctly with a low rating (Bad)', () => {
      render(<RatingBar rating={7} />);

      expect(screen.getByText('Bad (7)')).toBeInTheDocument();
      const segments = screen.getAllByTestId(/rating-segment-/);
      expect(segments[0]).not.toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
      expect(segments[1]).toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
    });

    it('renders correctly with maximum rating (Best)', () => {
      render(<RatingBar rating={44} />);

      expect(screen.getByText('Best (44)')).toBeInTheDocument();
      const segments = screen.getAllByTestId(/rating-segment-/);
      segments.forEach(segment => {
        expect(segment).not.toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
      });
    });

    it('renders correctly with a negative rating', () => {
      render(<RatingBar rating={-5} />);

      expect(screen.getByText('Bad (-5)')).toBeInTheDocument();
      const segments = screen.getAllByTestId(/rating-segment-/);
      expect(segments[0]).not.toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
      expect(segments[1]).toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
    });

    it('renders rating 36 with Best label and all 5 segments filled', () => {
      render(<RatingBar rating={36} />);

      expect(screen.getByText('Best (36)')).toBeInTheDocument();
      const segments = screen.getAllByTestId(/rating-segment-/);
      expect(segments).toHaveLength(5);
      segments.forEach(segment => {
        expect(segment).not.toHaveStyle({ backgroundColor: 'rgba(255, 255, 255, 0.08)' });
      });
    });
  });

  describe('unitType "titan"', () => {
    it('renders correctly with a standard positive rating', () => {
      render(<RatingBar rating={28} unitType="titan" />);

      expect(screen.getByText('Fair (28)')).toBeInTheDocument();
      const segments = screen.getAllByTestId(/rating-segment-/);
      expect(segments).toHaveLength(5);
    });

    it('renders upper bound rating', () => {
      render(<RatingBar rating={44} unitType="titan" />);

      expect(screen.getByText('Best (44)')).toBeInTheDocument();
    });
  });

  describe('alignment', () => {
    it('applies default left alignment', () => {
      const { container } = render(<RatingBar rating={0} />);

      const rootDiv = container.firstChild;
      expect(rootDiv).toHaveStyle({ marginLeft: '0' });
    });

    it('applies right alignment when specified', () => {
      const { container } = render(<RatingBar rating={0} align="right" />);

      const rootDiv = container.firstChild;
      expect(rootDiv).toHaveStyle({ marginLeft: 'auto' });
    });
  });
});
