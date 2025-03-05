'use client';

import { useEffect, useRef } from 'react';
import Plotly from 'plotly.js-dist-min';
import { calculateCorrelation } from '@/utils/statistics';
import { ProcessedData } from '@/utils/dataProcessing';
import { getDataByVariable } from '@/utils/dataAccess';
import { useTheme } from 'next-themes';

interface Props {
  data: ProcessedData;
}

export function CorrelationMatrix({ data }: Props) {
  const plotRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!plotRef.current) return;

    const plot = plotRef.current;
    const isDarkMode = theme === 'dark';

    // Define all variables with their display labels
    const variables = [
      // Environmental Factors
      { value: 'Avg Temperature', label: 'Temperature' },
      { value: 'Departure', label: 'Departure' },
      { value: 'pH', label: 'pH' },
      { value: 'Elevation', label: 'Elevation' },
      { value: 'General hardness (calcium carbonate)', label: 'Hardness' },
      { value: 'Total alkalinity ', label: 'Alkalinity' },
      { value: 'Carbonate ', label: 'Carbonate' },
      { value: 'Phosphate', label: 'Phosphate' },
      { value: 'Nitrate  ', label: 'Nitrate' },
      { value: 'Nitrite ', label: 'Nitrite' },
      { value: 'Free chlorine', label: 'Chlorine' },
      { value: 'Radioactivity above background', label: 'Radioactivity' },
      { value: 'Longitude', label: 'Longitude' },
      { value: 'Latitude', label: 'Latitude' },
      // Diversity Indices
      { value: 'Shannon diversity index', label: 'Shannon' },
      { value: "Simpson's index", label: 'Simpson' },
      { value: "Inverse Simpson's index", label: 'Inverse Simpson' },
      { value: 'Berger Parker index', label: 'Berger-Parker' },
      { value: 'Effective number of species', label: 'Effective Species' },
      { value: "Fisher's alpha", label: "Fisher's Alpha" },
      { value: "Pielou's evenness", label: "Pielou's Evenness" },
      { value: 'Richness', label: 'Richness' },
    ];

    // Get data for each variable
    const variableData = variables.map(v => ({
      ...v,
      values: getDataByVariable(data, v.value)
    }));

    // Calculate correlation matrix
    const correlationMatrix = variableData.map(v1 => 
      variableData.map(v2 => calculateCorrelation(v1.values, v2.values))
    );

    const plotData = [{
      type: 'heatmap' as const,
      z: correlationMatrix,
      x: variables.map(v => v.label),
      y: variables.map(v => v.label),
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
      annotations: correlationMatrix.map((row, i) => 
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
  }, [data, theme]);

  return <div ref={plotRef} />;
} 