'use client';

import { useFile } from '../contexts/FileContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeftIcon, PlusIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { ProcessedData, processExcelFile } from '@/utils/dataProcessing';
import { CorrelationMatrix } from '@/components/visualizations/CorrelationMatrix';
import { ScatterPlot } from '@/components/visualizations/ScatterPlot';
import { CustomSelect } from '@/components/ui/CustomSelect';
import { calculateCorrelation } from '@/utils/statistics';
import { getDataByVariable } from '@/utils/dataAccess';

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
}

interface SignificantRelationship {
    envVar: typeof ALL_VARIABLES[0];
    divVar: typeof ALL_VARIABLES[0];
    correlation: number;
}

// Add statistical calculation functions
const calculateStats = (data: number[]) => {
    const sorted = [...data].sort((a, b) => a - b);
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const median = sorted[Math.floor(data.length / 2)];
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const stdDev = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);
    
    return {
        mean: mean.toFixed(3),
        median: median.toFixed(3),
        range: `${min.toFixed(3)} - ${max.toFixed(3)}`,
        stdDev: stdDev.toFixed(3)
    };
};

export default function AnalysisPage() {
    const { file } = useFile();
    const [data, setData] = useState<ProcessedData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAutoPlots, setShowAutoPlots] = useState(false);
    const [significantRelationships, setSignificantRelationships] = useState<SignificantRelationship[]>([]);
    const [plots, setPlots] = useState<PlotConfig[]>([
        { id: '1', xVariable: 'Avg Temperature', yVariable: 'Shannon diversity index' }
    ]);
    const autoSectionRef = useRef<HTMLDivElement>(null);

    const findSignificantRelationships = useCallback(() => {
        if (!data) return;
        const relationships: SignificantRelationship[] = [];
        const envFactors = ALL_VARIABLES.filter(v => v.group === 'Environmental Factors');
        const divIndices = ALL_VARIABLES.filter(v => v.group === 'Diversity Indices');

        envFactors.forEach(envVar => {
            const envData = getDataByVariable(data, envVar.value);
            divIndices.forEach(divVar => {
                const divData = getDataByVariable(data, divVar.value);
                const correlation = Math.abs(calculateCorrelation(envData, divData));
                relationships.push({ envVar, divVar, correlation });
            });
        });

        const topRelationships = relationships
            .sort((a, b) => b.correlation - a.correlation)
            .slice(0, 5);

        setSignificantRelationships(topRelationships);
    }, [data]);

    useEffect(() => {
        if (data) {
            findSignificantRelationships();
        }
    }, [data, findSignificantRelationships]);

    useEffect(() => {
        if (!file) {
            // Redirect to home if no file is uploaded
            window.location.href = '/';
            return;
        }

        const loadData = async () => {
            setLoading(true);
            try {
                // Add artificial delay of 2 seconds along with data processing
                const [processed] = await Promise.all([
                    processExcelFile(file),
                    new Promise(resolve => setTimeout(resolve, 2000))
                ]);
                setData(processed);
            } catch (error) {
                console.error('Error processing file:', error);
            } finally {
                setLoading(false);
                // Clear the analyzing state from localStorage
                localStorage.removeItem('isAnalyzing');
            }
        };

        loadData();
    }, [file]);

    // Check localStorage for analyzing state on mount
    useEffect(() => {
        const isAnalyzing = localStorage.getItem('isAnalyzing');
        if (isAnalyzing === 'true') {
            setLoading(true);
        }
    }, []);  // Keep empty array for mount-only effect

    const addNewPlot = () => {
        const newId = (plots.length + 1).toString();
        const preset = (document.querySelector('select') as HTMLSelectElement)?.value;

        // Get currently used variables
        const usedCombinations = plots.map(plot => `${plot.xVariable}-${plot.yVariable}`);

        let newPlot: PlotConfig;
        if (preset === 'diversity') {
            // Define possible diversity combinations
            const diversityCombinations = [
                { x: 'pH', y: 'Shannon diversity index' },
                { x: 'Avg Temperature', y: 'Richness' },
                { x: 'Elevation', y: "Simpson's index" },
                { x: 'Total alkalinity ', y: "Pielou's evenness" },
                { x: 'Phosphate', y: "Fisher's alpha" },
                { x: 'Nitrate  ', y: 'Effective number of species' }
            ];

            // Find first combination that isn't already used
            const newCombination = diversityCombinations.find(combo =>
                !usedCombinations.includes(`${combo.x}-${combo.y}`) &&
                !usedCombinations.includes(`${combo.y}-${combo.x}`)
            ) || diversityCombinations[0];

            newPlot = {
                id: newId,
                xVariable: newCombination.x,
                yVariable: newCombination.y
            };
        } else if (preset === 'water') {
            // Define possible water chemistry combinations
            const chemistryCombinations = [
                { x: 'pH', y: 'Total alkalinity ' },
                { x: 'Nitrate  ', y: 'Phosphate' },
                { x: 'Free chlorine', y: 'pH' },
                { x: 'Carbonate ', y: 'Total alkalinity ' },
                { x: 'General hardness (calcium carbonate)', y: 'pH' },
                { x: 'Nitrite ', y: 'Nitrate  ' }
            ];

            // Find first combination that isn't already used
            const newCombination = chemistryCombinations.find(combo =>
                !usedCombinations.includes(`${combo.x}-${combo.y}`) &&
                !usedCombinations.includes(`${combo.y}-${combo.x}`)
            ) || chemistryCombinations[0];

            newPlot = {
                id: newId,
                xVariable: newCombination.x,
                yVariable: newCombination.y
            };
        } else {
            // Custom: Choose variables that aren't currently being used
            const usedVariables = plots.map(plot => [plot.xVariable, plot.yVariable]).flat();
            const unusedVariables = ALL_VARIABLES.filter(v => !usedVariables.includes(v.value));

            newPlot = {
                id: newId,
                xVariable: unusedVariables[0]?.value || ALL_VARIABLES[0].value,
                yVariable: unusedVariables[1]?.value || ALL_VARIABLES[4].value
            };
        }

        setPlots([...plots, newPlot]);
    };

    const removePlot = (id: string) => {
        setPlots(plots.filter(plot => plot.id !== id));
    };

    const updatePlot = (id: string, field: 'xVariable' | 'yVariable', value: string) => {
        // Get the current plot
        const currentPlot = plots.find(p => p.id === id);
        if (!currentPlot) return;

        // Get the other variable (if updating x, get y, and vice versa)
        const otherField = field === 'xVariable' ? 'yVariable' : 'xVariable';
        const otherValue = currentPlot[otherField];

        // Get the variable groups
        const newVarGroup = ALL_VARIABLES.find(v => v.value === value)?.group;
        const otherVarGroup = ALL_VARIABLES.find(v => v.value === otherValue)?.group;

        // Check if both variables are from the same group
        const warning = newVarGroup && otherVarGroup && newVarGroup === otherVarGroup
            ? `Note: Comparing two ${newVarGroup.toLowerCase()} may not provide meaningful insights`
            : undefined;

        // Update the plot with warning if needed
        setPlots(prevPlots =>
            prevPlots.map(plot =>
                plot.id === id
                    ? { ...plot, [field]: value, warning }
                    : plot
            )
        );
    };

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
            <nav className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto flex gap-5 items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Analysis Results
                    </h1>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="col-span-1 lg:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <div>
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Interactive Plots
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Create scatter plots to visualize relationships between variables
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                                >
                                    <option value="custom">Custom Plots</option>
                                    <option value="diversity">Diversity Analysis</option>
                                    <option value="water">Water Chemistry</option>
                                </select>
                                <button
                                    onClick={addNewPlot}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                >
                                    <PlusIcon className="w-4 h-4" />
                                    Add Plot
                                </button>
                                <button
                                    onClick={() => {
                                        setShowAutoPlots(!showAutoPlots);
                                        // If we're showing the plots, scroll to them after they render
                                        if (!showAutoPlots) {
                                            setTimeout(() => {
                                                autoSectionRef.current?.scrollIntoView({ 
                                                    behavior: 'smooth',
                                                    block: 'start'
                                                });
                                            }, 100);
                                        }
                                    }}
                                    className={`inline-flex items-center gap-2 px-4 py-2 ${
                                        showAutoPlots 
                                            ? 'bg-green-500 hover:bg-green-600' 
                                            : 'bg-blue-500 hover:bg-blue-600'
                                    } text-white rounded-md transition-colors`}
                                >
                                    <span className="inline-flex items-center justify-center border-2 border-current text-[10px] font-bold px-1 leading-none h-[16px]">
                                        AUTO
                                    </span>
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {plots.map((plot) => (
                                <div key={plot.id} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between items-center">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Plot {plot.id}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => {
                                                    // Store current variables
                                                    const currentX = plot.xVariable;
                                                    const currentY = plot.yVariable;

                                                    // Update plot with swapped variables
                                                    updatePlot(plot.id, 'xVariable', currentY);
                                                    updatePlot(plot.id, 'yVariable', currentX);
                                                }}
                                                className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-500 transition-colors text-sm bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded"
                                                title="Switch X and Y axes"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                    <path d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Switch Axes
                                            </button>
                                            {plots.length > 1 && (
                                                <button
                                                    onClick={() => removePlot(plot.id)}
                                                    className="text-gray-500 hover:text-red-500 transition-colors"
                                                    title="Remove plot"
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="mb-4 flex gap-4">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    X-Axis Variable
                                                </label>
                                                <CustomSelect
                                                    value={plot.xVariable}
                                                    onChange={(value) => updatePlot(plot.id, 'xVariable', value)}
                                                    options={ALL_VARIABLES}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Y-Axis Variable
                                                </label>
                                                <CustomSelect
                                                    value={plot.yVariable}
                                                    onChange={(value) => updatePlot(plot.id, 'yVariable', value)}
                                                    options={ALL_VARIABLES}
                                                />
                                            </div>
                                        </div>
                                        {plot.warning && (
                                            <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg p-3">
                                                {plot.warning}
                                            </div>
                                        )}
                                        <ScatterPlot
                                            data={data}
                                            xVariable={plot.xVariable}
                                            yVariable={plot.yVariable}
                                        />
                                        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                    {plot.xVariable} Statistics
                                                </h4>
                                                {data && (() => {
                                                    const stats = calculateStats(getDataByVariable(data, plot.xVariable));
                                                    return (
                                                        <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                                            <div>Mean: {stats.mean}</div>
                                                            <div>Median: {stats.median}</div>
                                                            <div>Range: {stats.range}</div>
                                                            <div>Std Dev: {stats.stdDev}</div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                    {plot.yVariable} Statistics
                                                </h4>
                                                {data && (() => {
                                                    const stats = calculateStats(getDataByVariable(data, plot.yVariable));
                                                    return (
                                                        <div className="space-y-1 text-gray-600 dark:text-gray-400">
                                                            <div>Mean: {stats.mean}</div>
                                                            <div>Median: {stats.median}</div>
                                                            <div>Range: {stats.range}</div>
                                                            <div>Std Dev: {stats.stdDev}</div>
                                                        </div>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Auto-generated Plots Section */}
                    {showAutoPlots && (
                        <div 
                            ref={autoSectionRef}
                            className="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mt-4"
                        >
                            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                    Most Significant Relationships
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Top 5 strongest correlations between environmental factors and diversity indices
                                </p>
                            </div>
                            <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {significantRelationships.map(({ envVar, divVar, correlation }, index) => (
                                        <div 
                                            key={`${envVar.value}-${divVar.value}`} 
                                            className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4"
                                        >
                                            <div className="mb-3">
                                                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                                                    Relationship #{index + 1}
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                                    Correlation: {(correlation * 100).toFixed(1)}%
                                                </div>
                                                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                                                    {correlation > 0.7 ? 'Strong positive correlation' :
                                                     correlation < -0.7 ? 'Strong negative correlation' :
                                                     correlation > 0.5 ? 'Moderate positive correlation' :
                                                     correlation < -0.5 ? 'Moderate negative correlation' :
                                                     'Weak correlation'}
                                                </div>
                                            </div>
                                            <ScatterPlot
                                                data={data}
                                                xVariable={envVar.value}
                                                yVariable={divVar.value}
                                                size={{ width: 300, height: 300 }}
                                            />
                                            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="font-medium mb-1">What this means:</div>
                                                <p>
                                                    Changes in {envVar.label.toLowerCase()} are {
                                                        correlation > 0 ? 'positively' : 'negatively'
                                                    } associated with changes in {divVar.label.toLowerCase()}.
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 col-span-2">
                        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                Correlation Matrix
                            </h2>
                        </div>
                        <div className="p-4 w-full flex flex-col gap-4">
                            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-sm text-blue-700 dark:text-blue-300">
                                <h3 className="font-medium mb-2">Understanding the Correlation Matrix</h3>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Values range from -1 to 1</li>
                                    <li>1 indicates a perfect positive correlation</li>
                                    <li>-1 indicates a perfect negative correlation</li>
                                    <li>0 indicates no correlation</li>
                                    <li>Look for strong correlations ({'>'}0.7 or {'<'}-0.7) to form hypotheses</li>
                                </ul>
                            </div>
                            <CorrelationMatrix data={data} />
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 col-span-2">
                        <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                Raw Data
                            </h2>
                        </div>
                        <div className="p-4">
                            {/* Add data table here */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 