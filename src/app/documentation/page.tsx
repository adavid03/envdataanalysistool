'use client';

import { ChartBarIcon, MenuIcon, ChevronLeftIcon } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Section = {
    id: string;
    title: string;
    content: React.ReactNode;
};

const sections: Section[] = [
    {
        id: 'overview',
        title: 'Overview',
        content: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                    Welcome to Beetlejuice eDNA, your comprehensive tool for analyzing environmental DNA data. 
                    This guide will help you get started with analyzing your data and exploring relationships 
                    between environmental factors and biodiversity metrics.
                </p>
            </div>
        )
    },
    {
        id: 'quick-start',
        title: 'Quick Start Guide',
        content: (
            <div className="space-y-4">
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
            </div>
        )
    },
    {
        id: 'file-format',
        title: 'File Format',
        content: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                    The tool supports three analysis modes, each with different format requirements. 
                    Choose the one that best matches your data structure.
                </p>
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Standard Template Format</h3>
                        <p className="text-gray-600 dark:text-gray-300 mb-4">
                            This is the format the program expects in "Template" mode. Columns that have missing data will still be processed. Your Excel file should have the following columns in any order:
                        </p>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-800">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Column Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Data Type</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Required</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Sample Code</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Text</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Unique identifier for each sample</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Barcode</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Text</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Sample barcode identifier</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Original Qubit (ng/ul)</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">DNA concentration measurement</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Reads assigned</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number of sequencing reads</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Date</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Date</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Sample collection date</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Latitude</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Decimal degrees (WGS84)</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Longitude</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Decimal degrees (WGS84)</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Yes</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Elevation</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Elevation in meters</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Avg Temperature</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Average temperature in °C</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Departure</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Temperature departure from normal</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">pH</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">pH value (0-14)</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">General hardness (calcium carbonate)</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Water hardness measurement</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Total alkalinity</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Water alkalinity measurement</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Carbonate</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Carbonate concentration</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Phosphate</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Phosphate concentration</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Nitrate</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Nitrate concentration</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Nitrite</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Nitrite concentration</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Free chlorine</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Free chlorine concentration</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Radioactivity above background</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Text</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">&quot;Yes&quot; or &quot;No&quot;</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Shannon&apos;s diversity index</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Species diversity measure</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Simpson&apos;s index</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Species diversity measure</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Inverse Simpson&apos;s index</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Species diversity measure</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Berger Parker index</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Species diversity measure</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Effective number of species</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Species diversity measure</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Fisher&apos;s alpha</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Species diversity measure</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Pielou&apos;s evenness</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Species diversity measure</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Richness</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Number of species</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Soil Type</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Text</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Type of soil</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Specific soil type name</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Text</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Detailed soil classification</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Rock Type</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Text</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Type of rock</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Esri Symbology (Rock Age)</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Text</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Rock age classification</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">Ecoregion</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Text</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">Ecological region classification</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">No</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Important Notes:</h4>
                            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                                <li>• Column names are case-insensitive (e.g., &quot;pH&quot; or &quot;ph&quot; both work)</li>
                                <li>• All numeric values should be in decimal format</li>
                                <li>• Missing values should be left blank (not filled with zeros or text)</li>
                                <li>• Sample codes must be unique</li>
                                <li>• Coordinates must be in WGS84 (decimal degrees)</li>
                                <li>• Only Sample Code, Latitude, and Longitude are required fields</li>
                                <li>• All other fields are optional but recommended for comprehensive analysis</li>
                            </ul>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Choose Analysis Mode</h3>
                        <p>Select the analysis mode that best fits your data format.</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Review Detections</h3>
                        <p>Review and confirm the detected columns in your data.</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Explore Relationships</h3>
                        <p>Use interactive visualizations to explore relationships between variables.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'data-types',
        title: 'Data Types',
        content: (
            <div className="space-y-4">
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
                        </ul>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'column-mapping',
        title: 'Column Mapping',
        content: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                    The tool automatically detects and maps your Excel column headers to internal data types. 
                    You can review and edit these mappings by clicking on any detected column.
                </p>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Internal Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Excel Header Examples</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Temperature</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">temp, temperature, °C, avg_temp, ...</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">pH</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">ph, pH, acidity, ...</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">Shannon Index</td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">shannon, diversity, H', ...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        )
    },
    {
        id: 'visualizations',
        title: 'Available Charts',
        content: (
            <div className="space-y-4">
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Scatter Plot:</strong> Explore relationships between two continuous variables</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Correlation Matrix:</strong> Visualize all pairwise correlations in your dataset</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: 'stats',
        title: 'Behind-the-scenes Stats',
        content: (
            <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                    The tool uses robust statistical methods to analyze your data. All calculations automatically handle missing or invalid values.
                </p>
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Pearson r:</strong> Measures linear correlation between variables</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>OLS Regression:</strong> Fits a line of best fit using ordinary least squares</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Data Cleaning:</strong> Non-finite values (NaN, Inf) are automatically filtered</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Minimum Requirements:</strong> At least 2 valid data points required for calculations</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: 'data-cleaning',
        title: 'Common Data Issues',
        content: (
            <div className="space-y-4">
                <ul className="space-y-3 text-gray-600 dark:text-gray-300">
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Missing Headers:</strong> Ensure all columns have descriptive headers</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Mixed Data Types:</strong> Convert text-formatted numbers to numeric values</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Duplicate Samples:</strong> Check for and remove duplicate sample codes</span>
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-600 dark:bg-gray-400 mt-2"></span>
                        <span><strong>Encoding Issues:</strong> Save files in UTF-8 format to avoid special character problems</span>
                    </li>
                </ul>
            </div>
        )
    },
    {
        id: 'faq',
        title: 'FAQ',
        content: (
            <div className="space-y-4">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">Which Excel versions are supported?</h3>
                        <p className="text-gray-600 dark:text-gray-300">Files must be in .xlsx format (Excel 2007 or later).</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">What coordinate system is used?</h3>
                        <p className="text-gray-600 dark:text-gray-300">Coordinates should be in WGS84 (EPSG:4326).</p>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">How do I switch to dark mode?</h3>
                        <p className="text-gray-600 dark:text-gray-300">Use the theme toggle in the top-right corner of the page.</p>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'troubleshooting',
        title: 'Troubleshooting',
        content: (
            <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Symptom</h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Blank plot</li>
                            <li>Missing columns</li>
                            <li>Incorrect data types</li>
                            <li>Slow performance</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-medium text-gray-900 dark:text-white mb-2">Fix</h3>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                            <li>Check for identical x-values</li>
                            <li>Verify column headers</li>
                            <li>Convert text to numbers</li>
                            <li>Reduce dataset size</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
];

export default function DocumentationPage() {
    const [activeSection, setActiveSection] = useState<string>(sections[0].id);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    useEffect(() => {
        // Handle initial hash and hash changes
        const handleHashChange = () => {
            const hash = window.location.hash.slice(1);
            if (hash) {
                const section = sections.find(s => s.id === hash);
                if (section) {
                    setActiveSection(section.id);
                    const element = document.getElementById(section.id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        };

        // Initial hash check
        handleHashChange();

        // Listen for hash changes
        window.addEventListener('hashchange', handleHashChange);

        // Add scroll event listener for section highlighting
        const handleScroll = () => {
            const scrollPosition = window.scrollY + 100; // Offset for header
            const sections = document.querySelectorAll<HTMLElement>('section[id]');
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    setActiveSection(sectionId || '');
                    // Update hash without triggering scroll
                    if (window.location.hash.slice(1) !== sectionId) {
                        window.history.replaceState(null, '', `#${sectionId}`);
                    }
                }
            });
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
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
                            <ChevronLeftIcon className="w-4 h-4" />
                        </Link>
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                            Documentation
                        </h1>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 pt-20 pb-16">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex gap-8">
                        {/* Sidebar Navigation */}
                        <div className={`fixed lg:sticky top-20 left-0 w-64 h-[calc(100vh-5rem)] transform transition-transform duration-200 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} z-10`}>
                            <div className="h-full overflow-y-auto">
                                <nav className="px-4 py-4">
                                    <div className="space-y-1">
                                        {sections.map((section) => (
                                            <Link
                                                key={section.id}
                                                href={`#${section.id}`}
                                                onClick={() => {
                                                    setActiveSection(section.id);
                                                    setIsSidebarOpen(false);
                                                }}
                                                className={`block px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                                                    activeSection === section.id
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                                }`}
                                            >
                                                {section.title}
                                            </Link>
                                        ))}
                                    </div>
                                </nav>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 lg:ml-64">
                            <div className="prose dark:prose-invert max-w-none">
                                {sections.map((section) => (
                                    <section
                                        key={section.id}
                                        id={section.id}
                                        className="py-8 scroll-mt-20"
                                    >
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                            {section.title}
                                        </h2>
                                        {section.content}
                                    </section>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="w-full p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
                <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
                    <p>Developed by <Link href="https://www.uwyo.edu/wyominginbre/index.html" target="_blank" className="text-gray-900 dark:text-white hover:underline">Wyoming INBRE</Link> and <Link href="https://www.lccc.wy.edu" target="_blank" className="text-gray-900 dark:text-white hover:underline">Laramie County Community College</Link></p>
                </div>
            </footer>
        </div>
    );
} 
