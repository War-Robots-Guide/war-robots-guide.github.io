import robotGuideData from '../data/robot_guide.json';

const defaultColors = {
  "<= -2": "#ef4444", // Red
  "-1": "#f97316",    // Orange
  "0": "#eab308",     // Yellow
  "+1": "#84cc16",    // Lime/light green
  "+2": "#22c55e",    // Green
  ">= +3": "#3b82f6"  // Blue
};

// Use colors from json if available, otherwise use default colors
const colors = (robotGuideData && robotGuideData.rating_colors) || defaultColors;

export const getRatingColor = (val) => {
  if (val <= 10) {
    if (val <= 2) return colors["<= -2"];
    if (val <= 4) return colors["-1"];
    if (val <= 6) return colors["0"];
    if (val <= 7) return colors["+1"];
    if (val <= 8) return colors["+2"];
    return colors[">= +3"];
  } else {
    if (val <= 20) return colors["<= -2"];
    if (val <= 25) return colors["-1"];
    if (val <= 30) return colors["0"];
    if (val <= 34) return colors["+2"];
    return colors[">= +3"];
  }
};

export const getRatingColorsList = () => {
  return [
    colors["<= -2"],
    colors["-1"],
    colors["0"],
    colors["+1"],
    colors["+2"],
    colors[">= +3"]
  ];
};

export const getValueRatingTiers = () => {
  return [
    { label: 'Bad', color: colors["<= -2"], maxScore: 20 },
    { label: 'Poor', color: colors["-1"], maxScore: 25 },
    { label: 'Fair', color: colors["0"], maxScore: 30 },
    { label: 'Good', color: colors["+2"], maxScore: 34 },
    { label: 'Best', color: colors[">= +3"], maxScore: Infinity }
  ];
};

export const getRatingTierIndex = (val) => {
  if (val <= 20) return 0;
  if (val <= 25) return 1;
  if (val <= 30) return 2;
  if (val <= 34) return 3;
  return 4;
};

export const getValueRatingGradient = (minVal = 12, maxVal = 44) => {
  if (maxVal <= minVal) {
    return `linear-gradient(to right, ${colors["<= -2"]} 0%, ${colors[">= +3"]} 100%)`;
  }
  const getPct = (v) => {
    const clamped = Math.max(minVal, Math.min(maxVal, v));
    return Math.round(((clamped - minVal) / (maxVal - minVal)) * 10000) / 100;
  };

  const cRed = colors["<= -2"];
  const cOrange = colors["-1"];
  const cYellow = colors["0"];
  const cLime = colors["+1"];
  const cGreen = colors["+2"];
  const cBlue = colors[">= +3"];

  const p0 = 0;
  const pRed = getPct(20);
  const pOrange = getPct(23);
  const pYellow = getPct(28);
  const pLime = getPct(31.5);
  const pGreen = getPct(33.5);
  const pBlue = getPct(35);
  const p100 = 100;

  return `linear-gradient(to right, ${cRed} ${p0}%, ${cRed} ${pRed}%, ${cOrange} ${pOrange}%, ${cYellow} ${pYellow}%, ${cLime} ${pLime}%, ${cGreen} ${pGreen}%, ${cBlue} ${pBlue}%, ${cBlue} ${p100}%)`;
};

export const getValueRatingRange = () => {
  const robots = robotGuideData?.robots || [];
  const titans = robotGuideData?.titans || [];
  const ratings = [
    ...robots.map(r => r.value_rating),
    ...titans.map(t => t.value_rating)
  ].filter(val => typeof val === 'number' && !isNaN(val));
  
  if (ratings.length === 0) {
    return { min: 12, max: 44 };
  }
  return {
    min: Math.min(...ratings),
    max: Math.max(...ratings)
  };
};

export const getOverallScoreRange = () => {
  const robots = robotGuideData?.robots || [];
  const titans = robotGuideData?.titans || [];
  const scores = [
    ...robots.map(r => r.scores?.overall),
    ...titans.map(t => t.scores?.overall)
  ].filter(val => typeof val === 'number' && !isNaN(val));
  
  if (scores.length === 0) {
    return { min: 12, max: 44 };
  }
  return {
    min: Math.min(...scores),
    max: Math.max(...scores)
  };
};
