'use client';

import { useTheme } from 'next-themes';
import { Monitor, Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className="fixed top-2 right-2 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 p-1">
        {isExpanded ? (
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setTheme('light')}
              className={`h-5 w-5 rounded flex items-center justify-center ${
                theme === 'light' ? 'bg-blue-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Light mode"
            >
              <Sun className="w-3 h-3" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`h-5 w-5 rounded flex items-center justify-center ${
                theme === 'dark' ? 'bg-blue-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="Dark mode"
            >
              <Moon className="w-3 h-3" />
            </button>
            <button
              onClick={() => setTheme('system')}
              className={`h-5 w-5 rounded flex items-center justify-center ${
                theme === 'system' ? 'bg-blue-100 text-blue-500' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title="System mode"
            >
              <Monitor className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-5 w-5 rounded flex items-center justify-center text-gray-500 dark:text-gray-400"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
          </button>
        )}
      </div>
    </div>
  );
} 