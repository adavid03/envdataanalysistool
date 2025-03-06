'use client';

import { useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFile } from './contexts/FileContext';
import { useRouter } from 'next/navigation';
/**
 * Home page component for the Beetlejuice eDNA web application.
 * Provides a drag-and-drop interface for uploading Excel files containing eDNA data.
 */

type AnalysisMode = 'template' | 'template-auto' | 'full-auto';

export default function Home() {
  const router = useRouter();
  // Global file state from FileContext
  const { file, setFile } = useFile();
  // Local state for drag interaction feedback
  const [isDragging, setIsDragging] = useState(false);
  // Add new state for analyze button
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>('template');

  /**
   * File validation and processing
   * @param selectedFile - The file selected by the user
   */
  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.xlsx')) {
      alert('Please upload an Excel file');
      return;
    }
    setFile(selectedFile);
  };

  /**
   * Event handlers for drag and drop functionality
   */
  const dragAndDropHandlers = {
    handleDrag: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
    },

    handleDragIn: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    },

    handleDragOut: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    },

    handleDrop: (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files[0]) {
        handleFile(files[0]);
      }
    },

    handleFileInput: (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        handleFile(e.target.files[0]);
      }
    }
  };

  /**
   * Resets the file state
   */
  const removeFile = () => setFile(null);

  /**
   * Determines the CSS classes for the drop zone based on current state
   */
  const getDropZoneClasses = () => {
    const baseClasses = "w-full max-w-xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed transition-all duration-200";

    if (isDragging) return `${baseClasses} border-blue-500 bg-blue-50 dark:bg-blue-950`;
    if (file) return `${baseClasses} border-green-500 dark:border-green-400`;
    return `${baseClasses} border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400`;
  };

  /**
   * Handles the analysis process
   */
  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    localStorage.setItem('isAnalyzing', 'true');
    localStorage.setItem('analysisMode', analysisMode);
    try {
      await router.replace('/analysis');
    } catch (error) {
      console.error('Error navigating to analysis page:', error);
      setIsAnalyzing(false);
      localStorage.removeItem('isAnalyzing');
      localStorage.removeItem('analysisMode');
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center h-screen max-h-screen overflow-hidden">
      {/* Documentation Link - Now in top left */}
      <div className="w-full px-4 py-3">
        <Link
          href="/documentation"
          className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          View Documentation
        </Link>
      </div>

      <main className="flex flex-col items-center w-full max-w-xl mx-auto">
        {/* Header Section */}
        <div className="flex items-center gap-3 justify-center mb-2">
          <Image
            src="/beetle.png"
            alt="Beetlejuice eDNA"
            width={100}
            height={100}
            className="w-12 dark:invert"
          />
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Beetlejuice eDNA
          </h1>
        </div>
        <p className="text-base text-gray-500 dark:text-gray-400 text-center mb-4">
          Start by uploading your eDNA data
        </p>

        {/* Analysis Mode Selection */}
        <div className="w-full mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Analysis Mode
          </label>
          <select
            value={analysisMode}
            onChange={(e) => setAnalysisMode(e.target.value as AnalysisMode)}
            className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="template">Template Mode (Default)</option>
            <option value="template-auto">Template + Auto Detection</option>
            <option value="full-auto">Full Auto Detection</option>
          </select>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            {analysisMode === 'template' && 'Use predefined template for data analysis'}
            {analysisMode === 'template-auto' && 'Use template with automatic column detection'}
            {analysisMode === 'full-auto' && 'Fully automatic column detection and analysis'}
          </p>
        </div>

        {/* File Drop Zone */}
        <div
          className={getDropZoneClasses()}
          onDragEnter={dragAndDropHandlers.handleDragIn}
          onDragLeave={dragAndDropHandlers.handleDragOut}
          onDragOver={dragAndDropHandlers.handleDrag}
          onDrop={dragAndDropHandlers.handleDrop}
          onClick={() => !file && document.getElementById('file-upload')?.click()}
          style={{ cursor: file ? 'default' : 'pointer' }}
        >
          <div className="flex flex-col items-center gap-4">
            {!file ? (
              // Upload State UI
              <>
                <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950">
                  <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    Drop your Excel file here
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    or click anywhere to select a file
                  </p>
                </div>
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  id="file-upload"
                  onChange={dragAndDropHandlers.handleFileInput}
                />
              </>
            ) : (
              // File Ready State UI
              <div className="animate-fadeIn flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-green-50 dark:bg-green-950">
                  <svg className="w-12 h-12 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                    File ready!
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {file.name}
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="cursor-pointer bg-transparent hover:bg-red-500/5 text-red-500 dark:text-red-400 px-6 py-3 rounded-lg transition-colors font-medium"
                >
                  Remove File
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Button */}
        <button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className={`text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-medium w-full mt-10 ${file
              ? isAnalyzing
                ? 'bg-blue-400 dark:bg-blue-500 cursor-wait'
                : 'opacity-100 bg-blue-500 hover:gap-3 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              : 'opacity-50 bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }`}
        >
          {isAnalyzing ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              Analyze <ArrowRightIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </main>

      {/* Footer Credits */}
      <div className="py-2 text-xs text-gray-500 dark:text-gray-400 text-center w-full px-4 flex flex-wrap items-center gap-1 justify-center">
        Made possible by{' '}
        <Link href="https://www.uwyo.edu/wyominginbre/index.html" target="_blank" className="text-gray-700 dark:text-gray-300 hover:underline">
          Wyoming INBRE
        </Link>
        {' & '}
        <Link href="https://www.lccc.wy.edu" target="_blank" className="text-gray-700 dark:text-gray-300 hover:underline">
          LCCC
        </Link>
      </div>
    </div>
  );
}
