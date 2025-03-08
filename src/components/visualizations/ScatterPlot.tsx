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
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({ data, xVariable, yVariable, height = 400 }) => {
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

        const plotData = [{
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
        }];

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
            showlegend: false,
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
    }, [data, xVariable, yVariable, height, isDarkMode]);

    return <div ref={plotRef} style={{ width: '100%', height: `${height}px`, minHeight: `${height}px`, position: 'relative', zIndex: 0 }} />;
};