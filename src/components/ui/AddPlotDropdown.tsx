import { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon, PlusIcon } from 'lucide-react';
import { Portal } from './Portal';

interface AddPlotDropdownProps {
    onSelect: (type: 'custom' | 'water' | 'diversity') => void;
}

export function AddPlotDropdown({ onSelect }: AddPlotDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

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

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node) &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const options = [
        {
            type: 'custom' as const,
            title: 'Custom Plot',
            description: 'Create a plot with any variables'
        },
        {
            type: 'water' as const,
            title: 'Water Chemistry Plot',
            description: 'Compare environmental factors with each other'
        },
        {
            type: 'diversity' as const,
            title: 'Diversity Plot',
            description: 'Compare environmental factors with diversity indices'
        }
    ];

    return (
        <div className="relative">
            <button
                ref={buttonRef}
                onClick={() => setIsOpen(!isOpen)}
                className="h-9 min-w-[220px] sm:min-w-[220px] w-full sm:w-auto bg-blue-100 hover:bg-blue-200 text-blue-800 font-normal rounded-md px-4 text-sm shadow flex items-center justify-between transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300/40"
            >
                <span className="flex items-center gap-2">
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add a new plot
                </span>
                <ChevronDownIcon className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <Portal>
                    <div
                        ref={dropdownRef}
                        style={{
                            position: 'absolute',
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`,
                            width: dropdownPosition.width < 220 ? (window.innerWidth < 640 ? '100vw' : '220px') : `${dropdownPosition.width}px`,
                            maxWidth: window.innerWidth < 640 ? '100vw' : undefined,
                            zIndex: 50
                        }}
                        className="mt-1 py-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-200/50 dark:border-gray-700/50 rounded-lg shadow-lg overflow-hidden"
                    >
                        {options.map((option) => (
                            <button
                                key={option.type}
                                onClick={() => {
                                    onSelect(option.type);
                                    setIsOpen(false);
                                }}
                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-100/50 dark:hover:bg-gray-700/50 group transition-colors"
                            >
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                        {option.title}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {option.description}
                                    </div>
                                </div>
                                <PlusIcon className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 ml-4 flex-shrink-0" />
                            </button>
                        ))}
                    </div>
                </Portal>
            )}
        </div>
    );
} 