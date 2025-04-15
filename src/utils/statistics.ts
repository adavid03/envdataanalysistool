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

/**
 * Calculates the two-tailed p-value for Pearson's r
 * Uses the t-distribution: t = r * sqrt((n-2)/(1-r^2)), df = n-2
 * Returns NaN if n < 3 or r is not finite
 */
function calculatePearsonPValue(r: number, n: number): number {
  if (!isFinite(r) || n < 3) return NaN;
  if (Math.abs(r) === 1) return 0;
  if (r === 0) return 1;
  const t = Math.abs(r) * Math.sqrt((n - 2) / (1 - r * r));
  const df = n - 2;
  // Use the regularized incomplete beta function for the t-distribution CDF
  // Two-tailed p-value
  const x = df / (df + t * t);
  const a = df / 2;
  const b = 0.5;
  const ibeta = regularizedIncompleteBeta(x, a, b);
  const p = 2 * Math.min(ibeta, 1 - ibeta); // two-tailed
  return Math.max(0, Math.min(1, p));
}

// Regularized incomplete beta function using continued fraction (Lentz's method)
function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) return NaN;
  // Special cases
  if (x === 0) return 0;
  if (x === 1) return 1;
  // Compute ln(Beta(a, b))
  const lnBeta = logGamma(a) + logGamma(b) - logGamma(a + b);
  // Continued fraction for incomplete beta
  const maxIter = 200;
  const eps = 3e-7;
  let am = 1, bm = 1, az = 1;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let bz = 1 - qab * x / qap;
  if (Math.abs(bz) < 1e-30) bz = 1e-30;
  let em, tem, d, ap, bp, app, bpp, aold;
  for (let m = 1; m <= maxIter; m++) {
    em = m;
    tem = em + em;
    d = em * (b - em) * x / ((qam + tem) * (a + tem));
    ap = az + d * am;
    bp = bz + d * bm;
    d = -(a + em) * (qab + em) * x / ((a + tem) * (qap + tem));
    app = ap + d * az;
    bpp = bp + d * bz;
    aold = az;
    am = ap / bpp;
    bm = bp / bpp;
    az = app / bpp;
    bz = 1;
    if (Math.abs(az - aold) < eps * Math.abs(az)) break;
  }
  const front = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - lnBeta) / a;
  return front * az;
}

// Lanczos approximation for log-gamma
function logGamma(z: number): number {
  const g = 7;
  const p = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028,
    771.32342877765313, -176.61502916214059, 12.507343278686905,
    -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
  ];
  if (z < 0.5) {
    return Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z);
  } else {
    z -= 1;
    let x = p[0];
    for (let i = 1; i < g + 2; i++) {
      x += p[i] / (z + i);
    }
    const t = z + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x) - Math.log(z + 1);
  }
}

export { calculateCorrelation };
export { calculatePearsonPValue }; 