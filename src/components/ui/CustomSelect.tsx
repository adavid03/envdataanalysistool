'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { Portal } from './Portal';

interface Option {
    value: string;
    label: string;
    description: string;
    group: string;
    disabled?: boolean;
    disabledReason?: string;
}

interface Props {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
}

export function CustomSelect({ value, onChange, options }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const selectedItemRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const portalRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isPortalMounted, setIsPortalMounted] = useState(false);

    // Reset portal mounted state when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            setIsPortalMounted(false);
        }
    }, [isOpen]);

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

    // Update dropdown position when opening
    useEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
                width: rect.width
            });
        }
    }, [isOpen]);

    // Handle focus and scroll after Portal mount
    useEffect(() => {
        if (isOpen && isPortalMounted) {
            // Focus search input
            if (searchInputRef.current) {
                searchInputRef.current.focus();
                searchInputRef.current.select();
            }

            // Scroll to selected item
            if (selectedItemRef.current && scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const selectedItem = selectedItemRef.current;

                const containerHeight = container.offsetHeight;
                const itemTop = selectedItem.offsetTop;
                const itemHeight = selectedItem.offsetHeight;

                container.scrollTop = itemTop - (containerHeight - itemHeight) / 2;
            }
        }
    }, [isOpen, isPortalMounted]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node) &&
                portalRef.current &&
                !portalRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full h-16 px-3 text-left bg-white dark:bg-gray-800 border rounded-lg shadow-sm focus:outline-none transition-colors ${isOpen
                        ? 'border-blue-500 dark:border-blue-400 ring-2 ring-blue-500/20 dark:ring-blue-400/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                    }`}
            >
                <div className="flex justify-between items-center h-full">
                    <div className="flex flex-col justify-center">
                        <div className="font-medium text-gray-900 dark:text-white">
                            {selectedOption?.label || 'Select a variable'}
                        </div>
                    </div>
                    <ChevronDownIcon className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'transform rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <Portal>
                    <div
                        ref={(el) => {
                            portalRef.current = el;
                            if (el && !isPortalMounted) {
                                setIsPortalMounted(true);
                            }
                        }}
                        style={{
                            position: 'absolute',
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            width: `${dropdownPosition.width}px`,
                            zIndex: 10
                        }}
                        className="mt-1 overflow-hidden bg-white/70 dark:bg-neutral-900/50 border border-gray-200 dark:border-gray-800 rounded-lg backdrop-blur-sm"
                        onTransitionEnd={() => {
                            if (!isPortalMounted) {
                                setIsPortalMounted(true);
                            }
                        }}
                    >
                        {/* Content container */}
                        <div className="relative flex flex-col max-h-96">
                            {/* Search bar */}
                            <div className="flex-none border-b border-gray-200/50 dark:border-gray-700/50 p-2">
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    placeholder="Search variables..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200/50 dark:border-gray-700/50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 dark:focus:ring-blue-400/50 bg-white/50 dark:bg-gray-800/50 text-gray-900 dark:text-white"
                                />
                            </div>

                            {/* Scrollable content */}
                            <div ref={scrollContainerRef} className="overflow-y-auto h-[300px]">
                                {filteredGroups.map(({ group, options: groupOptions }) => (
                                    <div key={group} className="py-2">
                                        <div className="px-3 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800">
                                            {group}
                                        </div>
                                        {groupOptions.map((option) => (
                                            <div
                                                key={option.value}
                                                ref={option.value === value ? selectedItemRef : null}
                                                onClick={() => {
                                                    if (!option.disabled) {
                                                        onChange(option.value);
                                                        setIsOpen(false);
                                                    }
                                                }}
                                                className={`px-3 py-2 cursor-pointer ${
                                                    option.disabled 
                                                        ? 'opacity-50 cursor-not-allowed' 
                                                        : 'hover:bg-gray-300/30 dark:hover:bg-gray-700/30'
                                                } ${
                                                    option.value === value 
                                                        ? 'bg-blue-200/50 dark:bg-blue-800/50 hover:bg-blue-200/50 dark:hover:bg-blue-800/50' 
                                                        : ''
                                                }`}
                                            >
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {option.label}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {option.disabled ? option.disabledReason : option.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Portal>
            )}
        </div>
    );
} 