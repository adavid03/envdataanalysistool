import { useState } from 'react';
import { DetectedColumn } from '@/utils/autoDetect';
import { Edit2Icon, CheckIcon, XIcon } from 'lucide-react';

type ColumnType = 'environmental' | 'diversity' | 'metadata' | 'unknown';

interface Props {
    columns: DetectedColumn[];
    onConfirm: (editedColumns: DetectedColumn[]) => void;
    onCancel: () => void;
}

export function AutoDetectionConfirmation({ columns, onConfirm, onCancel }: Props) {
    // Deduplicate columns on initial state setup
    const [editingColumn, setEditingColumn] = useState<string | null>(null);
    const [editedColumns, setEditedColumns] = useState<DetectedColumn[]>(() => {
        // Create a map to track seen columns and their highest confidence
        const columnMap = new Map<string, DetectedColumn>();
        
        columns.forEach(col => {
            const existing = columnMap.get(col.name);
            if (!existing || col.confidence > existing.confidence) {
                columnMap.set(col.name, col);
            }
        });

        return Array.from(columnMap.values());
    });

    const handleEdit = (columnName: string) => {
        setEditingColumn(columnName);
    };

    const handleSave = (columnName: string, newType: ColumnType) => {
        setEditedColumns(prev => prev.map(col => 
            col.name === columnName 
                ? { ...col, type: newType, description: getDescriptionForType(newType) }
                : col
        ));
        setEditingColumn(null);
    };

    const handleConfirm = () => {
        onConfirm(editedColumns);
    };

    const getDescriptionForType = (type: ColumnType): string => {
        switch (type) {
            case 'environmental': return 'Environmental measurement';
            case 'diversity': return 'Diversity metric';
            case 'metadata': return 'Metadata';
            default: return 'Unknown type';
        }
    };

    const getTypeColor = (type: ColumnType): string => {
        switch (type) {
            case 'environmental': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
            case 'diversity': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
            case 'metadata': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300';
            default: return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
        }
    };

    const groupedColumns = editedColumns.reduce((acc, col) => {
        acc[col.type] = [...(acc[col.type] || []), col];
        return acc;
    }, {} as Record<ColumnType, DetectedColumn[]>);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Auto-Detected Variables
                    </h2>
                </div>

                <div className="p-4 space-y-4">
                    {Object.entries(groupedColumns).map(([type, cols]) => (
                        <div key={type} className="space-y-2">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded-full text-xs ${getTypeColor(type as ColumnType)}`}>
                                    {type}
                                </span>
                                <span>({cols.length})</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {cols.map(column => (
                                    <div 
                                        key={`${column.name}-${column.type}`}
                                        className="bg-gray-50 dark:bg-gray-800/50 rounded p-2 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                                    >
                                        <span className="font-medium text-sm text-gray-900 dark:text-white">
                                            {column.name}
                                        </span>
                                        {editingColumn === column.name ? (
                                            <div className="flex items-center gap-2">
                                                <select
                                                    value={column.type}
                                                    onChange={(e) => {
                                                        const value = e.target.value as ColumnType;
                                                        handleSave(column.name, value);
                                                    }}
                                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded px-2 py-1 text-xs"
                                                >
                                                    <option value="environmental">Environmental</option>
                                                    <option value="diversity">Diversity</option>
                                                    <option value="metadata">Metadata</option>
                                                </select>
                                                <button
                                                    onClick={() => setEditingColumn(null)}
                                                    className="text-gray-500 hover:text-red-500"
                                                >
                                                    <XIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleEdit(column.name)}
                                                className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
                                            >
                                                <Edit2Icon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    >
                        Use Template
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center gap-1.5"
                    >
                        <CheckIcon className="w-3.5 h-3.5" />
                        Use Auto-Detected
                    </button>
                </div>
            </div>
        </div>
    );
} 