'use client';

import { useFile } from '../contexts/FileContext';
import { useState, useEffect, useCallback } from 'react';
import { ChevronLeftIcon, XIcon, Settings2Icon, DownloadIcon } from 'lucide-react';
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
import html2canvas from 'html2canvas';
import ReactModal from 'react-modal';

// Dynamically import all Plotly components with no SSR
const ScatterPlot = dynamic(
    () => import('@/components/visualizations/ScatterPlot').then(mod => mod.default),
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
    removeOutliers?: boolean;
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

// Add units mapping for axis labels
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

// Utility to export data as CSV
type CSVRow = Record<string, string | number | null | undefined>;
function exportCSV(filename: string, rows: CSVRow[]) {
    if (!rows.length) return;
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(',')].concat(
        rows.map(row => keys.map(k => JSON.stringify(row[k] ?? '')).join(','))
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

// Utility to get unique values for a metadata field
function getUniqueValues(data: ProcessedData, field: string): string[] {
    if (field === 'Sample Code') return Array.from(new Set(data.metadata.sampleCodes));
    if (field === 'Date') return Array.from(new Set(data.metadata.dates));
    // Add more fields as needed
    return [];
}

// Utility to filter data by group
function filterDataByGroup(data: ProcessedData, groupField: string, groupValue: string): ProcessedData {
    // Only support Sample Code and Date for now
    let indices: number[] = [];
    if (groupField === 'Sample Code') {
        indices = data.metadata.sampleCodes.map((v, i) => v === groupValue ? i : -1).filter(i => i !== -1);
    } else if (groupField === 'Date') {
        const datePairs = data.metadata.dates.map((v, i) => ({ v, i }));
        const filtered = datePairs.filter(pair => excelSerialToDate(pair.v) === excelSerialToDate(groupValue));
        filtered.sort((a, b) => Number(a.v) - Number(b.v));
        indices = filtered.map(pair => pair.i);
    }
    if (!indices.length) return data;
    // Helper to filter arrays by indices
    function filterArr<T>(arr: T[]): T[] {
        return indices.map(i => arr[i]);
    }
    
    return {
        metadata: {
            sampleCodes: filterArr(data.metadata.sampleCodes),
            dates: filterArr(data.metadata.dates),
            locations: {
                lat: filterArr(data.metadata.locations.lat),
                long: filterArr(data.metadata.locations.long),
            },
        },
        environmentalFactors: Object.fromEntries(
            Object.entries(data.environmentalFactors).map(([k, arr]) => [k, filterArr(arr)])
        ) as ProcessedData['environmentalFactors'],
        diversityIndices: Object.fromEntries(
            Object.entries(data.diversityIndices).map(([k, arr]) => [k, filterArr(arr)])
        ) as ProcessedData['diversityIndices'],
    };
}

const DEFAULT_IQR_MULTIPLIER = 3;

// Add a helper to convert Excel serial date to YYYY-MM-DD
function excelSerialToDate(serial: number | string): string {
    if (typeof serial === 'string' && serial.trim() === '') return '(blank)';
    const n = typeof serial === 'number' ? serial : Number(serial);
    if (!isFinite(n) || n <= 0) return '(blank)';
    // Excel's epoch starts at 1899-12-30
    const date = new Date(Math.round((n - 25569) * 86400 * 1000));
    // Format as YYYY-MM-DD
    return date.toISOString().slice(0, 10);
}

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
    const [plotGroupFilters, setPlotGroupFilters] = useState<{ [plotId: string]: { groupField: string, groupValue: string } }>({});
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [iqrMultiplier, setIqrMultiplier] = useState(DEFAULT_IQR_MULTIPLIER);
    const [downloadingChart, setDownloadingChart] = useState<{[plotId: string]: boolean}>({});
    const [downloadingData, setDownloadingData] = useState<{[plotId: string]: boolean}>({});
    // Track scroll position
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 40);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

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

                // Dynamically set temperature unit in VARIABLE_UNITS
                if (processed.detectedUnits && processed.detectedUnits.temperature) {
                    VARIABLE_UNITS['Avg Temperature'] = processed.detectedUnits.temperature === 'F' ? '°F' : '°C';
                    VARIABLE_UNITS['temperature'] = processed.detectedUnits.temperature === 'F' ? '°F' : '°C';
                }

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
                    showCorrelationLine: false,
                    removeOutliers: false,
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
            showCorrelationLine: false,
            removeOutliers: false,
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
            <div className="fixed top-2 max-w-[88rem] w-full z-20 -translate-x-1/2 left-1/2 px-2 sm:px-6">
                <div className="flex items-center gap-5 flex-wrap bg-neutral-100/50 dark:bg-neutral-900/50 border border-gray-200 dark:border-gray-800 p-2 rounded-lg backdrop-blur-sm">
                    <Link
                        href="/"
                        className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    >
                        <ChevronLeftIcon className="w-5 h-5 mr-2" />
                    </Link>
                    <h1 className="text-lg font-bold text-gray-900 dark:text-white">
                        Analysis
                    </h1>
                    {/* Top bar Add Plot and AC buttons (show when scrolled) */}
                    <div className="ml-auto flex items-center gap-2">
                        <div className={`transition-all duration-300 ${scrolled ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                            style={{ minWidth: 180 }}>
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
                                                showCorrelationLine: false,
                                                removeOutliers: false,
                                            }]);
                                        } else if (type === 'water' && availableEnv.length > 1) {
                                            // Water Chemistry: env vs env
                                            setPlots(prev => [...prev, {
                                                id: String(prev.length + 1),
                                                xVariable: availableEnv[0].value,
                                                yVariable: availableEnv[1].value,
                                                showCorrelationLine: false,
                                                removeOutliers: false,
                                            }]);
                                        } else if (type === 'diversity' && availableEnv.length > 0 && availableDiv.length > 0) {
                                            // Diversity: env vs diversity
                                            setPlots(prev => [...prev, {
                                                id: String(prev.length + 1),
                                                xVariable: availableEnv[0].value,
                                                yVariable: availableDiv[0].value,
                                                showCorrelationLine: false,
                                                removeOutliers: false,
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
                        <button
                            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => setSettingsOpen(true)}
                            aria-label="Settings"
                        >
                            <Settings2Icon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </div>
            <ReactModal
                isOpen={settingsOpen}
                onRequestClose={() => setSettingsOpen(false)}
                className="fixed inset-0 flex items-center justify-center z-50 outline-none"
                overlayClassName="fixed inset-0 bg-black/40 z-40"
                ariaHideApp={false}
            >
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md relative">
                    <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        onClick={() => setSettingsOpen(false)}
                        aria-label="Close"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                    <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Settings</h2>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Outlier Detection Threshold (IQR Multiplier)
                        </label>
                        <input
                            type="number"
                            min={1}
                            max={5}
                            step={0.1}
                            value={iqrMultiplier}
                            onChange={e => setIqrMultiplier(Number(e.target.value))}
                            className="w-full border rounded px-2 py-1 text-sm"
                        />
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Higher values remove fewer points as outliers. Default: 3
                        </div>
                    </div>
                </div>
            </ReactModal>
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
                                            <div className={`transition-all duration-300 ${scrolled ? 'opacity-0 -translate-y-2 pointer-events-none' : 'opacity-100 translate-y-0'}`}
                                                style={{ minWidth: 180 }}>
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
                                                                    showCorrelationLine: false,
                                                                    removeOutliers: false,
                                                                }]);
                                                            } else if (type === 'water' && availableEnv.length > 1) {
                                                                // Water Chemistry: env vs env
                                                                setPlots(prev => [...prev, {
                                                                    id: String(prev.length + 1),
                                                                    xVariable: availableEnv[0].value,
                                                                    yVariable: availableEnv[1].value,
                                                                    showCorrelationLine: false,
                                                                    removeOutliers: false,
                                                                }]);
                                                            } else if (type === 'diversity' && availableEnv.length > 0 && availableDiv.length > 0) {
                                                                // Diversity: env vs diversity
                                                                setPlots(prev => [...prev, {
                                                                    id: String(prev.length + 1),
                                                                    xVariable: availableEnv[0].value,
                                                                    yVariable: availableDiv[0].value,
                                                                    showCorrelationLine: false,
                                                                    removeOutliers: false,
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
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {plots.map((plot, index) => {
                                        // Use parent state for group filter
                                        const groupField = plotGroupFilters[plot.id]?.groupField || '';
                                        const groupValue = plotGroupFilters[plot.id]?.groupValue || '';
                                        const setGroupField = (val: string) => setPlotGroupFilters(prev => ({
                                            ...prev,
                                            [plot.id]: { ...prev[plot.id], groupField: val, groupValue: '' }
                                        }));
                                        const setGroupValue = (val: string) => setPlotGroupFilters(prev => ({
                                            ...prev,
                                            [plot.id]: { ...prev[plot.id], groupValue: val }
                                        }));
                                        // Available group fields
                                        const groupFields = ['Sample Code', 'Date'];
                                        // Only show group filter if a field is selected
                                        const groupValues = groupField ? getUniqueValues(data, groupField) : [];
                                        // Data to display (filtered if group selected)
                                        const filteredData = groupField && groupValue ? filterDataByGroup(data, groupField, groupValue) : data;
                                        // Download handlers
                                        const handleDownloadChart = async () => {
                                            setDownloadingChart(prev => ({ ...prev, [plot.id]: true }));
                                            await new Promise(resolve => setTimeout(resolve, 0));
                                            try {
                                                const chartDiv = document.getElementById(`plot-chart-${plot.id}`);
                                                if (!chartDiv) return;
                                                const canvas = await html2canvas(chartDiv);
                                                const url = canvas.toDataURL('image/png');
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `plot-${plot.xVariable}-vs-${plot.yVariable}.png`;
                                                a.click();
                                            } finally {
                                                setDownloadingChart(prev => ({ ...prev, [plot.id]: false }));
                                            }
                                        };
                                        const handleDownloadData = () => {
                                            setDownloadingData(prev => ({ ...prev, [plot.id]: true }));
                                            setTimeout(() => {
                                                try {
                                                    const xArr = getDataByVariable(filteredData, plot.xVariable);
                                                    const yArr = getDataByVariable(filteredData, plot.yVariable);
                                                    const rows = xArr.map((x, i) => ({
                                                        [plot.xVariable]: x,
                                                        [plot.yVariable]: yArr[i],
                                                        ...(filteredData.metadata.sampleCodes[i] && { 'Sample Code': filteredData.metadata.sampleCodes[i] })
                                                    }));
                                                    exportCSV(`data-${plot.xVariable}-vs-${plot.yVariable}.csv`, rows);
                                                } finally {
                                                    setTimeout(() => setDownloadingData(prev => ({ ...prev, [plot.id]: false })), 500);
                                                }
                                            }, 0);
                                        };
                                        return (
                                            <div key={plot.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden pb-5">
                                                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 p-2 sm:p-4">
                                                    <div className="flex justify-between items-center mb-4 flex-wrap gap-y-2">
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
                                                    {/* Controls Row: Group filter + Download buttons */}
                                                    <div className="flex flex-wrap gap-3 items-center mb-4 gap-y-2">
                                                        <div className="flex gap-2 items-center">
                                                            <select
                                                                className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
                                                                value={groupField}
                                                                onChange={e => { setGroupField(e.target.value); }}
                                                            >
                                                                <option value="">Filter by group...</option>
                                                                {groupFields.map(f => <option key={f} value={f}>{f}</option>)}
                                                            </select>
                                                            {groupField && (
                                                                <select
                                                                    className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
                                                                    value={groupValue}
                                                                    onChange={e => setGroupValue(e.target.value)}
                                                                >
                                                                    <option value="">Select {groupField}</option>
                                                                    {groupField === 'Date'
                                                                        ? [...groupValues].sort((a, b) => Number(a) - Number(b)).map((v, i) => (
                                                                            <option key={`${v}-${i}`} value={v}>
                                                                                {excelSerialToDate(v)}
                                                                            </option>
                                                                        ))
                                                                        : groupValues.map((v, i) => (
                                                                            <option key={`${v}-${i}`} value={v}>
                                                                                {v || '(blank)'}
                                                                            </option>
                                                                        ))}
                                                                </select>
                                                            )}
                                                        </div>
                                                        <div className="flex gap-2 ml-auto">
                                                            <button
                                                                onClick={handleDownloadChart}
                                                                className={`px-3 py-1 bg-blue-600 text-white rounded text-xs flex items-center ${downloadingChart[plot.id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                                disabled={downloadingChart[plot.id]}
                                                            >
                                                                {downloadingChart[plot.id] ? (
                                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                                ) : (
                                                                    <DownloadIcon className="w-4 h-4 mr-2" />
                                                                )}
                                                                Chart
                                                            </button>
                                                            <button
                                                                onClick={handleDownloadData}
                                                                className={`px-3 py-1 bg-green-600 text-white rounded text-xs flex items-center ${downloadingData[plot.id] ? 'opacity-60 cursor-not-allowed' : ''}`}
                                                                disabled={downloadingData[plot.id]}
                                                            >
                                                                {downloadingData[plot.id] ? (
                                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                                                                ) : (
                                                                    <DownloadIcon className="w-4 h-4 mr-2" />
                                                                )}
                                                                Data
                                                            </button>
                                                        </div>
                                                    </div>
                                                    {/* Variable selectors row */}
                                                    <div className="flex flex-col sm:flex-row gap-6 mb-2 w-full">
                                                        <div className="flex flex-col min-w-[180px] w-full sm:w-1/2">
                                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                                X-Axis Variable
                                                            </label>
                                                            <CustomSelect
                                                                value={plot.xVariable}
                                                                onChange={(value) => updatePlot(plot.id, { xVariable: value })}
                                                                options={getOptionsWithDisabled(plot.id, true)}
                                                            />
                                                        </div>
                                                        <div className="flex flex-col min-w-[180px] w-full sm:w-1/2">
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
                                                    <div className="w-full h-auto flex flex-col">
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
                                                            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer ml-4">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={plot.removeOutliers !== false}
                                                                    onChange={e => updatePlot(plot.id, { removeOutliers: e.target.checked })}
                                                                    className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                                                                />
                                                                <span>Remove Outliers</span>
                                                            </label>
                                                        </div>
                                                        <div className="w-full h-auto p-5" id={`plot-chart-${plot.id}`}> {/* Chart container for html2canvas */}
                                                            <ScatterPlot
                                                                data={filteredData}
                                                                xVariable={plot.xVariable}
                                                                yVariable={plot.yVariable}
                                                                height={300}
                                                                showCorrelationLine={plot.showCorrelationLine}
                                                                xUnit={VARIABLE_UNITS[plot.xVariable]}
                                                                yUnit={VARIABLE_UNITS[plot.yVariable]}
                                                                removeOutliers={plot.removeOutliers !== false}
                                                                iqrMultiplier={iqrMultiplier}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
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
                                                <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50 p-2 sm:p-3">
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
                                                            iqrMultiplier={iqrMultiplier}
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