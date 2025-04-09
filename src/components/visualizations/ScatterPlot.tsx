'use client';

import { useMemo } from 'react';
import { ProcessedData } from '@/utils/dataProcessing';
import { getDataByVariable } from '@/utils/dataAccess';
import { useTheme } from 'next-themes';
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
    payload?: any[];
    label?: string;
    data: ProcessedData;
}

const CustomTooltip = ({ active, payload, data }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const point = payload[0].payload;
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
        
        const minX = Math.min(...xData);
        const maxX = Math.max(...xData);
        const minY = Math.min(...yData);
        const maxY = Math.max(...yData);
        
        // Add 5% padding to the domains
        const xPadding = (maxX - minX) * 0.05;
        const yPadding = (maxY - minY) * 0.05;
        
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
        
        // Calculate correlation coefficient and line of best fit
        const n = xData.length;
        const sumX = xData.reduce((a, b) => a + b, 0);
        const sumY = yData.reduce((a, b) => a + b, 0);
        const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
        const sumX2 = xData.reduce((sum, x) => sum + x * x, 0);
        
        const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;
        
        return {
            slope,
            intercept,
            correlation: (n * sumXY - sumX * sumY) / 
                        Math.sqrt((n * sumX2 - sumX * sumX) * 
                                (n * yData.reduce((sum, y) => sum + y * y, 0) - sumY * sumY))
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