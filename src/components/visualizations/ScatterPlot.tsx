'use client';

import { useMemo } from 'react';
import { ProcessedData } from '@/utils/dataProcessing';
import { getDataByVariable } from '@/utils/dataAccess';
import { useTheme } from 'next-themes';
import { calculateCorrelation } from '@/utils/statistics';
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

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ 
    data, 
    xVariable, 
    yVariable, 
    height = 500,
    showCorrelationLine = false 
}) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    // Prepare the data for the scatter plot
    const plotData = useMemo(() => {
        const xData = getDataByVariable(data, xVariable);
        const yData = getDataByVariable(data, yVariable);
        
        return xData.map((x, index) => ({
            x,
            y: yData[index],
            index
        }));
    }, [data, xVariable, yVariable]);

    // Calculate initial domains with padding
    const { xDomain, yDomain } = useMemo(() => {
        const xData = getDataByVariable(data, xVariable);
        const yData = getDataByVariable(data, yVariable);
        
        // Filter out non-finite values
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
        
        // Add 5% padding to the domains, with a minimum padding to handle equal values
        const xPadding = Math.max((maxX - minX) * 0.05, 1e-9);
        const yPadding = Math.max((maxY - minY) * 0.05, 1e-9);
        
        return {
            xDomain: [minX - xPadding, maxX + xPadding],
            yDomain: [minY - yPadding, maxY + yPadding]
        };
    }, [data, xVariable, yVariable]);

    // Calculate correlation line if needed
    const correlationLine = useMemo(() => {
        if (!showCorrelationLine) return null;

        const xData = getDataByVariable(data, xVariable);
        const yData = getDataByVariable(data, yVariable);
        
        // Filter out non-finite values
        const clean = xData.map((x, i) => [x, yData[i]])
            .filter(([a, b]) => Number.isFinite(a) && Number.isFinite(b));
        
        if (clean.length < 2) return null;
        
        const xClean = clean.map(([a]) => a);
        const yClean = clean.map(([, b]) => b);
        
        // Calculate correlation using the shared function
        const correlation = calculateCorrelation(xClean, yClean);
        
        // Calculate line of best fit
        const n = xClean.length;
        const sumX = xClean.reduce((a, b) => a + b, 0);
        const sumY = yClean.reduce((a, b) => a + b, 0);
        const sumXY = xClean.reduce((sum, x, i) => sum + x * yClean[i], 0);
        const sumX2 = xClean.reduce((sum, x) => sum + x * x, 0);
        
        const denominator = n * sumX2 - sumX * sumX;
        if (denominator <= 0) return null;
        
        const slope = (n * sumXY - sumX * sumY) / denominator;
        const intercept = (sumY - slope * sumX) / n;
        
        return {
            slope,
            intercept,
            correlation
        };
    }, [data, xVariable, yVariable, showCorrelationLine]);

    return (
        <div className="relative" style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <ScatterChart
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                    <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={isDarkMode ? '#4B5563' : '#E5E7EB'}
                    />
                    <XAxis
                        type="number"
                        dataKey="x"
                        name={xVariable}
                        stroke={isDarkMode ? '#E5E7EB' : '#1F2937'}
                        tick={{ 
                            fill: isDarkMode ? '#E5E7EB' : '#1F2937',
                            fontSize: 12,
                            dy: 5
                        }}
                        allowDataOverflow={true}
                        scale="auto"
                        domain={xDomain}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name={yVariable}
                        stroke={isDarkMode ? '#E5E7EB' : '#1F2937'}
                        tick={{ 
                            fill: isDarkMode ? '#E5E7EB' : '#1F2937',
                            fontSize: 12,
                            dx: -5
                        }}
                        allowDataOverflow={true}
                        scale="auto"
                        domain={yDomain}
                    />
                    <ZAxis range={[50]} />
                    <Tooltip content={<CustomTooltip data={data} />} />
                    <Scatter
                        data={plotData}
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
                            label={{
                                value: `Correlation: ${correlationLine.correlation.toFixed(3)}`,
                                position: 'insideTopRight',
                                fill: isDarkMode ? '#E5E7EB' : '#1F2937',
                                fontSize: 12
                            }}
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
};