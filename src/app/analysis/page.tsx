'use client';

import { useFile } from '../contexts/FileContext';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { ProcessedData, processExcelFile } from '@/utils/dataProcessing';
import dynamic from 'next/dynamic';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { calculateCorrelation } from '@/utils/statistics';
import { getDataByVariable } from '@/utils/dataAccess';
import { useAnalysisMode } from '../contexts/AnalysisModeContext';
import { autoDetectColumns, DetectedColumn } from '@/utils/autoDetect';
import { AutoDetectionConfirmation } from '@/components/AutoDetectionConfirmation';
import { AddPlotDropdown } from '@/components/ui/AddPlotDropdown';

// Dynamically import all Plotly components with no SSR
const ScatterPlot = dynamic(
    () => import('@/components/visualizations/ScatterPlot').then(mod => mod.ScatterPlot),
    { ssr: false }
);

const CorrelationMatrix = dynamic(
    () => import('@/components/visualizations/CorrelationMatrix').then(mod => mod.CorrelationMatrix),
    { ssr: false }
);

// Combine all variables into a single array with labels
const ALL_VARIABLES = [
    // Environmental Factors
    { value: 'Avg Temperature', label: 'Temperature', description: 'Average temperature measurements', group: 'Environmental Factors' },
    { value: 'Departure', label: 'Departure', description: 'Temperature departure from normal', group: 'Environmental Factors' },
    { value: 'pH', label: 'pH', description: 'Water pH level', group: 'Environmental Factors' },
    { value: 'Elevation', label: 'Elevation', description: 'Site elevation above sea level', group: 'Environmental Factors' },
    { value: 'General hardness (calcium carbonate)', label: 'Hardness', description: 'General hardness (calcium carbonate)', group: 'Environmental Factors' },
    { value: 'Total alkalinity ', label: 'Total Alkalinity', description: 'Total alkalinity measurements', group: 'Environmental Factors' },
    { value: 'Carbonate ', label: 'Carbonate', description: 'Carbonate concentration', group: 'Environmental Factors' },
    { value: 'Phosphate', label: 'Phosphate', description: 'Phosphate concentration', group: 'Environmental Factors' },
    { value: 'Nitrate  ', label: 'Nitrate', description: 'Nitrate concentration', group: 'Environmental Factors' },
    { value: 'Nitrite ', label: 'Nitrite', description: 'Nitrite concentration', group: 'Environmental Factors' },
    { value: 'Free chlorine', label: 'Free Chlorine', description: 'Free chlorine concentration', group: 'Environmental Factors' },
    { value: 'Radioactivity above background', label: 'Radioactivity', description: 'Radioactivity above background', group: 'Environmental Factors' },
    { value: 'Longitude', label: 'Longitude', description: 'Geographic longitude', group: 'Environmental Factors' },
    { value: 'Latitude', label: 'Latitude', description: 'Geographic latitude', group: 'Environmental Factors' },
    // Diversity Indices
    { value: 'Shannon diversity index', label: 'Shannon Index', description: 'Shannon diversity index', group: 'Diversity Indices' },
    { value: "Simpson's index", label: "Simpson's Index", description: "Simpson's diversity index", group: 'Diversity Indices' },
    { value: "Inverse Simpson's index", label: "Inverse Simpson's Index", description: "Inverse Simpson's diversity index", group: 'Diversity Indices' },
    { value: 'Berger Parker index', label: 'Berger-Parker Index', description: 'Berger-Parker dominance index', group: 'Diversity Indices' },
    { value: 'Effective number of species', label: 'Effective Species', description: 'Effective number of species', group: 'Diversity Indices' },
    { value: "Fisher's alpha", label: "Fisher's Alpha", description: "Fisher's alpha diversity index", group: 'Diversity Indices' },
    { value: "Pielou's evenness", label: "Pielou's Evenness", description: "Pielou's species evenness index", group: 'Diversity Indices' },
    { value: 'Richness', label: 'Richness', description: 'Species richness', group: 'Diversity Indices' },
];

interface PlotConfig {
    id: string;
    xVariable: string;
    yVariable: string;
    warning?: string;
    correlation?: number;
    showCorrelationLine: boolean;
}

interface SignificantRelationship {
    envVar: typeof ALL_VARIABLES[0];
    divVar: typeof ALL_VARIABLES[0];
    correlation: number;
}

// Update ALL_VARIABLES to be dynamic based on detected columns
const createVariableFromColumn = (column: DetectedColumn) => {
    // Skip metadata columns
    if (column.type === 'metadata') {
        return null;
    }

    return {
        value: column.name,
        label: column.name.split(/[_-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        description: column.description,
        group: column.type === 'environmental' ? 'Environmental Factors' :
            column.type === 'diversity' ? 'Diversity Indices' : 'Other'
    };
};

export default function AnalysisPage() {
    const { file } = useFile();
    const [data, setData] = useState<ProcessedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [allVariables, setAllVariables] = useState<typeof ALL_VARIABLES>([]);
    const [plots, setPlots] = useState<PlotConfig[]>([]);
    const { mode } = useAnalysisMode();
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [detectedColumns, setDetectedColumns] = useState<DetectedColumn[]>([]);
    const [showAutoSection, setShowAutoSection] = useState(false);
    const [autoPlots, setAutoPlots] = useState<PlotConfig[]>([]);

    useEffect(() => {
        if (!file) {
            window.location.href = '/';
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                // Log initial state
                console.log('Starting loadData with mode:', mode);

                const [processed] = await Promise.all([
                    processExcelFile(file),
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);
                setData(processed);

                // Always run auto-detection first
                const result = autoDetectColumns(processed);
                const hasDetectedColumns = result.success && result.columns.length > 0;

                console.log('Auto-detection result:', {
                    success: result.success,
                    columnCount: result.columns.length,
                    hasDetectedColumns,
                    mode
                });

                if (hasDetectedColumns) {
                    setDetectedColumns(result.columns);
                    const variables = result.columns
                        .map(createVariableFromColumn)
                        .filter((v): v is NonNullable<ReturnType<typeof createVariableFromColumn>> => v !== null);

                    console.log('Processed variables:', {
                        count: variables.length,
                        groups: variables.map(v => v.group)
                    });

                    // Handle each mode
                    switch (mode) {
                        case 'template':
                            console.log('Using template mode');
                            setAllVariables(ALL_VARIABLES);
                            break;

                        case 'template-auto':
                        case 'full-auto':
                            console.log(`Using ${mode} mode`);
                            if (variables.length >= 2) {
                                console.log('Showing auto-detection confirmation');
                                setShowConfirmation(true);
                                // Set initial variables based on mode
                                setAllVariables(mode === 'template-auto' ? ALL_VARIABLES : variables);
                            } else {
                                console.warn('Insufficient auto-detected columns, using template mode');
                                setAllVariables(ALL_VARIABLES);
                            }
                            break;

                        default:
                            console.warn('Unknown mode:', mode);
                            setAllVariables(ALL_VARIABLES);
                    }
                } else {
                    console.warn('Auto-detection failed, falling back to template mode');
                    setAllVariables(ALL_VARIABLES);
                }
            } catch (error) {
                console.error('Error processing file:', error);
                setAllVariables(ALL_VARIABLES);
            } finally {
                setLoading(false);
                localStorage.removeItem('isAnalyzing');
            }
        };

        loadData();
    }, [file, mode]);

    // Initialize plots when variables are available
    useEffect(() => {
        if (allVariables.length > 0 && plots.length === 0) {
            const envVars = allVariables.filter(v => v.group === 'Environmental Factors');
            const divVars = allVariables.filter(v => v.group === 'Diversity Indices');

            if (envVars.length > 0 && divVars.length > 0) {
                // Initialize with the first environmental and diversity variables
                setPlots([{
                    id: '1',
                    xVariable: envVars[0].value,
                    yVariable: divVars[0].value,
                    showCorrelationLine: false
                }]);
            }
        }
    }, [allVariables, plots.length]);

    const findSignificantRelationships = useCallback(() => {
        if (!data) return;
        const relationships: SignificantRelationship[] = [];
        const envFactors = allVariables.filter(v => v.group === 'Environmental Factors');
        const divIndices = allVariables.filter(v => v.group === 'Diversity Indices');

        envFactors.forEach(envVar => {
            const envData = getDataByVariable(data, envVar.value);
            divIndices.forEach(divVar => {
                const divData = getDataByVariable(data, divVar.value);
                const correlation = Math.abs(calculateCorrelation(envData, divData));
                relationships.push({ envVar, divVar, correlation });
            });
        });

        // Update significantRelationships state
        // This is now handled by the component itself
    }, [data, allVariables]);

    useEffect(() => {
        if (data) {
            findSignificantRelationships();
        }
    }, [data, findSignificantRelationships]);

    // Check localStorage for analyzing state on mount
    useEffect(() => {
        const isAnalyzing = localStorage.getItem('isAnalyzing');
        if (isAnalyzing === 'true') {
            setLoading(true);
        }
    }, []);  // Keep empty array for mount-only effect

    const updatePlot = useCallback((id: string, updates: Partial<Omit<PlotConfig, 'id'>>) => {
        setPlots(prevPlots => prevPlots.map(plot =>
            plot.id === id ? { ...plot, ...updates } : plot
        ));
    }, []);

    const removePlot = useCallback((id: string) => {
        setPlots(prevPlots => prevPlots.filter(plot => plot.id !== id));
    }, []);

    const handleConfirmAutoDetection = useCallback((editedColumns: DetectedColumn[]) => {
        console.log('Auto-detection confirmed with edited columns:', editedColumns);
        // Create variables from the edited columns
        const variables = editedColumns
            .map(createVariableFromColumn)
            .filter((v): v is NonNullable<ReturnType<typeof createVariableFromColumn>> => v !== null);

        // Set the variables and clear any existing plots
        setAllVariables(variables);
        setPlots([]);  // Clear existing plots to force re-initialization with new variables
        setShowConfirmation(false);
    }, []);

    const handleCancelAutoDetection = useCallback(() => {
        console.log('Auto-detection cancelled');
        setShowConfirmation(false);
        // Keep template variables
        setAllVariables(ALL_VARIABLES);
    }, []);

    const generateAutoPlots = useCallback(() => {
        if (!data) return;
        const relationships: SignificantRelationship[] = [];
        const envFactors = allVariables.filter(v => v.group === 'Environmental Factors');
        const divIndices = allVariables.filter(v => v.group === 'Diversity Indices');

        envFactors.forEach(envVar => {
            const envData = getDataByVariable(data, envVar.value);
            divIndices.forEach(divVar => {
                const divData = getDataByVariable(data, divVar.value);
                const correlation = Math.abs(calculateCorrelation(envData, divData));
                relationships.push({ envVar, divVar, correlation });
            });
        });

        // Sort by correlation and take top 6
        const top6 = relationships
            .sort((a, b) => b.correlation - a.correlation)
            .slice(0, 6);

        // Create plots for top 6
        const newAutoPlots = top6.map((rel, index) => ({
            id: `auto-${index + 1}`,
            xVariable: rel.envVar.value,
            yVariable: rel.divVar.value,
            correlation: rel.correlation,
            showCorrelationLine: false
        }));

        setAutoPlots(newAutoPlots);
        setShowAutoSection(true);
    }, [data, allVariables]);

    const getOptionsWithDisabled = useCallback((currentPlotId: string, isXAxis: boolean) => {
        // Get all variable combinations currently in use
        const usedCombinations = plots.reduce((acc, plot) => {
            if (plot.id !== currentPlotId && plot.xVariable && plot.yVariable) {
                acc.push({
                    x: plot.xVariable,
                    y: plot.yVariable
                });
            }
            return acc;
        }, [] as { x: string; y: string }[]);

        return allVariables.map(variable => {
            const isDisabled = usedCombinations.some(combo => {
                if (isXAxis) {
                    // If this is an X-axis selection, check if this variable is used as X
                    // in combination with any Y variable from the current plot
                    const currentPlot = plots.find(p => p.id === currentPlotId);
                    return combo.x === variable.value && combo.y === currentPlot?.yVariable;
                } else {
                    // If this is a Y-axis selection, check if this variable is used as Y
                    // in combination with any X variable from the current plot
                    const currentPlot = plots.find(p => p.id === currentPlotId);
                    return combo.y === variable.value && combo.x === currentPlot?.xVariable;
                }
            });

            if (isDisabled) {
                return {
                    ...variable,
                    disabled: true,
                    disabledReason: `Already used in another plot`
                };
            }

            return variable;
        });
    }, [plots, allVariables]);

    if (loading || !data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
                    <p className="text-gray-600 dark:text-gray-400">Processing your data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="fixed top-2 max-w-[88rem] w-full z-20 -translate-x-1/2 left-1/2">
                <div className="flex items-center gap-5 bg-neutral-100/50 dark:bg-neutral-900/50 border border-gray-200 dark:border-gray-800 p-2 rounded-lg backdrop-blur-sm">
                    <Link
                        href="/"
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                        Analysis
                    </h1>
                </div>
            </div>
            <div className="container mx-auto max-w-7xl pt-28">


                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-gray-100 mx-auto"></div>
                            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your data...</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {showConfirmation && (
                            <AutoDetectionConfirmation
                                columns={detectedColumns}
                                onConfirm={handleConfirmAutoDetection}
                                onCancel={handleCancelAutoDetection}
                            />
                        )}

                        <div className="space-y-8">
                            {/* Plots section */}
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Plots
                                    </h2>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <AddPlotDropdown
                                                onSelect={(type) => {
                                                    // Get currently used variables
                                                    const usedVars = new Set(plots.flatMap(p => [p.xVariable, p.yVariable]));

                                                    // Filter variables based on type and usage
                                                    const availableEnv = allVariables
                                                        .filter(v => v.group === 'Environmental Factors' && !usedVars.has(v.value));
                                                    const availableDiv = allVariables
                                                        .filter(v => v.group === 'Diversity Indices' && !usedVars.has(v.value));

                                                    // Add new plot based on type
                                                    if (type === 'custom') {
                                                        setPlots(prev => [...prev, {
                                                            id: String(prev.length + 1),
                                                            xVariable: '',
                                                            yVariable: '',
                                                            showCorrelationLine: false
                                                        }]);
                                                    } else if (type === 'water' && availableEnv.length > 1) {
                                                        // Water Chemistry: env vs env
                                                        setPlots(prev => [...prev, {
                                                            id: String(prev.length + 1),
                                                            xVariable: availableEnv[0].value,
                                                            yVariable: availableEnv[1].value,
                                                            showCorrelationLine: false
                                                        }]);
                                                    } else if (type === 'diversity' && availableEnv.length > 0 && availableDiv.length > 0) {
                                                        // Diversity: env vs diversity
                                                        setPlots(prev => [...prev, {
                                                            id: String(prev.length + 1),
                                                            xVariable: availableEnv[0].value,
                                                            yVariable: availableDiv[0].value,
                                                            showCorrelationLine: false
                                                        }]);
                                                    }
                                                }}
                                            />
                                            <button
                                                className={`group relative h-10 px-4 backdrop-blur-sm border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 ${showAutoSection
                                                        ? "bg-red-100/20 dark:bg-red-900/20 border-red-200/50 dark:border-red-700/50 text-red-700 dark:text-red-400 hover:bg-red-100/30 dark:hover:bg-red-900/30 focus:ring-red-500/50"
                                                        : "bg-green-100/20 dark:bg-green-900/20 border-green-200/50 dark:border-green-700/50 text-green-700 dark:text-green-400 hover:bg-green-100/30 dark:hover:bg-green-900/30 focus:ring-green-500/50"
                                                    }`}
                                                onClick={() => {
                                                    if (showAutoSection) {
                                                        setShowAutoSection(false);
                                                    } else {
                                                        generateAutoPlots();
                                                    }
                                                }}
                                            >
                                                <span className="relative">
                                                    {showAutoSection ? 'Hide AC' : 'AC'}
                                                    <div className="absolute right-0 top-0 -translate-y-[calc(100%+0.75rem)] px-3 py-2 bg-gray-900 dark:bg-gray-200 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                        Auto Correlation: Find and display the strongest correlations between variables
                                                        <div className="absolute right-3 top-full border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                                                    </div>
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {plots.map((plot, index) => (
                                        <div key={plot.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden pb-5">
                                            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 p-4">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                        {plot.xVariable && plot.yVariable ? (
                                                            `${allVariables.find(v => v.value === plot.xVariable)?.label || plot.xVariable} vs. ${allVariables.find(v => v.value === plot.yVariable)?.label || plot.yVariable}`
                                                        ) : (
                                                            `Plot ${index + 1}`
                                                        )}
                                                    </h3>
                                                    {plots.length > 1 && (
                                                        <button
                                                            onClick={() => removePlot(plot.id)}
                                                            className="text-gray-400 hover:text-red-500 transition-colors"
                                                        >
                                                            <XIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 z-10">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            X-Axis Variable
                                                        </label>
                                                        <CustomSelect
                                                            value={plot.xVariable}
                                                            onChange={(value) => updatePlot(plot.id, { xVariable: value })}
                                                            options={getOptionsWithDisabled(plot.id, true)}
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                            Y-Axis Variable
                                                        </label>
                                                        <CustomSelect
                                                            value={plot.yVariable}
                                                            onChange={(value) => updatePlot(plot.id, { yVariable: value })}
                                                            options={getOptionsWithDisabled(plot.id, false)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            {plot.xVariable && plot.yVariable && (
                                                <div className="w-full" style={{ height: 300 }}>
                                                    <div className="flex items-center gap-2 px-5 py-1">
                                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={plot.showCorrelationLine}
                                                                onChange={(e) => updatePlot(plot.id, { showCorrelationLine: e.target.checked })}
                                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                            />
                                                            <span>Show Correlation Line</span>
                                                        </label>
                                                    </div>
                                                    <div className="w-full h-[calc(100%-40px)] p-5">
                                                        <ScatterPlot
                                                            data={data}
                                                            xVariable={plot.xVariable}
                                                            yVariable={plot.yVariable}
                                                            height={300}
                                                            showCorrelationLine={plot.showCorrelationLine}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Auto-generated plots section */}
                            {showAutoSection && (
                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                            Top Correlations
                                        </h2>
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            (Auto-generated)
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        {autoPlots.map((plot) => (
                                            <div key={plot.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
                                                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 p-3">
                                                    <div className="flex flex-col gap-2">
                                                        <div className="flex justify-between items-start">
                                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white pr-6">
                                                                {`${allVariables.find(v => v.value === plot.xVariable)?.label || plot.xVariable} vs. ${allVariables.find(v => v.value === plot.yVariable)?.label || plot.yVariable}`}
                                                            </h3>
                                                            <button
                                                                onClick={() => {
                                                                    const newAutoPlots = autoPlots.filter(p => p.id !== plot.id);
                                                                    setAutoPlots(newAutoPlots);
                                                                    if (newAutoPlots.length === 0) {
                                                                        setShowAutoSection(false);
                                                                    }
                                                                }}
                                                                className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                                                            >
                                                                <XIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-1.5 py-0.5 text-xs rounded-md bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/50">
                                                                Auto
                                                            </span>
                                                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                                                Correlation: {plot.correlation ? (plot.correlation * 100).toFixed(1) : 0}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="p-2">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={plot.showCorrelationLine}
                                                                onChange={(e) => {
                                                                    const newAutoPlots = autoPlots.map(p => 
                                                                        p.id === plot.id 
                                                                            ? { ...p, showCorrelationLine: e.target.checked }
                                                                            : p
                                                                    );
                                                                    setAutoPlots(newAutoPlots);
                                                                }}
                                                                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                                            />
                                                            <span>Show Correlation Line</span>
                                                        </label>
                                                    </div>
                                                    <div className="w-full" style={{ height: 300 }}>
                                                        <ScatterPlot
                                                            data={data}
                                                            xVariable={plot.xVariable}
                                                            yVariable={plot.yVariable}
                                                            height={300}
                                                            showCorrelationLine={plot.showCorrelationLine}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Correlation Matrix section */}
                            {data && (
                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        Correlation Matrix
                                    </h2>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
                                        <CorrelationMatrix data={data} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
} 