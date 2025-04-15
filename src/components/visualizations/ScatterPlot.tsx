'use client';

import { useMemo, useState } from 'react';
import { ProcessedData } from '@/utils/dataProcessing';
import { getDataByVariable } from '@/utils/dataAccess';
import { useTheme } from 'next-themes';
import { calculateCorrelation, calculatePearsonPValue } from '@/utils/statistics';
import {
    ScatterChart,
    Scatter,
    XAxis,
    YAxis,
    ZAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
    Brush
} from 'recharts';

interface ScatterPlotProps {
    data: ProcessedData;
    xVariable: string;
    yVariable: string;
    height?: number;
    showCorrelationLine?: boolean;
    xUnit?: string;
    yUnit?: string;
    removeOutliers?: boolean;
    iqrMultiplier?: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: {
        payload: {
            x: number;
            y: number;
            index: number;
        };
    }[];
    label?: string;
    data: ProcessedData;
}

// Units mapping for common variables
const VARIABLE_UNITS: Record<string, string> = {
    'Avg Temperature': '°C',
    'temperature': '°C',
    'Departure': '°C',
    'pH': '',
    'ph': '',
    'Elevation': 'm',
    'elevation': 'm',
    'General hardness (calcium carbonate)': 'mg/L',
    'hardness': 'mg/L',
    'Total alkalinity ': 'mg/L',
    'alkalinity': 'mg/L',
    'Carbonate ': 'mg/L',
    'carbonate': 'mg/L',
    'Phosphate': 'mg/L',
    'phosphate': 'mg/L',
    'Nitrate  ': 'mg/L',
    'nitrate': 'mg/L',
    'Nitrite ': 'mg/L',
    'nitrite': 'mg/L',
    'Free chlorine': 'mg/L',
    'chlorine': 'mg/L',
    'Longitude': '°',
    'longitude': '°',
    'Latitude': '°',
    'latitude': '°',
    // Add more as needed
};

const CustomTooltip = ({ active, payload, data }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const index = payload[0].payload.index;
        
        // Get all available variables
        const envVars = Object.keys(data.environmentalFactors);
        const divVars = Object.keys(data.diversityIndices);

        return (
            <div className="bg-white dark:bg-gray-800 p-2 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-[300px] overflow-y-auto">
                <p className="font-bold text-sm mb-1">Sample: {data.metadata.sampleCodes[index]}</p>
                <div className="space-y-1 text-xs">
                    <div className="grid grid-cols-2 gap-x-4">
                        <div>
                            <p className="font-semibold text-xs">Environmental:</p>
                            {envVars.map(varName => {
                                const value = getDataByVariable(data, varName)[index];
                                const formattedValue = typeof value === 'number' ? value.toFixed(3) : value;
                                return (
                                    <p key={varName} className="truncate">
                                        {varName}: {formattedValue}
                                    </p>
                                );
                            })}
                        </div>
                        <div>
                            <p className="font-semibold text-xs">Diversity:</p>
                            {divVars.map(varName => {
                                const value = getDataByVariable(data, varName)[index];
                                const formattedValue = typeof value === 'number' ? value.toFixed(3) : value;
                                return (
                                    <p key={varName} className="truncate">
                                        {varName}: {formattedValue}
                                    </p>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    return null;
};

// Helper: Excel serial date to YYYY-MM-DD
function excelSerialToDate(serial: number): string {
    if (typeof serial !== 'number' || !isFinite(serial)) return '';
    // Excel's day 1 is 1900-01-01, but JS Date starts at 1970-01-01
    // Excel incorrectly treats 1900 as a leap year, so add -1 for serial >= 60
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400; // seconds
    const date_info = new Date(utc_value * 1000);
    return date_info.toISOString().slice(0, 10);
}

// Helper: detect if a variable is a date (by name or by value)
function isDateVariable(variable: string, data: number[]): boolean {
    // Heuristic: variable name contains 'date' or all values are in Excel serial date range
    if (variable.toLowerCase().includes('date')) return true;
    // Excel serial dates for 2000-01-01 to 2100-01-01: 36526 to 73050
    return data.every(v => typeof v === 'number' && v > 30000 && v < 80000);
}

// Helper: IQR outlier detection
function getOutlierIndices(arr: number[], multiplier: number): Set<number> {
    const sorted = arr.filter(Number.isFinite).sort((a, b) => a - b);
    if (sorted.length < 4) return new Set();
    const q1 = sorted[Math.floor(sorted.length * 0.25)];
    const q3 = sorted[Math.floor(sorted.length * 0.75)];
    const iqr = q3 - q1;
    const lower = q1 - multiplier * iqr;
    const upper = q3 + multiplier * iqr;
    const outlierIndices = new Set<number>();
    arr.forEach((v, i) => {
        if (!Number.isFinite(v)) return;
        if (v < lower || v > upper) outlierIndices.add(i);
    });
    return outlierIndices;
}

// Export correlation value for use outside the chart
export const ScatterPlotChart: React.FC<ScatterPlotProps & { onCorrelation?: (value: number | null) => void }> = (props) => {
    const { data, xVariable, yVariable, height = 500, showCorrelationLine = false, xUnit, yUnit, removeOutliers = true, iqrMultiplier = 2.5, onCorrelation } = props;
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    // Prepare the data for the scatter plot
    const plotData = useMemo(() => {
        const xData = getDataByVariable(data, xVariable);
        const yData = getDataByVariable(data, yVariable);
        let points = xData.map((x, index) => ({ x, y: yData[index], index }));
        // If xVariable is 'Date', sort by x (the date serial)
        if (xVariable === 'Date') {
            points = points.slice().sort((a, b) => Number(a.x) - Number(b.x));
        }
        return points;
    }, [data, xVariable, yVariable]);

    // Outlier detection (IQR method)
    const xOutliers = useMemo(() => getOutlierIndices(plotData.map(p => p.x), iqrMultiplier), [plotData, iqrMultiplier]);
    const yOutliers = useMemo(() => getOutlierIndices(plotData.map(p => p.y), iqrMultiplier), [plotData, iqrMultiplier]);
    const allOutlierIndices = useMemo(() => {
        const set = new Set<number>();
        xOutliers.forEach(i => set.add(i));
        yOutliers.forEach(i => set.add(i));
        return set;
    }, [xOutliers, yOutliers]);
    const filteredPlotData = useMemo(() => {
        if (!removeOutliers) return plotData;
        return plotData.filter((_, i) => !allOutlierIndices.has(i));
    }, [plotData, allOutlierIndices, removeOutliers]);

    // For date formatting
    const xDataRaw = useMemo(() => getDataByVariable(data, xVariable), [data, xVariable]);
    const yDataRaw = useMemo(() => getDataByVariable(data, yVariable), [data, yVariable]);
    const xIsDate = useMemo(() => isDateVariable(xVariable, xDataRaw), [xVariable, xDataRaw]);
    const yIsDate = useMemo(() => isDateVariable(yVariable, yDataRaw), [yVariable, yDataRaw]);

    // Defensive: check for all-NaN or missing data (use filtered data)
    const allXInvalid = !filteredPlotData.some(p => typeof p.x === 'number' && isFinite(p.x));
    const allYInvalid = !filteredPlotData.some(p => typeof p.y === 'number' && isFinite(p.y));
    if (allXInvalid || allYInvalid) {
        return (
            <div className="flex items-center justify-center h-full min-h-[200px] text-red-600 dark:text-red-400 text-center">
                No valid data to plot for the selected variables.
            </div>
        );
    }

    // Calculate initial domains with padding
    const { xDomain, yDomain } = useMemo(() => {
        const xData = filteredPlotData.map(p => p.x);
        const yData = filteredPlotData.map(p => p.y);
        const cleanX = xData.filter(Number.isFinite);
        const cleanY = yData.filter(Number.isFinite);
        if (cleanX.length === 0 || cleanY.length === 0) {
            return {
                xDomain: [0, 1],
                yDomain: [0, 1]
            };
        }
        const minX = Math.min(...cleanX);
        const maxX = Math.max(...cleanX);
        const minY = Math.min(...cleanY);
        const maxY = Math.max(...cleanY);
        const xPadding = Math.max((maxX - minX) * 0.05, 1e-9);
        const yPadding = Math.max((maxY - minY) * 0.05, 1e-9);
        return {
            xDomain: [minX - xPadding, maxX + xPadding],
            yDomain: [minY - yPadding, maxY + yPadding]
        };
    }, [filteredPlotData]);

    // Calculate correlation line and value if needed
    const correlationLine = useMemo(() => {
        if (!showCorrelationLine) return null;
        const xData = getDataByVariable(data, xVariable);
        const yData = getDataByVariable(data, yVariable);
        const clean = xData.map((x, i) => [x, yData[i]]).filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
        if (clean.length < 2) return null;
        const xClean = clean.map(([a]) => a);
        const yClean = clean.map(([, b]) => b);
        const correlation = calculateCorrelation(xClean, yClean);
        if (typeof onCorrelation === 'function') onCorrelation(correlation);
        const n = xClean.length;
        const sumX = xClean.reduce((a, b) => a + b, 0);
        const sumY = yClean.reduce((a, b) => a + b, 0);
        const sumXY = xClean.reduce((sum, x, i) => sum + x * yClean[i], 0);
        const sumX2 = xClean.reduce((sum, x) => sum + x * x, 0);
        const denominator = n * sumX2 - sumX * sumX;
        if (denominator <= 0) return null;
        const slope = (n * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY - slope * sumX) / n;
        return { slope, intercept, correlation };
    }, [data, xVariable, yVariable, showCorrelationLine, onCorrelation]);

    // Determine axis labels with units
    const xLabel = xVariable + (xUnit !== undefined ? (xUnit ? ` (${xUnit})` : '') : (VARIABLE_UNITS[xVariable] ? ` (${VARIABLE_UNITS[xVariable]})` : ''));
    const yLabel = yVariable + (yUnit !== undefined ? (yUnit ? ` (${yUnit})` : '') : (VARIABLE_UNITS[yVariable] ? ` (${VARIABLE_UNITS[yVariable]})` : ''));

    return (
        <div className="relative" style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <ScatterChart
                    margin={{ top: 0, right: 0, bottom: 30, left: 10 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={isDarkMode ? '#4B5563' : '#E5E7EB'}
                    />
                    <XAxis
                        type="number"
                        dataKey="x"
                        name={xLabel}
                        label={{ value: xLabel, position: 'insideBottom', offset: 0, fill: isDarkMode ? '#E5E7EB' : '#1F2937', fontSize: 13, dy: 18 }}
                        stroke={isDarkMode ? '#E5E7EB' : '#1F2937'}
                        tick={{ 
                            fill: isDarkMode ? '#E5E7EB' : '#1F2937',
                            fontSize: 12,
                            dy: 5
                        }}
                        tickFormatter={v => xIsDate ? excelSerialToDate(v) : (typeof v === 'number' ? v.toFixed(2) : v)}
                        allowDataOverflow={true}
                        scale="auto"
                        domain={xDomain}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name={yLabel}
                        label={{ value: yLabel, angle: -90, position: 'insideLeft', offset: 0, fill: isDarkMode ? '#E5E7EB' : '#1F2937', fontSize: 13, dy: 70 }}
                        stroke={isDarkMode ? '#E5E7EB' : '#1F2937'}
                        tick={{ 
                            fill: isDarkMode ? '#E5E7EB' : '#1F2937',
                            fontSize: 12,
                            dx: -5
                        }}
                        tickFormatter={v => yIsDate ? excelSerialToDate(v) : (typeof v === 'number' ? v.toFixed(2) : v)}
                        allowDataOverflow={true}
                        scale="auto"
                        domain={yDomain}
                    />
                    <ZAxis range={[50]} />
                    <Tooltip content={<CustomTooltip data={data} />} />
                    <Scatter
                        data={filteredPlotData}
                        fill={isDarkMode ? '#93C5FD' : '#1D4ED8'}
                        isAnimationActive={false}
                    />
                    {correlationLine && (
                        <ReferenceLine
                            segment={[
                                { x: xDomain[0], y: correlationLine.slope * xDomain[0] + correlationLine.intercept },
                                { x: xDomain[1], y: correlationLine.slope * xDomain[1] + correlationLine.intercept }
                            ]}
                            stroke={isDarkMode ? '#93C5FD' : '#1D4ED8'}
                            strokeDasharray="5 5"
                        />
                    )}
                    <Brush
                        dataKey="x"
                        height={30}
                        stroke={isDarkMode ? '#93C5FD' : '#1D4ED8'}
                        fill={isDarkMode ? '#1F2937' : '#FFFFFF'}
                        travellerWidth={8}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}

// Helper to explain reason
function reasonLabel(reason: string) {
    if (reason === 'X') return 'X (outlier in X)';
    if (reason === 'Y') return 'Y (outlier in Y)';
    if (reason === 'X+Y' || reason === 'Y+X') return 'X+Y (outlier in both X and Y)';
    return reason;
}

export const ScatterPlotOutlierTable: React.FC<ScatterPlotProps> = (props) => {
    const { data, xVariable, yVariable, xUnit, yUnit, removeOutliers = true, iqrMultiplier = 2.5 } = props;
    // Prepare the data for the scatter plot
    const plotData = useMemo(() => {
        const xData = getDataByVariable(data, xVariable);
        const yData = getDataByVariable(data, yVariable);
        return xData.map((x, index) => ({ x, y: yData[index], index }));
    }, [data, xVariable, yVariable]);
    // Outlier detection (IQR method)
    const xOutliers = useMemo(() => getOutlierIndices(plotData.map(p => p.x), iqrMultiplier), [plotData, iqrMultiplier]);
    const yOutliers = useMemo(() => getOutlierIndices(plotData.map(p => p.y), iqrMultiplier), [plotData, iqrMultiplier]);
    const allOutlierIndices = useMemo(() => {
        const set = new Set<number>();
        xOutliers.forEach(i => set.add(i));
        yOutliers.forEach(i => set.add(i));
        return set;
    }, [xOutliers, yOutliers]);
    // Add reason (X, Y, or X+Y) for each outlier
    const outlierPoints = useMemo(() => {
        return plotData
            .map((p, i) => ({
                ...p,
                reason: [
                    xOutliers.has(i) ? 'X' : '',
                    yOutliers.has(i) ? 'Y' : ''
                ].filter(Boolean).join('+')
            }))
            .filter((_, i) => allOutlierIndices.has(i));
    }, [plotData, allOutlierIndices, xOutliers, yOutliers]);
    // Determine axis labels with units
    const xLabel = xVariable + (xUnit !== undefined ? (xUnit ? ` (${xUnit})` : '') : (VARIABLE_UNITS[xVariable] ? ` (${VARIABLE_UNITS[xVariable]})` : ''));
    const yLabel = yVariable + (yUnit !== undefined ? (yUnit ? ` (${yUnit})` : '') : (VARIABLE_UNITS[yVariable] ? ` (${VARIABLE_UNITS[yVariable]})` : ''));
    if (!removeOutliers) return null;
    if (outlierPoints.length === 0) {
        return (
            <div className="mt-6 rounded-md border border-green-400 bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-800 dark:text-green-200">
                <span className="font-semibold">Good news, no outliers found.</span>
            </div>
        );
    }
    return (
        <div className="rounded-md border border-red-400 bg-red-50 dark:bg-red-900/20 p-3 text-sm">
            <div className="font-semibold text-red-700 dark:text-red-300 mb-2">
                Outliers removed (IQR method):
            </div>
            <div className="mb-2 text-xs text-red-800 dark:text-red-200">
                Outliers are detected using the <b>Interquartile Range (IQR)</b> method with a multiplier of <b>{iqrMultiplier}</b>. A value is considered an outlier if it is unusually high or low compared to the rest of the data.<br />
                <span className="font-semibold">Reason:</span> <span className="inline-block ml-1">'X' = outlier in X axis, 'Y' = outlier in Y axis, 'X+Y' = outlier in both axes.</span>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-xs border border-red-200 dark:border-red-700 bg-white dark:bg-red-950">
                    <thead>
                        <tr className="bg-red-100 dark:bg-red-900/40">
                            <th className="px-2 py-1 text-left">Sample Code</th>
                            <th className="px-2 py-1 text-left">{xLabel}</th>
                            <th className="px-2 py-1 text-left">{yLabel}</th>
                            <th className="px-2 py-1 text-left">Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {outlierPoints.map((p, i) => (
                            <tr key={i} className={i % 2 === 0 ? 'bg-red-50 dark:bg-red-900/10' : ''}>
                                <td className="px-2 py-1 text-red-800 dark:text-red-300 font-mono">{data.metadata.sampleCodes[p.index]}</td>
                                <td className="px-2 py-1 text-red-800 dark:text-red-300 font-mono">{typeof p.x === 'number' && isFinite(p.x) ? p.x.toFixed(2) : String(p.x)}</td>
                                <td className="px-2 py-1 text-red-800 dark:text-red-300 font-mono">{typeof p.y === 'number' && isFinite(p.y) ? p.y.toFixed(2) : String(p.y)}</td>
                                <td className="px-2 py-1 text-red-800 dark:text-red-300 font-semibold">{reasonLabel(p.reason)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-2 text-xs text-red-700 dark:text-red-300">
                <span className="font-semibold">Note:</span> The IQR method defines outliers as values below Q1 - <b>{iqrMultiplier}</b>×IQR or above Q3 + <b>{iqrMultiplier}</b>×IQR, where Q1 and Q3 are the 25th and 75th percentiles.
            </div>
        </div>
    );
};

const ScatterPlot: React.FC<ScatterPlotProps> = (props) => {
    // Calculate stats for both with and without outliers
    const { data, xVariable, yVariable, removeOutliers = true, iqrMultiplier = 2.5 } = props;
    const xData = getDataByVariable(data, xVariable);
    const yData = getDataByVariable(data, yVariable);
    // Outlier detection
    const plotData = xData.map((x, i) => ({ x, y: yData[i], index: i }));
    const xOutliers = getOutlierIndices(plotData.map(p => p.x), iqrMultiplier);
    const yOutliers = getOutlierIndices(plotData.map(p => p.y), iqrMultiplier);
    const allOutlierIndices = new Set<number>();
    xOutliers.forEach(i => allOutlierIndices.add(i));
    yOutliers.forEach(i => allOutlierIndices.add(i));
    // All data
    const cleanAll = plotData.filter(p => Number.isFinite(p.x) && Number.isFinite(p.y));
    const xAll = cleanAll.map(p => p.x);
    const yAll = cleanAll.map(p => p.y);
    // Filtered data
    const cleanFiltered = cleanAll.filter((_, i) => !allOutlierIndices.has(cleanAll[i].index));
    const xFiltered = cleanFiltered.map(p => p.x);
    const yFiltered = cleanFiltered.map(p => p.y);
    // Stats helpers
    function stats(xArr: number[], yArr: number[]) {
        const n = xArr.length;
        const r = n > 1 ? calculateCorrelation(xArr, yArr) : NaN;
        const r2 = isFinite(r) ? r * r : NaN;
        let p: number | string = '—';
        if (n > 2 && isFinite(r)) {
            if (Math.abs(r) === 1) {
                p = 0;
            } else if (r === 0) {
                p = 1;
            } else {
                const val = calculatePearsonPValue(r, n);
                p = isFinite(val) ? val : '—';
            }
        }
        return { n, r, r2, p };
    }
    const statsAll = stats(xAll, yAll);
    const statsFiltered = stats(xFiltered, yFiltered);

    // Table rows
    const statRows = [
        { label: 'Pearson r', key: 'r', format: (v: number | string, n: number) => (n < 2 || typeof v !== 'number' || !isFinite(v)) ? '—' : v.toFixed(3) },
        { label: 'r²', key: 'r2', format: (v: number | string, n: number) => (n < 2 || typeof v !== 'number' || !isFinite(v)) ? '—' : v.toFixed(3) },
        { label: 'n', key: 'n', format: (v: number | string) => (typeof v === 'number') ? v : v },
        { label: 'p-value', key: 'p', format: (v: number | string, n: number) => (n < 3 || typeof v !== 'number' || !isFinite(v)) ? '—' : (v < 1e-5 ? '< 0.00001' : v.toFixed(5).replace(/0+$/, '').replace(/\.$/, '')) },
    ];

    return (
        <>
            <ScatterPlotChart {...props} />
            <div className={`mt-3 rounded-md border ${removeOutliers ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' : 'border-blue-200 bg-blue-50 dark:bg-blue-900/10'} p-4 text-sm mb-3`}
                style={{ maxWidth: '100%', minWidth: 400 }}>
                <div className="font-semibold text-blue-700 dark:text-blue-200 mb-2 text-base">Statistics Summary</div>
                <div className="overflow-x-auto">
                    <table className="min-w-[400px] text-sm border border-blue-200 dark:border-blue-700 bg-white dark:bg-blue-950 w-full">
                        <thead>
                            <tr className="bg-blue-100 dark:bg-blue-900/40">
                                <th className="px-3 py-1 text-left">Statistic</th>
                                <th className="px-3 py-1 text-left">All Data</th>
                                {removeOutliers && <th className="px-3 py-1 text-left">No Outliers</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {statRows.map(row => (
                                <tr key={row.key} className="even:bg-blue-50 dark:even:bg-blue-900/10">
                                    <td className="px-3 py-1 font-medium text-blue-900 dark:text-blue-100 text-sm">{row.label}</td>
                                    <td className="px-3 py-1 text-blue-800 dark:text-blue-200 text-sm">{row.format(statsAll[row.key as keyof typeof statsAll], statsAll.n)}</td>
                                    {removeOutliers && <td className="px-3 py-1 text-blue-800 dark:text-blue-200 text-sm">{row.format(statsFiltered[row.key as keyof typeof statsFiltered], statsFiltered.n)}</td>}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {removeOutliers && <div className="mt-2 text-xs text-blue-700 dark:text-blue-200">Columns show statistics for all data and for data with outliers removed (IQR method, multiplier {iqrMultiplier}).</div>}
                {(statsAll.n < 2 || (removeOutliers && statsFiltered.n < 2)) && (
                    <div className="mt-2 text-xs text-blue-700 dark:text-blue-200">
                        Not enough data to calculate statistics (need at least 2 data points).
                    </div>
                )}
            </div>
            <ScatterPlotOutlierTable {...props} />
        </>
    );
};

export default ScatterPlot;