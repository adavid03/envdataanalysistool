import { ProcessedData } from './dataProcessing';

export interface DetectedColumn {
    name: string;
    type: 'environmental' | 'diversity' | 'metadata' | 'unknown';
    confidence: number;
    description: string;
}

interface DetectionResult {
    columns: DetectedColumn[];
    success: boolean;
    error?: string;
}

// Comprehensive keyword patterns for different types of data
const ENVIRONMENTAL_PATTERNS = [
    // Temperature related
    /temp(erature)?/i,
    /deg(ree)?s?/i,
    /celsius/i,
    /fahrenheit/i,
    /kelvin/i,
    /heat/i,
    /thermal/i,

    // Water chemistry
    /ph/i,
    /hydrogen/i,
    /alkalinity/i,
    /hardness/i,
    /carbonate/i,
    /bicarbonate/i,
    /phosphate/i,
    /phosphorus/i,
    /nitrate/i,
    /nitrite/i,
    /ammonia/i,
    /chlorine/i,
    /chloride/i,
    /sulfate/i,
    /sulphate/i,
    /sodium/i,
    /potassium/i,
    /calcium/i,
    /magnesium/i,
    /iron/i,
    /copper/i,
    /zinc/i,
    /lead/i,
    /mercury/i,
    /arsenic/i,
    /cadmium/i,

    // Physical parameters
    /elevation/i,
    /altitude/i,
    /height/i,
    /depth/i,
    /pressure/i,
    /turbidity/i,
    /conductivity/i,
    /salinity/i,
    /dissolved oxygen/i,
    /do/i,
    /oxygen/i,
    /flow rate/i,
    /velocity/i,
    /current/i,
    /stream/i,
    /river/i,
    /lake/i,
    /pond/i,

    // Location
    /latitude/i,
    /lat/i,
    /longitude/i,
    /long/i,
    /lon/i,
    /coordinate/i,
    /location/i,
    /site/i,
    /station/i,

    // General environmental
    /environmental/i,
    /parameter/i,
    /measurement/i,
    /reading/i,
    /value/i,
    /unit/i,
    /concentration/i,
    /level/i,
    /amount/i,
    /quantity/i
];

const DIVERSITY_PATTERNS = [
    // Shannon index variations
    /shannon/i,
    /shannon's/i,
    /shannons/i,
    /shannon-weaver/i,
    /shannon_weaver/i,
    /shannonweaver/i,

    // Simpson index variations
    /simpson/i,
    /simpson's/i,
    /simpsons/i,
    /simpson-dominance/i,
    /simpson_dominance/i,
    /simpsondominance/i,

    // Other diversity indices
    /diversity index/i,
    /diversity_index/i,
    /diversityindex/i,
    /species diversity/i,
    /species_diversity/i,
    /speciesdiversity/i,
    /richness/i,
    /species richness/i,
    /species_richness/i,
    /speciesrichness/i,
    /evenness/i,
    /species evenness/i,
    /species_evenness/i,
    /speciesevenness/i,

    // Alpha, Beta, Gamma diversity
    /alpha diversity/i,
    /alpha_diversity/i,
    /alphadiversity/i,
    /beta diversity/i,
    /beta_diversity/i,
    /betadiversity/i,
    /gamma diversity/i,
    /gamma_diversity/i,
    /gammadiversity/i,

    // Abundance and counts
    /abundance/i,
    /count/i,
    /number of species/i,
    /number_of_species/i,
    /numberofspecies/i,
    /species count/i,
    /species_count/i,
    /speciescount/i,

    // Fisher's alpha
    /fisher/i,
    /fisher's/i,
    /fishers/i,
    /fisher-alpha/i,
    /fisher_alpha/i,
    /fisheralpha/i,

    // Berger-Parker
    /berger-parker/i,
    /berger_parker/i,
    /bergerparker/i,
    /dominance index/i,
    /dominance_index/i,
    /dominanceindex/i,

    // Effective species
    /effective species/i,
    /effective_species/i,
    /effectivespecies/i,
    /effective number/i,
    /effective_number/i,
    /effectivenumber/i
];

const METADATA_PATTERNS = [
    // Time related
    /date/i,
    /time/i,
    /timestamp/i,
    /year/i,
    /month/i,
    /day/i,
    /hour/i,
    /minute/i,
    /second/i,

    // Location and site info
    /location/i,
    /site/i,
    /station/i,
    /sampling site/i,
    /sampling_site/i,
    /samplingsite/i,
    /sampling point/i,
    /sampling_point/i,
    /samplingpoint/i,

    // Sample identification
    /sample/i,
    /specimen/i,
    /id/i,
    /identifier/i,
    /code/i,
    /reference/i,
    /label/i,
    /tag/i,

    // Collection info
    /collection/i,
    /collector/i,
    /method/i,
    /protocol/i,
    /procedure/i,
    /technique/i,

    // Additional metadata
    /notes/i,
    /comment/i,
    /description/i,
    /remark/i,
    /observation/i,
    /condition/i,
    /status/i,
    /quality/i,
    /flag/i,
    /marker/i
];

function normalizeString(str: string): string {
    return str
        .toLowerCase()
        .replace(/[_-]/g, ' ')  // Replace underscores and dashes with spaces
        .replace(/\s+/g, ' ')   // Replace multiple spaces with single space
        .trim();
}

function calculateConfidence(columnName: string, patterns: RegExp[]): number {
    const normalizedName = normalizeString(columnName);
    let matches = 0;

    patterns.forEach(pattern => {
        if (pattern.test(normalizedName)) {
            matches++;
        }
    });

    // Start at 0.0 and increase based on matches
    return Math.min(matches * 0.2, 1.0);
}

export function autoDetectColumns(data: ProcessedData): DetectionResult {
    try {
        const columns: DetectedColumn[] = [];

        // Process environmental factors
        Object.entries(data.environmentalFactors).forEach(([key, values]) => {
            // Skip if all values are undefined or null
            if (!values || values.every(v => v === undefined || v === null)) {
                return;
            }

            const name = key.charAt(0).toUpperCase() + key.slice(1);
            const confidence = calculateConfidence(name, ENVIRONMENTAL_PATTERNS);
            
            columns.push({
                name,
                type: 'environmental',
                confidence,
                description: `Environmental measurement: ${name}`
            });
        });

        // Process diversity indices
        Object.entries(data.diversityIndices).forEach(([key, values]) => {
            // Skip if all values are undefined or null
            if (!values || values.every(v => v === undefined || v === null)) {
                return;
            }

            const name = key.charAt(0).toUpperCase() + key.slice(1);
            const confidence = calculateConfidence(name, DIVERSITY_PATTERNS);
            
            columns.push({
                name,
                type: 'diversity',
                confidence,
                description: `Diversity index: ${name}`
            });
        });

        // Process metadata
        Object.entries(data.metadata).forEach(([key, values]) => {
            // Handle nested locations object
            if (key === 'locations') {
                const locations = values as { lat: number[]; long: number[] };
                if (locations.lat && locations.lat.some((v: number) => v !== undefined && v !== null)) {
                    columns.push({
                        name: 'Latitude',
                        type: 'metadata',
                        confidence: calculateConfidence('Latitude', METADATA_PATTERNS),
                        description: 'Geographic latitude'
                    });
                }
                if (locations.long && locations.long.some((v: number) => v !== undefined && v !== null)) {
                    columns.push({
                        name: 'Longitude',
                        type: 'metadata',
                        confidence: calculateConfidence('Longitude', METADATA_PATTERNS),
                        description: 'Geographic longitude'
                    });
                }
                return;
            }

            // Handle string arrays
            const stringArray = values as string[];
            if (!stringArray || stringArray.every((v: string) => v === undefined || v === null)) {
                return;
            }

            const name = key.charAt(0).toUpperCase() + key.slice(1);
            const confidence = calculateConfidence(name, METADATA_PATTERNS);
            
            columns.push({
                name,
                type: 'metadata',
                confidence,
                description: `Metadata: ${name}`
            });
        });

        console.log('Auto-detected columns:', columns);

        return {
            columns: columns.sort((a, b) => b.confidence - a.confidence),
            success: columns.length > 0
        };
    } catch (error) {
        console.error('Error in autoDetectColumns:', error);
        return {
            columns: [],
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export function categorizeColumns(columns: DetectedColumn[]): {
    environmental: string[];
    diversity: string[];
    metadata: string[];
    unknown: string[];
} {
    return {
        environmental: columns.filter(c => c.type === 'environmental').map(c => c.name),
        diversity: columns.filter(c => c.type === 'diversity').map(c => c.name),
        metadata: columns.filter(c => c.type === 'metadata').map(c => c.name),
        unknown: columns.filter(c => c.type === 'unknown').map(c => c.name)
    };
}