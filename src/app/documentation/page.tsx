'use client';

import { ArrowLeftIcon, FileSpreadsheetIcon, ChartBarIcon, BrainIcon, SettingsIcon, BookOpenIcon, CodeIcon, ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type Section = 'user-guide' | 'technical';

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState<Section>('user-guide');
    const [activeSubsection, setActiveSubsection] = useState<string>('getting-started');

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 z-10 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Back to Home
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Documentation
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-6">
                        {/* Sidebar */}
                        <div className="w-64 flex-shrink-0">
                            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 sticky top-24">
                                <div className="flex flex-col gap-2 mb-6">
                                    <button
                                        onClick={() => setActiveSection('user-guide')}
                                        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                                            activeSection === 'user-guide'
                                                ? 'bg-blue-500 text-white'
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
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
                                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                        }`}
                                    >
                                        <CodeIcon className="w-4 h-4 inline-block mr-1" />
                                        Technical
                                    </button>
                                </div>

                                <nav className="space-y-1">
                                    {activeSection === 'user-guide' ? (
                                        <>
                                            <button
                                                onClick={() => setActiveSubsection('getting-started')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'getting-started'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Getting Started
                                                {activeSubsection === 'getting-started' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveSubsection('data-requirements')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'data-requirements'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Data Requirements
                                                {activeSubsection === 'data-requirements' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveSubsection('analysis-modes')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'analysis-modes'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Analysis Modes
                                                {activeSubsection === 'analysis-modes' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveSubsection('step-by-step')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'step-by-step'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Step-by-Step Guide
                                                {activeSubsection === 'step-by-step' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveSubsection('tips')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'tips'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Tips & Best Practices
                                                {activeSubsection === 'tips' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setActiveSubsection('architecture')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'architecture'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Architecture Overview
                                                {activeSubsection === 'architecture' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveSubsection('components')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'components'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Components
                                                {activeSubsection === 'components' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveSubsection('utils')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'utils'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Utilities
                                                {activeSubsection === 'utils' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                            <button
                                                onClick={() => setActiveSubsection('contexts')}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center justify-between ${
                                                    activeSubsection === 'contexts'
                                                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-700/50'
                                                }`}
                                            >
                                                Contexts
                                                {activeSubsection === 'contexts' && (
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </nav>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="flex-1">
                            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-8 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50">
                                {activeSection === 'user-guide' ? (
                                    // User Guide Content
                                    <div className="space-y-8">
                                        {activeSubsection === 'getting-started' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Getting Started with Beetlejuice eDNA
                                                </h2>
                                                <div className="prose dark:prose-invert max-w-none">
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Welcome to Beetlejuice eDNA, your comprehensive tool for analyzing environmental DNA data. 
                                                        This guide will help you get started with analyzing your data and exploring relationships 
                                                        between environmental factors and biodiversity metrics.
                                                    </p>
                                                    <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                                        <h3 className="text-lg font-medium text-blue-900 dark:text-blue-100 mb-2">
                                                            Quick Start
                                                        </h3>
                                                        <ol className="list-decimal list-inside space-y-2 text-blue-800 dark:text-blue-200">
                                                            <li>Upload your Excel file with environmental and diversity data</li>
                                                            <li>Choose an analysis mode based on your data format</li>
                                                            <li>Review and confirm detected columns</li>
                                                            <li>Explore relationships through interactive visualizations</li>
                                                        </ol>
                                                    </div>
                                                </div>
                                            </section>
                                        )}

                                        {activeSubsection === 'data-requirements' && (
                                            <section>
                                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                                    Data Requirements
                                                </h2>
                                                <div className="grid gap-6">
                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-blue-100/50 dark:bg-blue-900/50">
                                                                <FileSpreadsheetIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                                                                    Excel File Format
                                                                </h3>
                                                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
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

                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-green-100/50 dark:bg-green-900/50">
                                                                <ChartBarIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                                                                    Data Types
                                                                </h3>
                                                                <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                                                    <li className="flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                        Environmental parameters (temperature, pH, etc.)
                                                                    </li>
                                                                    <li className="flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                        Diversity indices (Shannon, Simpson, etc.)
                                                                    </li>
                                                                    <li className="flex items-center gap-2">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                        Taxonomic data (species counts, abundances)
                                                                    </li>
                                                                </ul>
                                                            </div>
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
                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-blue-100/50 dark:bg-blue-900/50">
                                                                <SettingsIcon className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    Template Mode
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Uses predefined column mappings for standard environmental and diversity metrics. 
                                                                    Best for data that follows the expected template format.
                                                                </p>
                                                                <div className="mt-4">
                                                                    <span className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/50 rounded-lg px-2 py-0.5">
                                                                        Recommended for standard data formats
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-purple-100/50 dark:bg-purple-900/50">
                                                                <BrainIcon className="w-6 h-6 text-purple-500 dark:text-purple-400" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    Template + Auto Detection
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Combines template mapping with automatic column detection. 
                                                                    Helps identify additional columns that might not match the template exactly.
                                                                </p>
                                                                <div className="mt-4">
                                                                    <span className="text-xs text-purple-500 hover:text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/50 rounded-lg px-2 py-0.5">
                                                                        Best balance of guidance and flexibility
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <div className="flex items-start gap-4">
                                                            <div className="p-3 rounded-lg bg-green-100/50 dark:bg-green-900/50">
                                                                <ChartBarIcon className="w-6 h-6 text-green-500 dark:text-green-400" />
                                                            </div>
                                                            <div>
                                                                <h3 className="font-medium text-gray-900 dark:text-white mb-2">
                                                                    Full Auto Detection
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-300">
                                                                    Automatically detects and classifies all columns in your data. 
                                                                    Best for non-standard data formats or when you&apos;re unsure about column types.
                                                                </p>
                                                                <div className="mt-4">
                                                                    <span className="text-xs text-green-500 hover:text-green-600 dark:text-green-400 bg-green-100/50 dark:bg-green-900/50 rounded-lg px-2 py-0.5">
                                                                        Most flexible for custom data formats
                                                                    </span>
                                                                </div>
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
                                                <div className="grid gap-6">
                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            Data Preparation
                                                        </h3>
                                                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                                            <li className="flex items-start gap-3">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                                                                <span>Ensure your data is clean and properly formatted before uploading</span>
                                                            </li>
                                                            <li className="flex items-start gap-3">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                                                                <span>Use descriptive column headers to help with auto-detection</span>
                                                            </li>
                                                            <li className="flex items-start gap-3">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2"></span>
                                                                <span>Remove any unnecessary formatting or special characters</span>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            Analysis Tips
                                                        </h3>
                                                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                                            <li className="flex items-start gap-3">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                                                                <span>Start with a single plot and gradually add more as needed</span>
                                                            </li>
                                                            <li className="flex items-start gap-3">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                                                                <span>Use the auto-generated plots to discover unexpected relationships</span>
                                                            </li>
                                                            <li className="flex items-start gap-3">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></span>
                                                                <span>Review the confidence scores for auto-detected columns</span>
                                                            </li>
                                                        </ul>
                                                    </div>
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
                                                <div className="grid gap-6">
                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            Project Structure
                                                        </h3>
                                                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                            The application is built using Next.js 13+ with the App Router, following a modern 
                                                            component-based architecture. The codebase is organized into several key directories:
                                                        </p>
                                                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                <code className="bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-lg text-sm">/src/app</code> - Next.js app router pages and layouts
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                <code className="bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-lg text-sm">/src/components</code> - Reusable React components
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                <code className="bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-lg text-sm">/src/utils</code> - Utility functions and data processing
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                                                <code className="bg-gray-100/50 dark:bg-gray-700/50 px-2 py-1 rounded-lg text-sm">/src/contexts</code> - React context providers
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                                                        <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                                                            Key Technologies
                                                        </h3>
                                                        <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                Next.js 13+ with App Router
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                React with TypeScript
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                Tailwind CSS for styling
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                                Plotly.js for data visualization
                                                            </li>
                                                            <li className="flex items-center gap-2">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
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
                                                <div className="grid gap-6">
                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
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
                                                <div className="grid gap-6">
                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
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
                                                <div className="grid gap-6">
                                                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
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

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 w-full p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Developed by <Link href="https://www.uwyo.edu/wyominginbre/index.html" target="_blank" className="text-gray-900 dark:text-white hover:underline">Wyoming INBRE</Link> and <Link href="https://www.lccc.wy.edu" target="_blank" className="text-gray-900 dark:text-white hover:underline">Laramie County Community College</Link></p>
                </div>
            </footer>
        </div>
    );
} 