"use client";

/**
 * Calculates the Pearson correlation coefficient between two arrays of numbers
 * Uses sample standard deviation (n-1) for unbiased estimation
 */
const calculateCorrelation = (x: number[], y: number[]): number => {
  // Filter out non-finite values and ensure pairs are valid
  const clean = x.map((v, i) => [v, y[i]])
    .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
  
  if (clean.length === 0) return 0;
  
  const n = clean.length;
  const xClean = clean.map(([a]) => a);
  const yClean = clean.map(([, b]) => b);

  // Calculate means
  const xMean = xClean.reduce((a, b) => a + b, 0) / n;
  const yMean = yClean.reduce((a, b) => a + b, 0) / n;

  // Calculate covariance and standard deviations
  let covariance = 0;
  let xStdDev = 0;
  let yStdDev = 0;

  for (let i = 0; i < n; i++) {
    const xDiff = xClean[i] - xMean;
    const yDiff = yClean[i] - yMean;
    covariance += xDiff * yDiff;
    xStdDev += xDiff * xDiff;
    yStdDev += yDiff * yDiff;
  }

  // Use sample standard deviation (n-1)
  xStdDev = Math.sqrt(xStdDev / (n - 1));
  yStdDev = Math.sqrt(yStdDev / (n - 1));

  // Prevent division by zero
  if (xStdDev === 0 || yStdDev === 0) return 0;

  // Use sample covariance (n-1)
  return (covariance / (n - 1)) / (xStdDev * yStdDev);
};

export { calculateCorrelation }; 