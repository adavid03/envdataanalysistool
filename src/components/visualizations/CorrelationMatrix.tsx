'use client';

import { useEffect, useRef, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import { calculateCorrelation } from '@/utils/statistics';
import { ProcessedData } from '@/utils/dataProcessing';
import { getDataByVariable } from '@/utils/dataAccess';
import { useTheme } from 'next-themes';

interface CorrelationMatrixProps {
  data: ProcessedData;
  variables?: string[];
  variableLabels?: Record<string, string>;
}

export function CorrelationMatrix({ data, variables, variableLabels }: CorrelationMatrixProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  // Memoize the variables and labels
  const memoizedVariables = useMemo(() => variables || Object.keys(data.data), [data, variables]);
  const memoizedLabels = useMemo(() => {
    const getLabel = (variable: string) => {
      if (variableLabels && variableLabels[variable]) {
        return variableLabels[variable];
      }
      return variable.split(/[_-]/).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    };
    return memoizedVariables.map(getLabel);
  }, [memoizedVariables, variableLabels]);

  // Memoize the correlation calculations
  const correlations = useMemo(() => {
    return memoizedVariables.map(var1 =>
      memoizedVariables.map(var2 => {
        const data1 = getDataByVariable(data, var1);
        const data2 = getDataByVariable(data, var2);
        return calculateCorrelation(data1, data2);
      })
    );
  }, [data, memoizedVariables]);

  useEffect(() => {
    if (!plotRef.current) return;

    const plot = plotRef.current;
    const isDarkMode = theme === 'dark';

    const plotData = [{
      type: 'heatmap' as const,
      z: correlations,
      x: memoizedLabels,
      y: memoizedLabels,
      colorscale: 'RdBu',
      zmin: -1,
      zmax: 1,
      hoverongaps: false,
      hovertemplate: 
        '<b>%{y}</b> vs <b>%{x}</b><br>' +
        'Correlation: %{z:.2f}<extra></extra>',
    }];

    const layout = {
      title: 'Correlation Matrix',
      width: 800,
      height: 800,
      margin: { t: 50, b: 100, l: 100, r: 50 },
      xaxis: {
        tickangle: 45,
        tickfont: { size: 10, color: isDarkMode ? '#D1D5DB' : undefined },
        color: isDarkMode ? '#D1D5DB' : undefined,
        gridcolor: isDarkMode ? '#374151' : undefined,
        zerolinecolor: isDarkMode ? '#4B5563' : undefined
      },
      yaxis: {
        tickfont: { size: 10, color: isDarkMode ? '#D1D5DB' : undefined },
        color: isDarkMode ? '#D1D5DB' : undefined,
        gridcolor: isDarkMode ? '#374151' : undefined,
        zerolinecolor: isDarkMode ? '#4B5563' : undefined
      },
      plot_bgcolor: isDarkMode ? '#1F2937' : undefined,
      paper_bgcolor: isDarkMode ? '#1F2937' : undefined,
      font: {
        color: isDarkMode ? '#D1D5DB' : undefined
      },
      annotations: correlations.map((row, i) => 
        row.map((val, j) => ({
          text: val.toFixed(2),
          x: j,
          y: i,
          xref: 'x' as const,
          yref: 'y' as const,
          showarrow: false,
          font: {
            color: isDarkMode 
              ? Math.abs(val) > 0.5 ? '#FFFFFF' : '#D1D5DB'
              : Math.abs(val) > 0.5 ? 'white' : 'black',
            size: 10
          }
        }))
      ).flat(),
    };

    Plotly.newPlot(plot, plotData, layout);

    return () => {
      Plotly.purge(plot);
    };
  }, [theme, correlations, memoizedLabels]);

  return <div ref={plotRef} />;
} 