'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';

interface Option {
    value: string;
    label: string;
    description: string;
    group: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
}

export function CustomSelect({ value, onChange, options }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const selectedItemRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Group options by their group property
    const groupedOptions = options.reduce((acc, option) => {
        if (!acc[option.group]) {
            acc[option.group] = [];
        }
        acc[option.group].push(option);
        return acc;
    }, {} as Record<string, Option[]>);

    // Filter options based on search term
    const filteredGroups = Object.entries(groupedOptions).map(([group, groupOptions]) => ({
        group,
        options: groupOptions.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
            option.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(group => group.options.length > 0);

    // Scroll selected item into view when dropdown opens
    useEffect(() => {
        if (isOpen && selectedItemRef.current) {
            selectedItemRef.current.scrollIntoView({ block: 'nearest' });
        }
    }, [isOpen]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isOpen]);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-[88px] px-4 py-2 text-left bg-white dark:bg-gray-800 border rounded-lg shadow-sm focus:outline-none transition-colors ${
                    isOpen 
                        ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 dark:ring-blue-400/20' 
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
            >
                <div className="flex justify-between items-center h-full">
                    <div className="flex flex-col justify-center">
                        <div className="font-medium text-gray-900 dark:text-white">
                            {selectedOption?.label || 'Select a variable'}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {selectedOption?.description || 'Choose from the list'}
                        </div>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                    <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600 p-2">
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search variables..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                    </div>
                    {filteredGroups.map(({ group, options: groupOptions }) => (
                        <div key={group} className="py-2">
                            <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                                {group}
                            </div>
                            {groupOptions.map((option) => (
                                <div
                                    key={option.value}
                                    ref={option.value === value ? selectedItemRef : null}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                                        option.value === value ? 'bg-blue-50 dark:bg-blue-900' : ''
                                    }`}
                                >
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {option.label}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {option.description}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
} 