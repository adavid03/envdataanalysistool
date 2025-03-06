'use client';

import { useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { ProcessedData } from '@/utils/dataProcessing';
import { getDataByVariable } from '@/utils/dataAccess';

interface ScatterPlotProps {
  data: ProcessedData;
  xVariable: string;
  yVariable: string;
  size?: { width: number; height: number };
}

export function ScatterPlot({ data, xVariable, yVariable, size }: ScatterPlotProps) {
  const plotRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const plotElement = plotRef.current;
    if (!plotElement) return;

    (async () => {
      const PlotlyModule = await import('plotly.js-dist-min');
      const Plotly = PlotlyModule.default;
      const isDarkMode = theme === 'dark';

      const xData = getDataByVariable(data, xVariable);
      const yData = getDataByVariable(data, yVariable);

      const plotData = [{
        type: 'scatter' as const,
        mode: 'markers' as const,
        x: xData,
        y: yData,
        marker: {
          size: size ? 6 : 10,
          color: isDarkMode ? '#60A5FA' : 'blue',
          opacity: 0.6,
        },
        hoverinfo: 'text' as const,
      }];

      const layout = {
        title: size ? undefined : `${yVariable} vs ${xVariable}`,
        width: size?.width || 500,
        height: size?.height || 500,
        xaxis: { 
          title: xVariable,
          color: isDarkMode ? '#D1D5DB' : undefined,
          gridcolor: isDarkMode ? '#374151' : undefined,
          zerolinecolor: isDarkMode ? '#4B5563' : undefined
        },
        yaxis: { 
          title: yVariable,
          color: isDarkMode ? '#D1D5DB' : undefined,
          gridcolor: isDarkMode ? '#374151' : undefined,
          zerolinecolor: isDarkMode ? '#4B5563' : undefined
        },
        plot_bgcolor: isDarkMode ? '#1F2937' : undefined,
        paper_bgcolor: isDarkMode ? '#1F2937' : undefined,
        font: {
          color: isDarkMode ? '#D1D5DB' : undefined
        }
      };

      Plotly.newPlot(plotElement, plotData, layout);
    })();

    return () => {
      // Clean up the plot when the component unmounts
      (async () => {
        const PlotlyModule = await import('plotly.js-dist-min');
        const Plotly = PlotlyModule.default;
        Plotly.purge(plotElement);
      })();
    };
  }, [data, xVariable, yVariable, size, theme]);

  return <div ref={plotRef} />;
}