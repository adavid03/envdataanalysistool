"use client";

/**
 * Calculates the Pearson correlation coefficient between two arrays of numbers
 */
const calculateCorrelation = (x: number[], y: number[]): number => {
  const n = x.length;
  if (n !== y.length || n === 0) return 0;

  // Calculate means
  const xMean = x.reduce((a, b) => a + b, 0) / n;
  const yMean = y.reduce((a, b) => a + b, 0) / n;

  // Calculate covariance and standard deviations
  let covariance = 0;
  let xStdDev = 0;
  let yStdDev = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    covariance += xDiff * yDiff;
    xStdDev += xDiff * xDiff;
    yStdDev += yDiff * yDiff;
  }

  xStdDev = Math.sqrt(xStdDev / n);
  yStdDev = Math.sqrt(yStdDev / n);

  // Prevent division by zero
  if (xStdDev === 0 || yStdDev === 0) return 0;

  return covariance / (n * xStdDev * yStdDev);
};

export { calculateCorrelation }; 