'use client';

import { ArrowLeftIcon, FileSpreadsheetIcon, ChartBarIcon, BrainIcon, SettingsIcon, ChevronRightIcon, ChevronDownIcon, MenuIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type GuideSection = 'getting-started' | 'data-requirements' | 'analysis-modes' | 'step-by-step' | 'tips';

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState<GuideSection>('getting-started');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const sections = {
        'getting-started': {
            title: 'Getting Started',
            subsections: ['Overview', 'Quick Start Guide']
        },
        'data-requirements': {
            title: 'Data Requirements',
            subsections: ['File Format', 'Data Types']
        },
        'analysis-modes': {
            title: 'Analysis Modes',
            subsections: ['Template Mode', 'Template + Auto Detection', 'Full Auto Detection']
        },
        'step-by-step': {
            title: 'Step-by-Step Guide',
            subsections: ['Select Mode', 'Upload Data', 'Review Columns', 'Explore Data', 'Analyze Relationships']
        },
        'tips': {
            title: 'Tips & Best Practices',
            subsections: ['Data Preparation', 'Analysis Tips']
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            {/* Header */}
            <div className="fixed top-0 left-0 w-full p-4 bg-white dark:bg-gray-900 z-20 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                        >
                            <MenuIcon className="w-5 h-5" />
                        </button>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Documentation
                        </h1>
                    </div>
                    {/* Page Navigator */}
                    <div className="hidden lg:block">
                        <select
                            value={activeSection}
                            onChange={(e) => setActiveSection(e.target.value as GuideSection)}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700"
                        >
                            {Object.entries(sections).map(([key, { title }]) => (
                                <option key={key} value={key}>{title}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="fixed top-16 left-0 w-full p-2 bg-gray-50 dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                            Home
                        </Link>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">Documentation</span>
                        <ChevronRightIcon className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{sections[activeSection].title}</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="pt-28 pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-8">
                        {/* Sidebar Navigation */}
                        <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                            <div className="h-full overflow-y-auto pt-20 pb-16">
                                <nav className="px-4">
                                    {Object.entries(sections).map(([key, { title, subsections }]) => (
                                        <div key={key} className="mb-4">
                                            <button
                                                onClick={() => setActiveSection(key as GuideSection)}
                                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                                                    activeSection === key
                                                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                                }`}
                                            >
                                                {title}
                                                <ChevronDownIcon className={`w-4 h-4 transition-transform ${activeSection === key ? 'rotate-180' : ''}`} />
                                            </button>
                                            {activeSection === key && (
                                                <div className="ml-4 mt-2 space-y-1">
                                                    {subsections.map((subsection) => (
                                                        <a
                                                            key={subsection}
                                                            href={`#${subsection.toLowerCase().replace(/\s+/g, '-')}`}
                                                            className="block px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                                                        >
                                                            {subsection}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </nav>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 lg:ml-64">
                            <div className="prose dark:prose-invert max-w-none">
                                {activeSection === 'getting-started' && (
                                    <div className="space-y-8">
                                        <section id="overview">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Overview
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Welcome to Beetlejuice eDNA, your comprehensive tool for analyzing environmental DNA data. 
                                                This guide will help you get started with analyzing your data and exploring relationships 
                                                between environmental factors and biodiversity metrics.
                                            </p>
                                        </section>

                                        <section id="quick-start-guide">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Quick Start Guide
                                            </h2>
                                            <ol className="space-y-4 text-gray-600 dark:text-gray-300">
                                                <li>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">Upload Your Data</h3>
                                                    <p>Upload your Excel file containing environmental and diversity data.</p>
                                                </li>
                                                <li>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">Choose Analysis Mode</h3>
                                                    <p>Select the analysis mode that best fits your data format.</p>
                                                </li>
                                                <li>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">Review Detections</h3>
                                                    <p>Review and confirm the detected columns in your data.</p>
                                                </li>
                                                <li>
                                                    <h3 className="font-medium text-gray-900 dark:text-white">Explore Relationships</h3>
                                                    <p>Use interactive visualizations to explore relationships between variables.</p>
                                                </li>
                                            </ol>
                                        </section>
                                    </div>
                                )}

                                {activeSection === 'data-requirements' && (
                                    <div className="space-y-8">
                                        <section id="file-format">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                File Format
                                            </h2>
                                            <div className="flex items-start gap-4 mb-4">
                                                <FileSpreadsheetIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" />
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                        Your data must be provided in an Excel file (.xlsx format) with the following requirements:
                                                    </p>
                                                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                                        <li className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                            <span>First row should contain column headers</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                            <span>Data should be organized in columns</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                            <span>No empty rows or columns between data</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </section>

                                        <section id="data-types">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Data Types
                                            </h2>
                                            <div className="flex items-start gap-4">
                                                <ChartBarIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" />
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                                                        The tool supports the following types of data:
                                                    </p>
                                                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                                        <li className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                            <span>Environmental parameters (temperature, pH, etc.)</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                            <span>Diversity indices (Shannon, Simpson, etc.)</span>
                                                        </li>
                                                        <li className="flex items-start gap-2">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                            <span>Taxonomic data (species counts, abundances)</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeSection === 'analysis-modes' && (
                                    <div className="space-y-8">
                                        <section id="template-mode">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Template Mode
                                            </h2>
                                            <div className="flex items-start gap-4">
                                                <SettingsIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" />
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Uses predefined column mappings for standard environmental and diversity metrics. 
                                                        Best for data that follows the expected template format.
                                                    </p>
                                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        Recommended for standard data formats
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        <section id="template-auto-detection">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Template + Auto Detection
                                            </h2>
                                            <div className="flex items-start gap-4">
                                                <BrainIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" />
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Combines template mapping with automatic column detection. 
                                                        Helps identify additional columns that might not match the template exactly.
                                                    </p>
                                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        Best balance of guidance and flexibility
                                                    </p>
                                                </div>
                                            </div>
                                        </section>

                                        <section id="full-auto-detection">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Full Auto Detection
                                            </h2>
                                            <div className="flex items-start gap-4">
                                                <ChartBarIcon className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-1" />
                                                <div>
                                                    <p className="text-gray-600 dark:text-gray-300">
                                                        Automatically detects and classifies all columns in your data. 
                                                        Best for non-standard data formats or when you&apos;re unsure about column types.
                                                    </p>
                                                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                        Most flexible for custom data formats
                                                    </p>
                                                </div>
                                            </div>
                                        </section>
                                    </div>
                                )}

                                {activeSection === 'step-by-step' && (
                                    <div className="space-y-8">
                                        <section id="select-mode">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Select Analysis Mode
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Choose the analysis mode that best fits your data. If you&apos;re unsure, 
                                                start with Template + Auto Detection for the best balance of guidance and flexibility.
                                            </p>
                                        </section>

                                        <section id="upload-data">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Upload Your Data
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Drag and drop your Excel file into the upload area or click to select a file. 
                                                The file will be processed automatically.
                                            </p>
                                        </section>

                                        <section id="review-columns">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Review Detected Columns
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                In auto-detection modes, review the detected columns and their classifications. 
                                                You can edit the type of any column if needed.
                                            </p>
                                        </section>

                                        <section id="explore-data">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Explore Your Data
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Use the interactive plots to explore relationships between variables. 
                                                Add new plots, switch variables, and view statistical summaries.
                                            </p>
                                        </section>

                                        <section id="analyze-relationships">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Analyze Relationships
                                            </h2>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                Use the correlation matrix and auto-generated plots to identify significant 
                                                relationships between environmental factors and diversity indices.
                                            </p>
                                        </section>
                                    </div>
                                )}

                                {activeSection === 'tips' && (
                                    <div className="space-y-8">
                                        <section id="data-preparation">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Data Preparation
                                            </h2>
                                            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                    <span>Ensure your data is clean and properly formatted before uploading</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                    <span>Use descriptive column headers to help with auto-detection</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                    <span>Remove any unnecessary formatting or special characters</span>
                                                </li>
                                            </ul>
                                        </section>

                                        <section id="analysis-tips">
                                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                                Analysis Tips
                                            </h2>
                                            <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                                                <li className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                    <span>Start with a single plot and gradually add more as needed</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                    <span>Use the auto-generated plots to discover unexpected relationships</span>
                                                </li>
                                                <li className="flex items-start gap-3">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                                                    <span>Review the confidence scores for auto-detected columns</span>
                                                </li>
                                            </ul>
                                        </section>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="fixed bottom-0 left-0 w-full p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Developed by <Link href="https://www.uwyo.edu/wyominginbre/index.html" target="_blank" className="text-gray-900 dark:text-white hover:underline">Wyoming INBRE</Link> and <Link href="https://www.lccc.wy.edu" target="_blank" className="text-gray-900 dark:text-white hover:underline">Laramie County Community College</Link></p>
                </div>
            </footer>
        </div>
    );
} 
