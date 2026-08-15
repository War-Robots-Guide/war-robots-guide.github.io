import { describe, it, expect, vi } from 'vitest';

vi.mock('../data/robot_guide.json', () => ({
  default: {
    rating_colors: {
      "<= -2": "#mock_red",
      "-1": "#mock_orange",
      "0": "#mock_yellow",
      "+1": "#mock_lime",
      "+2": "#mock_green",
      ">= +3": "#mock_blue"
    },
    robots: [
      { name: 'Robot A', value_rating: 15, scores: { overall: 18 } },
      { name: 'Robot B', value_rating: 40, scores: { overall: 42 } }
    ],
    titans: [
      { name: 'Titan A', value_rating: 20, scores: { overall: 22 } },
      { name: 'Titan B', value_rating: 45, scores: { overall: 48 } }
    ]
  }
}));

import { getRatingColor, getRatingColorsList, getValueRatingTiers, getRatingTierIndex, getValueRatingGradient, getValueRatingRange, getOverallScoreRange } from './ratingColors';

describe('ratingColors utility', () => {
  describe('getRatingColor', () => {
    describe('attribute ratings (<= 10)', () => {
      it('returns correct colors based on range thresholds', () => {
        expect(getRatingColor(1)).toBe('#mock_red');
        expect(getRatingColor(2)).toBe('#mock_red');
        expect(getRatingColor(3)).toBe('#mock_orange');
        expect(getRatingColor(4)).toBe('#mock_orange');
        expect(getRatingColor(5)).toBe('#mock_yellow');
        expect(getRatingColor(6)).toBe('#mock_yellow');
        expect(getRatingColor(7)).toBe('#mock_lime');
        expect(getRatingColor(8)).toBe('#mock_green');
        expect(getRatingColor(9)).toBe('#mock_blue');
        expect(getRatingColor(10)).toBe('#mock_blue');
      });
    });

    describe('overall ratings (> 10)', () => {
      it('returns correct colors based on range thresholds', () => {
        expect(getRatingColor(12)).toBe('#mock_red');
        expect(getRatingColor(15)).toBe('#mock_red');
        expect(getRatingColor(16)).toBe('#mock_red');
        expect(getRatingColor(20)).toBe('#mock_red');
        expect(getRatingColor(21)).toBe('#mock_orange');
        expect(getRatingColor(25)).toBe('#mock_orange');
        expect(getRatingColor(26)).toBe('#mock_yellow');
        expect(getRatingColor(30)).toBe('#mock_yellow');
        expect(getRatingColor(31)).toBe('#mock_green');
        expect(getRatingColor(34)).toBe('#mock_green');
        expect(getRatingColor(35)).toBe('#mock_blue');
        expect(getRatingColor(36)).toBe('#mock_blue');
        expect(getRatingColor(44)).toBe('#mock_blue');
      });
    });
  });

  describe('getRatingColorsList', () => {
    it('returns the list of colors in the expected order', () => {
      const expectedList = [
        '#mock_red',
        '#mock_orange',
        '#mock_yellow',
        '#mock_lime',
        '#mock_green',
        '#mock_blue'
      ];
      expect(getRatingColorsList()).toEqual(expectedList);
    });
  });

  describe('getValueRatingTiers', () => {
    it('returns 5 tiers with expected labels and colors', () => {
      const tiers = getValueRatingTiers();
      expect(tiers).toHaveLength(5);
      expect(tiers.map(t => t.label)).toEqual(['Bad', 'Poor', 'Fair', 'Good', 'Best']);
      expect(tiers[0].color).toBe('#mock_red');
      expect(tiers[4].color).toBe('#mock_blue');
    });
  });

  describe('getRatingTierIndex', () => {
    it('maps ratings to correct tier indices (0 to 4)', () => {
      expect(getRatingTierIndex(15)).toBe(0);
      expect(getRatingTierIndex(20)).toBe(0);
      expect(getRatingTierIndex(21)).toBe(1);
      expect(getRatingTierIndex(25)).toBe(1);
      expect(getRatingTierIndex(26)).toBe(2);
      expect(getRatingTierIndex(30)).toBe(2);
      expect(getRatingTierIndex(31)).toBe(3);
      expect(getRatingTierIndex(34)).toBe(3);
      expect(getRatingTierIndex(35)).toBe(4);
      expect(getRatingTierIndex(36)).toBe(4);
      expect(getRatingTierIndex(44)).toBe(4);
    });
  });

  describe('getValueRatingGradient', () => {
    it('generates gradient matching rating thresholds for min=12 and max=44', () => {
      const gradient = getValueRatingGradient(12, 44);
      expect(gradient).toBe(
        'linear-gradient(to right, #mock_red 0%, #mock_red 25%, #mock_orange 34.38%, #mock_yellow 50%, #mock_lime 60.94%, #mock_green 67.19%, #mock_blue 71.88%, #mock_blue 100%)'
      );
    });

    it('handles edge case when max <= min', () => {
      const gradient = getValueRatingGradient(20, 20);
      expect(gradient).toBe('linear-gradient(to right, #mock_red 0%, #mock_blue 100%)');
    });
  });

  describe('getValueRatingRange', () => {
    it('calculates the dynamic min and max from values', () => {
      expect(getValueRatingRange()).toEqual({ min: 15, max: 45 });
    });
  });

  describe('getOverallScoreRange', () => {
    it('calculates the dynamic min and max from scores', () => {
      expect(getOverallScoreRange()).toEqual({ min: 18, max: 48 });
    });
  });
});
