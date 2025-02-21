'use client';

import { useState } from 'react';
import { ArrowRightIcon } from 'lucide-react';
import Image from 'next/image';
import { useFile } from './contexts/FileContext';
import Link from 'next/link';
export default function Home() {
  const { file, setFile } = useFile();
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.xlsx')) {
      alert('Please upload an Excel file');
      return;
    }
    setFile(selectedFile);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="flex items-center gap-4 w-full justify-center mb-3">
          <Image src="/beetle.png" alt="Beetlejuice eDNA" width={100} height={100} className="w-14 dark:invert" />
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Beetlejuice eDNA</h1>
        </div>
        <p className="text-lg text-gray-500 dark:text-gray-400 text-center mb-8 w-full">Start by uploading your eDNA data</p>

        <div
          className={`w-full max-w-xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border-2 border-dashed transition-all duration-200 ${isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-950'
              : file
                ? 'border-green-500 dark:border-green-400'
                : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
            }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !file && document.getElementById('file-upload')?.click()}
          style={{ cursor: file ? 'default' : 'pointer' }}
        >
          <div className="flex flex-col items-center gap-4">
            {!file ? (
              <>
                <div className="p-4 rounded-full bg-blue-50 dark:bg-blue-950">
                  <svg className="w-12 h-12 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">Drop your Excel file here</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">or click anywhere to select a file</p>
                </div>
                <input
                  type="file"
                  accept=".xlsx"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileInput}
                />
              </>
            ) : (
              <div className="animate-fadeIn flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-green-50 dark:bg-green-950">
                  <svg className="w-12 h-12 text-green-500 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-center">
                  <p className="text-xl font-semibold text-gray-700 dark:text-gray-200">File ready!</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{file.name}</p>
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
        <button
          className={`text-white flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-medium w-full mt-10 ${file
              ? 'opacity-100 bg-blue-500 hover:gap-3 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
              : 'opacity-50 bg-gray-300 dark:bg-gray-700 cursor-not-allowed'
            }`}
        >
          Analyze <ArrowRightIcon className="w-4 h-4" />
        </button>
      </main>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-500 dark:text-gray-400 text-center w-full px-4 flex items-center gap-1 justify-center">
        This project was made possible by <Link href="https://www.uwyo.edu/wyominginbre/index.html" target="_blank" className="text-gray-700 dark:text-gray-300 hover:underline"> Wyoming INBRE</Link>,
        the <Link href="https://www.lccc.wy.edu" target="_blank" className="text-gray-700 dark:text-gray-300 hover:underline">Laramie County Community College</Link>,
        Dr. Gavin Martin, Dr. Heather Talbott, Dr. Zac Roehrs, and Dr. Ami Wangeline.
      </div>
    </div>
  );
}
