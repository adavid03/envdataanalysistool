import { useState } from 'react';
import { DetectedColumn } from '@/utils/autoDetect';
import { Edit2Icon, CheckIcon, XIcon } from 'lucide-react';

interface Props {
    columns: DetectedColumn[];
    onConfirm: () => void;
    onCancel: () => void;
}

export function AutoDetectionConfirmation({ columns, onConfirm, onCancel }: Props) {
    const [editingColumn, setEditingColumn] = useState<string | null>(null);
    const [editedColumns, setEditedColumns] = useState<DetectedColumn[]>(columns);

    const handleEdit = (columnName: string) => {
        setEditingColumn(columnName);
    };

    const handleSave = (columnName: string, newType: DetectedColumn['type']) => {
        setEditedColumns(prev => prev.map(col => 
            col.name === columnName 
                ? { ...col, type: newType, description: getDescriptionForType(newType) }
                : col
        ));
        setEditingColumn(null);
    };

    const getDescriptionForType = (type: DetectedColumn['type']): string => {
        switch (type) {
            case 'environmental': return 'Environmental measurement or parameter';
            case 'diversity': return 'Biodiversity or species diversity metric';
            case 'metadata': return 'Sample or site metadata';
            default: return 'Could not determine the type of this column';
        }
    };

    const getConfidenceColor = (confidence: number): string => {
        if (confidence >= 0.8) return 'text-green-500 dark:text-green-400';
        if (confidence >= 0.6) return 'text-yellow-500 dark:text-yellow-400';
        return 'text-red-500 dark:text-red-400';
    };

    const getTypeColor = (type: DetectedColumn['type']): string => {
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
    }, {} as Record<DetectedColumn['type'], DetectedColumn[]>);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Auto-Detected Columns
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Please review and adjust the detected columns and their classifications.
                    </p>
                </div>

                <div className="p-6 space-y-8">
                    {Object.entries(groupedColumns).map(([type, cols]) => (
                        <div key={type} className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                                {type} Columns
                            </h3>
                            <div className="grid gap-4">
                                {cols.map(column => (
                                    <div 
                                        key={column.name}
                                        className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {column.name}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getTypeColor(column.type)}`}>
                                                        {column.type}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {column.description}
                                                </p>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-sm ${getConfidenceColor(column.confidence)}`}>
                                                        {(column.confidence * 100).toFixed(0)}% confidence
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleEdit(column.name)}
                                                className="text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                                            >
                                                <Edit2Icon className="w-5 h-5" />
                                            </button>
                                        </div>

                                        {editingColumn === column.name && (
                                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                <div className="flex items-center gap-4">
                                                    <select
                                                        value={column.type}
                                                        onChange={(e) => handleSave(column.name, e.target.value as DetectedColumn['type'])}
                                                        className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md px-3 py-2 text-sm"
                                                    >
                                                        <option value="environmental">Environmental Factor</option>
                                                        <option value="diversity">Diversity Index</option>
                                                        <option value="metadata">Metadata</option>
                                                        <option value="unknown">Unknown</option>
                                                    </select>
                                                    <button
                                                        onClick={() => setEditingColumn(null)}
                                                        className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                                                    >
                                                        <XIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-2"
                    >
                        <CheckIcon className="w-4 h-4" />
                        Confirm & Continue
                    </button>
                </div>
            </div>
        </div>
    );
} 