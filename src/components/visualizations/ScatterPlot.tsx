'use client';

import { useEffect, useRef } from 'react';
import { ProcessedData } from '@/utils/dataProcessing';
import { getDataByVariable } from '@/utils/dataAccess';
import { useTheme } from 'next-themes';

interface ScatterPlotProps {
    data: ProcessedData;
    xVariable: string;
    yVariable: string;
    height?: number;
    showCorrelationLine?: boolean;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, xVariable, yVariable, height = 400, showCorrelationLine = false }) => {
    const plotRef = useRef<HTMLDivElement>(null);
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';

    useEffect(() => {
        if (!plotRef.current) return;

        const plotElement = plotRef.current;
        const xData = getDataByVariable(data, xVariable);
        const yData = getDataByVariable(data, yVariable);

        // Get all available variables
        const envVars = Object.keys(data.environmentalFactors);
        const divVars = Object.keys(data.diversityIndices);

        // Create hover text with all data points
        const hoverText = xData.map((_, index) => {
            const sampleCode = data.metadata.sampleCodes[index];
            const envValues = envVars.map(varName => {
                const value = getDataByVariable(data, varName)[index];
                const formattedValue = typeof value === 'number' ? value.toFixed(3) : value;
                return `${varName}: ${formattedValue}`;
            });
            
            const divValues = divVars.map(varName => {
                const value = getDataByVariable(data, varName)[index];
                const formattedValue = typeof value === 'number' ? value.toFixed(3) : value;
                return `${varName}: ${formattedValue}`;
            });

            return [
                `<b>Sample: ${sampleCode}</b>`,
                '<br><b>Environmental Factors:</b>',
                ...envValues,
                '<br><b>Diversity Indices:</b>',
                ...divValues
            ].join('<br>');
        });

        // Calculate correlation line if needed
        let correlationLine = null;
        if (showCorrelationLine) {
            // Calculate correlation coefficient
            const n = xData.length;
            const sumX = xData.reduce((a, b) => a + b, 0);
            const sumY = yData.reduce((a, b) => a + b, 0);
            const sumXY = xData.reduce((sum, x, i) => sum + x * yData[i], 0);
            const sumX2 = xData.reduce((sum, x) => sum + x * x, 0);
            const sumY2 = yData.reduce((sum, y) => sum + y * y, 0);
            
            const correlation = (n * sumXY - sumX * sumY) / 
                              Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
            
            // Calculate line of best fit
            const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
            const intercept = (sumY - slope * sumX) / n;
            
            // Create line points
            const minX = Math.min(...xData);
            const maxX = Math.max(...xData);
            const lineX = [minX, maxX];
            const lineY = lineX.map(x => slope * x + intercept);
            
            correlationLine = {
                x: lineX,
                y: lineY,
                type: 'scatter' as const,
                mode: 'lines' as const,
                line: {
                    color: isDarkMode ? '#60A5FA' : '#2563EB',
                    width: 2,
                    dash: 'dash' as const
                },
                name: `Correlation: ${correlation.toFixed(3)}`,
                showlegend: true
            };
        }

        const plotData = [
            {
                x: xData,
                y: yData,
                mode: 'markers' as const,
                type: 'scatter' as const,
                marker: {
                    size: 6
                },
                hovertemplate: '%{text}<extra></extra>',
                text: hoverText,
                hoverlabel: {
                    bgcolor: isDarkMode ? '#374151' : '#FFFFFF',
                    bordercolor: isDarkMode ? '#4B5563' : '#E5E7EB',
                    font: { 
                        family: 'monospace',
                        size: 10,
                        color: isDarkMode ? '#FFFFFF' : '#000000'
                    }
                }
            },
            ...(correlationLine ? [correlationLine] : [])
        ];

        const layout = {
            height: height,
            width: undefined,
            autosize: true,
            title: `${yVariable} vs ${xVariable}`,
            xaxis: {
                title: xVariable,
                automargin: true
            },
            yaxis: {
                title: yVariable,
                automargin: true
            },
            margin: {
                l: 50,
                r: 30,
                t: 50,
                b: 50,
                pad: 0
            },
            showlegend: showCorrelationLine,
            legend: {
                orientation: 'h' as const,
                yanchor: 'bottom' as const,
                y: 1.02,
                xanchor: 'right' as const,
                x: 1
            },
            plot_bgcolor: isDarkMode ? '#1F2937' : '#FFFFFF',
            paper_bgcolor: isDarkMode ? '#1F2937' : '#FFFFFF',
            hovermode: 'closest' as const,
            hoverdistance: -1,
            hoverlabel: {
                namelength: -1,
                align: 'left' as const
            }
        };

        const config = {
            displayModeBar: 'hover' as const,
            responsive: true,
            displaylogo: false
        };

        const renderPlot = async () => {
            const Plotly = (await import('plotly.js-dist-min')).default;
            await Plotly.newPlot(plotElement, plotData, layout, config);
        };

        renderPlot();

        return () => {
            if (plotElement) {
                (async () => {
                    const Plotly = (await import('plotly.js-dist-min')).default;
                    Plotly.purge(plotElement);
                })();
            }
        };
    }, [data, xVariable, yVariable, height, isDarkMode, showCorrelationLine]);

    return <div ref={plotRef} style={{ width: '100%', height: `${height}px`, minHeight: `${height}px`, position: 'relative', zIndex: 0 }} />;
};