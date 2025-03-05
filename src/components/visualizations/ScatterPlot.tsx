'use client';

import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { ProcessedData } from '@/utils/dataProcessing';
import { getDataByVariable } from '@/utils/dataAccess';
import { useTheme } from 'next-themes';

interface Props {
  data: ProcessedData;
  xVariable: string;
  yVariable: string;
  size?: { width: number; height: number };
}

export function ScatterPlot({ data, xVariable, yVariable, size }: Props) {
  const plotRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!plotRef.current) return;

    const plot = plotRef.current;
    const isDarkMode = theme === 'dark';

    // Create hover text with all available information
    const hoverText = data.metadata.sampleCodes.map((code, index) => {
      const environmentalInfo = Object.entries(data.environmentalFactors).map(([key, values]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        return `${label}: ${values[index]}`;
      });

      const diversityInfo = Object.entries(data.diversityIndices).map(([key, values]) => {
        const label = key.charAt(0).toUpperCase() + key.slice(1);
        return `${label}: ${values[index]}`;
      });

      return `<b>Sample Code: ${code}</b><br>` +
        `<b>Date: ${data.metadata.dates[index]}</b><br>` +
        `<b>Location:</b><br>` +
        `Latitude: ${data.metadata.locations.lat[index]}<br>` +
        `Longitude: ${data.metadata.locations.long[index]}<br>` +
        `<br><b>Environmental Factors:</b><br>` +
        environmentalInfo.join('<br>') +
        `<br><b>Diversity Indices:</b><br>` +
        diversityInfo.join('<br>');
    });

    const plotData = [{
      type: 'scatter' as const,
      mode: 'markers' as const,
      x: getDataByVariable(data, xVariable),
      y: getDataByVariable(data, yVariable),
      text: hoverText,
      hoverinfo: 'text' as const,
      marker: {
        size: size ? 6 : 10,
        color: isDarkMode ? '#60A5FA' : 'blue',
        opacity: 0.6,
      },
    }];

    const layout = {
      title: size ? undefined : `${yVariable} vs ${xVariable}`,
      xaxis: { 
        title: xVariable,
        tickfont: { size: size ? 10 : 12, color: isDarkMode ? '#D1D5DB' : undefined },
        color: isDarkMode ? '#D1D5DB' : undefined,
        gridcolor: isDarkMode ? '#374151' : undefined,
        zerolinecolor: isDarkMode ? '#4B5563' : undefined
      },
      yaxis: { 
        title: yVariable,
        tickfont: { size: size ? 10 : 12, color: isDarkMode ? '#D1D5DB' : undefined },
        color: isDarkMode ? '#D1D5DB' : undefined,
        gridcolor: isDarkMode ? '#374151' : undefined,
        zerolinecolor: isDarkMode ? '#4B5563' : undefined
      },
      hovermode: 'closest' as const,
      width: size?.width || 500,
      height: size?.height || 500,
      hoverlabel: {
        bgcolor: isDarkMode ? '#1F2937' : 'white',
        font: { size: size ? 10 : 12, color: isDarkMode ? '#D1D5DB' : undefined },
        align: 'left' as const,
      },
      margin: size ? { t: 20, b: 40, l: 50, r: 20 } : { t: 40, b: 60, l: 60, r: 40 },
      plot_bgcolor: isDarkMode ? '#1F2937' : undefined,
      paper_bgcolor: isDarkMode ? '#1F2937' : undefined,
      font: {
        color: isDarkMode ? '#D1D5DB' : undefined
      }
    };

    const config = {
      displayModeBar: !size,
      responsive: true,
      scrollZoom: !size,
    };

    Plotly.newPlot(plot, plotData, layout, config);

    return () => {
      Plotly.purge(plot);
    };
  }, [data, xVariable, yVariable, size, theme]);

  return <div ref={plotRef} />;
}