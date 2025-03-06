'use client';

import { ArrowLeftIcon, FileSpreadsheetIcon, ChartBarIcon, BrainIcon, SettingsIcon, BookOpenIcon, CodeIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Section = 'user-guide' | 'technical';

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState<Section>('user-guide');
    const [activeSubsection, setActiveSubsection] = useState<string>('getting-started');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <nav className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-800">
                <div className="max-w-7xl mx-auto flex gap-5 items-center">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                        <ArrowLeftIcon className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Documentation
                    </h1>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto p-6">
                <div className="flex gap-6">
                    {/* Sidebar */}
                    <div className="w-64 flex-shrink-0">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => setActiveSection('user-guide')}
                                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                            activeSection === 'user-guide'
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <BookOpenIcon className="w-4 h-4 inline-block mr-1" />
                                        User Guide
                                    </button>
                                    <button
                                        onClick={() => setActiveSection('technical')}
                                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                            activeSection === 'technical'
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                    >
                                        <CodeIcon className="w-4 h-4 inline-block mr-1" />
                                        Technical
                                    </button>
                                </div>
                            </div>
                            <div className="p-4">
                                {activeSection === 'user-guide' ? (
                                    <nav className="space-y-1">
                                        <button
                                            onClick={() => setActiveSubsection('getting-started')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'getting-started'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Getting Started
                                        </button>
                                        <button
                                            onClick={() => setActiveSubsection('data-requirements')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'data-requirements'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Data Requirements
                                        </button>
                                        <button
                                            onClick={() => setActiveSubsection('analysis-modes')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'analysis-modes'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Analysis Modes
                                        </button>
                                        <button
                                            onClick={() => setActiveSubsection('step-by-step')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'step-by-step'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Step-by-Step Guide
                                        </button>
                                        <button
                                            onClick={() => setActiveSubsection('tips')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'tips'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Tips & Best Practices
                                        </button>
                                    </nav>
                                ) : (
                                    <nav className="space-y-1">
                                        <button
                                            onClick={() => setActiveSubsection('architecture')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'architecture'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Architecture Overview
                                        </button>
                                        <button
                                            onClick={() => setActiveSubsection('components')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'components'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Components
                                        </button>
                                        <button
                                            onClick={() => setActiveSubsection('utils')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'utils'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Utilities
                                        </button>
                                        <button
                                            onClick={() => setActiveSubsection('contexts')}
                                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                                                activeSubsection === 'contexts'
                                                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            Contexts
                                        </button>
                                    </nav>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                            <div className="p-8">
                                {activeSection === 'user-guide' ? (
                                    // User Guide Content
                                    <div className="space-y-8">
                                        {activeSubsection === 'getting-started' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Getting Started with Beetlejuice eDNA
                                                </h2>
                                                <p className="text-gray-600 dark:text-gray-300">
                                                    Beetlejuice eDNA is a powerful tool designed to help you analyze environmental DNA data. 
                                                    It provides intuitive visualization and analysis capabilities, making it easy to explore 
                                                    relationships between environmental factors and biodiversity metrics.
                                                </p>
                                            </section>
                                        )}

                                        {activeSubsection === 'data-requirements' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Data Requirements
                                                </h2>
                                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/40">
                                                            <FileSpreadsheetIcon className="w-6 h-6 text-blue-500" />
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-3">
                                                                Excel File Format
                                                            </h3>
                                                            <ul className="space-y-2 text-blue-800 dark:text-blue-200">
                                                                <li className="flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                    File must be in .xlsx format
                                                                </li>
                                                                <li className="flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                    First row should contain column headers
                                                                </li>
                                                                <li className="flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                    Data should be organized in columns
                                                                </li>
                                                                <li className="flex items-center gap-2">
                                                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                    No empty rows or columns between data
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {activeSubsection === 'analysis-modes' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Analysis Modes
                                                </h2>
                                                <div className="grid gap-6">
                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                                                <SettingsIcon className="w-6 h-6 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    Template Mode
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Uses predefined column mappings for standard environmental and diversity metrics. 
                                                                    Best for data that follows the expected template format.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                                                <BrainIcon className="w-6 h-6 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    Template + Auto Detection
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Combines template mapping with automatic column detection. 
                                                                    Helps identify additional columns that might not match the template exactly.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700">
                                                                <ChartBarIcon className="w-6 h-6 text-gray-500" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    Full Auto Detection
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Automatically detects and classifies all columns in your data. 
                                                                    Best for non-standard data formats or when you&apos;re unsure about column types.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {activeSubsection === 'step-by-step' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Step-by-Step Guide
                                                </h2>
                                                <div className="space-y-6">
                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                                            1
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                Select Analysis Mode
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-300">
                                                                Choose the analysis mode that best fits your data. If you&apos;re unsure, 
                                                                start with Template + Auto Detection for the best balance of guidance and flexibility.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                                            2
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                Upload Your Data
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-300">
                                                                Drag and drop your Excel file into the upload area or click to select a file. 
                                                                The file will be processed automatically.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                                            3
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                Review Detected Columns
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-300">
                                                                In auto-detection modes, review the detected columns and their classifications. 
                                                                You can edit the type of any column if needed.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                                            4
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                Explore Your Data
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-300">
                                                                Use the interactive plots to explore relationships between variables. 
                                                                Add new plots, switch variables, and view statistical summaries.
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex-shrink-0 w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center font-bold text-lg">
                                                            5
                                                        </div>
                                                        <div>
                                                            <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                Analyze Relationships
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-300">
                                                                Use the correlation matrix and auto-generated plots to identify significant 
                                                                relationships between environmental factors and diversity indices.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {activeSubsection === 'tips' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Tips and Best Practices
                                                </h2>
                                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                                                    <ul className="space-y-3 text-green-800 dark:text-green-200">
                                                        <li className="flex items-start gap-3">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                                                            <span>Ensure your data is clean and properly formatted before uploading</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                                                            <span>Use descriptive column headers to help with auto-detection</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                                                            <span>Review the confidence scores for auto-detected columns</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                                                            <span>Start with a single plot and gradually add more as needed</span>
                                                        </li>
                                                        <li className="flex items-start gap-3">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                                                            <span>Use the auto-generated plots to discover unexpected relationships</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                ) : (
                                    // Technical Documentation Content
                                    <div className="space-y-8">
                                        {activeSubsection === 'architecture' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Architecture Overview
                                                </h2>
                                                <div className="space-y-6">
                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            Project Structure
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                            The application is built using Next.js 13+ with the App Router, following a modern 
                                                            component-based architecture. The codebase is organized into several key directories:
                                                        </p>
                                                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-sm">/src/app</code> - Next.js app router pages and layouts
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-sm">/src/components</code> - Reusable React components
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-sm">/src/utils</code> - Utility functions and data processing
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-lg text-sm">/src/contexts</code> - React context providers
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            Key Technologies
                                                        </h3>
                                                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                Next.js 13+ with App Router
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                React with TypeScript
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                Tailwind CSS for styling
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                Plotly.js for data visualization
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                                                                XLSX.js for Excel file processing
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {activeSubsection === 'components' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Components
                                                </h2>
                                                <div className="space-y-6">
                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            Core Components
                                                        </h3>
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    ScatterPlot
                                                                </h4>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    A reusable component for creating interactive scatter plots using Plotly.js. 
                                                                    Handles data visualization, theme switching, and responsive sizing.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    CorrelationMatrix
                                                                </h4>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Displays correlation relationships between variables in a heatmap format. 
                                                                    Provides interactive tooltips and color-coded visualization.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    AutoDetectionConfirmation
                                                                </h4>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Modal component for reviewing and confirming auto-detected columns. 
                                                                    Allows users to edit column types and confidence scores.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {activeSubsection === 'utils' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Utilities
                                                </h2>
                                                <div className="space-y-6">
                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            Data Processing
                                                        </h3>
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    dataProcessing.ts
                                                                </h4>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Handles Excel file processing, data normalization, and statistical calculations. 
                                                                    Includes functions for data validation and error handling.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    autoDetect.ts
                                                                </h4>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Implements column type detection algorithms using pattern matching and 
                                                                    confidence scoring. Supports both template-based and full auto-detection modes.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    statistics.ts
                                                                </h4>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Provides statistical analysis functions including correlation calculations, 
                                                                    significance testing, and data summarization.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {activeSubsection === 'contexts' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Contexts
                                                </h2>
                                                <div className="space-y-6">
                                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            State Management
                                                        </h3>
                                                        <div className="space-y-6">
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    FileContext
                                                                </h4>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Manages the uploaded Excel file state across components. 
                                                                    Handles file validation and processing.
                                                                </p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    AnalysisModeContext
                                                                </h4>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Controls the current analysis mode (template, template-auto, or full-auto). 
                                                                    Persists mode selection in localStorage.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </section>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 