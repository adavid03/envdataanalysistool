"use client";

import { ProcessedData } from './dataProcessing';

export function getDataByVariable(data: ProcessedData, variable: string): number[] {
    // First try to find the variable directly in the data structure
    if (variable in data.environmentalFactors && Array.isArray(data.environmentalFactors[variable as keyof ProcessedData['environmentalFactors']])) {
        return data.environmentalFactors[variable as keyof ProcessedData['environmentalFactors']];
    }
    if (variable in data.diversityIndices && Array.isArray(data.diversityIndices[variable as keyof ProcessedData['diversityIndices']])) {
        return data.diversityIndices[variable as keyof ProcessedData['diversityIndices']];
    }

    // If not found directly, try the template mapping
    const variableMap: Record<string, keyof ProcessedData['environmentalFactors'] | keyof ProcessedData['diversityIndices']> = {
        'Avg Temperature': 'temperature',
        'Departure': 'departure',
        'pH': 'ph',
        'Elevation': 'elevation',
        'General hardness (calcium carbonate)': 'hardness',
        'Total alkalinity ': 'alkalinity',
        'Carbonate ': 'carbonate',
        'Phosphate': 'phosphate',
        'Nitrate  ': 'nitrate',
        'Nitrite ': 'nitrite',
        'Free chlorine': 'chlorine',
        'Radioactivity above background': 'radioactivity',
        'Longitude': 'longitude',
        'Latitude': 'latitude',
        'Shannon diversity index': 'shannon',
        "Simpson's index": 'simpson',
        "Inverse Simpson's index": 'inverseSimpson',
        'Berger Parker index': 'bergerParker',
        'Effective number of species': 'effectiveSpecies',
        "Fisher's alpha": 'fishersAlpha',
        "Pielou's evenness": 'pielouEvenness',
        'Richness': 'richness'
    };

    const internalName = variableMap[variable];
    if (internalName) {
        // Check if it's an environmental factor
        if (internalName in data.environmentalFactors) {
            return data.environmentalFactors[internalName as keyof ProcessedData['environmentalFactors']];
        }

        // Check if it's a diversity index
        if (internalName in data.diversityIndices) {
            return data.diversityIndices[internalName as keyof ProcessedData['diversityIndices']];
        }
    }

    // If still not found, try normalized name matching
    const normalizedName = variable.toLowerCase().replace(/\s+/g, '');
    
    // Check environmental factors
    const envFactor = Object.entries(data.environmentalFactors).find(([key]) => 
        key.toLowerCase().replace(/\s+/g, '') === normalizedName
    );
    if (envFactor) {
        return envFactor[1];
    }

    // Check diversity indices
    const divIndex = Object.entries(data.diversityIndices).find(([key]) => 
        key.toLowerCase().replace(/\s+/g, '') === normalizedName
    );
    if (divIndex) {
        return divIndex[1];
    }

    console.warn(`Variable "${variable}" not found in data structure`);
    return [];
} 