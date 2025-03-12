'use client';

import { useState } from 'react';
import { ArrowRightIcon, BookOpenIcon, CloudUploadIcon, CheckCircleIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useFile } from './contexts/FileContext';
import { useRouter } from 'next/navigation';
import { useAnalysisMode } from './contexts/AnalysisModeContext';
/**
 * Home page component for the Beetlejuice eDNA web application.
 * Provides a drag-and-drop interface for uploading Excel files containing eDNA data.
 */

type AnalysisMode = 'template' | 'template-auto' | 'full-auto';

export default function Home() {
  const router = useRouter();
  // Global file state from FileContext
  const { file, setFile } = useFile();
  // Get mode from context
  const { mode, setMode } = useAnalysisMode();
  // Local state for drag interaction feedback
  const [isDragging, setIsDragging] = useState(false);
  // Add new state for analyze button
  const [isAnalyzing, setIsAnalyzing] = useState(false);

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
    const baseClasses = "relative w-full max-w-xl p-8 bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-lg border-2 border-dashed backdrop-blur-sm transition-all duration-200";

    if (isDragging) return `${baseClasses} border-blue-500 bg-blue-50/50 dark:bg-blue-950/50`;
    if (file) return `${baseClasses} border-green-500/50 dark:border-green-400/50`;
    return `${baseClasses} border-gray-300/50 dark:border-gray-600/50 hover:border-blue-500/50 dark:hover:border-blue-400/50`;
  };

  /**
   * Handles the analysis process
   */
  const handleAnalyze = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    localStorage.setItem('isAnalyzing', 'true');
    try {
      await router.replace('/analysis');
    } catch (error) {
      console.error('Error navigating to analysis page:', error);
      setIsAnalyzing(false);
      localStorage.removeItem('isAnalyzing');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="fixed top-0 left-0 w-full p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 z-10 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
          <Image
            src="/beetle.png"
            alt="Beetlejuice eDNA"
              width={32}
              height={32}
              className="w-8 dark:invert"
            />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
            Beetlejuice eDNA
          </h1>
        </div>
          <Link
            href="/documentation"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <BookOpenIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Documentation</span>
          </Link>
        </div>
      </div>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
              Welcome to Beetlejuice eDNA
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Upload your eDNA data to begin analysis
            </p>
        </div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Analysis Mode Selection */}
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-4 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 h-fit">
              <label className="block text-sm font-medium text-gray-900 dark:text-white mb-4">
            Analysis Mode
          </label>
              <div className="space-y-3">
                <label className={`block relative p-3 rounded-lg border transition-all cursor-pointer
                  ${mode === 'template' 
                    ? 'bg-blue-50/50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 ring-2 ring-blue-500/50' 
                    : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex items-start gap-3">
                      <div className="relative">
                        <input
                          type="radio"
                          value="template"
                          checked={mode === 'template'}
                          onChange={(e) => setMode(e.target.value as AnalysisMode)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 mt-1 rounded-full border border-gray-300 peer-checked:border-gray-300 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full ${mode === 'template' ? 'bg-blue-500' : 'bg-transparent'}`}></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 justify-between">
                        <p className={`font-medium ${mode === 'template' ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                          Standard Template
                        </p>
                        <Link 
                          href="/documentation#template-format" 
                          target="_blank"
                          className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/50 rounded-lg px-2 py-0.5"
                        >
                          View Format →
                        </Link>
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Use this if your data follows the standard format
                      </p>
                    </div>
                  </div>
                </label>

                <label className={`block relative p-3 rounded-lg border transition-all cursor-pointer
                  ${mode === 'template-auto' 
                    ? 'bg-purple-50/50 dark:bg-purple-900/50 border-purple-200 dark:border-purple-800 ring-2 ring-purple-500/50' 
                    : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex items-start gap-3">
                      <div className="relative">
                        <input
                          type="radio"
                          value="template-auto"
                          checked={mode === 'template-auto'}
                          onChange={(e) => setMode(e.target.value as AnalysisMode)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 mt-1 rounded-full border border-gray-300 peer-checked:border-gray-300 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full ${mode === 'template-auto' ? 'bg-purple-500' : 'bg-transparent'}`}></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className={`font-medium ${mode === 'template-auto' ? 'text-purple-600 dark:text-purple-400' : 'text-gray-900 dark:text-white'}`}>
                        Smart Template
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        For standard format + some custom variables
                      </p>
                    </div>
                  </div>
                </label>

                <label className={`block relative p-3 rounded-lg border transition-all cursor-pointer
                  ${mode === 'full-auto' 
                    ? 'bg-green-50/50 dark:bg-green-900/50 border-green-200 dark:border-green-800 ring-2 ring-green-500/50' 
                    : 'bg-white/50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-800'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative flex items-start gap-3">
                      <div className="relative">
                        <input
                          type="radio"
                          value="full-auto"
                          checked={mode === 'full-auto'}
                          onChange={(e) => setMode(e.target.value as AnalysisMode)}
                          className="sr-only peer"
                        />
                        <div className="w-4 h-4 mt-1 rounded-full border border-gray-300 peer-checked:border-gray-300 flex items-center justify-center">
                          <div className={`w-2 h-2 rounded-full ${mode === 'full-auto' ? 'bg-green-500' : 'bg-transparent'}`}></div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className={`font-medium ${mode === 'full-auto' ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'}`}>
                        Auto Detection
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        For custom formats - attempts to automatically detect all variables
                      </p>
                    </div>
                  </div>
                </label>
              </div>
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
              <div className="flex flex-col items-center justify-center h-full gap-4">
            {!file ? (
                  <>
                    <div className="p-4 rounded-full bg-blue-100/50 dark:bg-blue-900/50 ring-1 ring-blue-500/20 dark:ring-blue-400/20">
                      <CloudUploadIcon className="w-8 h-8 text-blue-500 dark:text-blue-400" />
                </div>
                <div className="text-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                    Drop your Excel file here
                  </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
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
              <div className="animate-fadeIn flex flex-col items-center gap-4">
                    <div className="p-4 rounded-full bg-green-100/50 dark:bg-green-900/50 ring-1 ring-green-500/20 dark:ring-green-400/20">
                      <CheckCircleIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
                </div>
                <div className="text-center">
                      <p className="text-lg font-medium text-gray-900 dark:text-white">
                    File ready!
                  </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {file.name}
                  </p>
                </div>
                <button
                  onClick={removeFile}
                      className="text-sm px-4 py-2 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                >
                  Remove File
                </button>
              </div>
            )}
              </div>
          </div>
        </div>

        {/* Analysis Button */}
        <div className="relative max-w-md mx-auto group">
          <button
            onClick={handleAnalyze}
            disabled={!file || !mode || isAnalyzing}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              file && mode
                ? isAnalyzing
                  ? 'bg-blue-400 dark:bg-blue-500 cursor-wait text-white'
                  : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white hover:gap-3'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
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
          {(!file || !mode) && (
            <div className="invisible group-hover:visible absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-2 bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg transition-all duration-200 whitespace-nowrap pointer-events-none">
              {!file && !mode
                ? "You need to upload a file and select a method of analysis"
                : !file
                ? "You need to upload a file"
                : "You need to select a method of analysis"}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-8 border-transparent border-t-gray-900 dark:border-t-gray-800" />
            </div>
          )}
        </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 w-full p-4 backdrop-blur-sm bg-white/50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
          Made possible by{' '}
          <Link href="https://www.uwyo.edu/wyominginbre/index.html" target="_blank" className="text-gray-900 dark:text-white hover:underline">
          Wyoming INBRE
          </Link>
          {' & '}
          <Link href="https://www.lccc.wy.edu" target="_blank" className="text-gray-900 dark:text-white hover:underline">
            LCCC
          </Link>
      </div>
      </footer>
    </div>
  );
}
