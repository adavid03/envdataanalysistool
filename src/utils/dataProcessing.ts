import * as XLSX from 'xlsx';

interface ExcelRow {
  'Barcode': string;
  'Original Qubit (ng/ul)': number;
  'Reads assigned': number;
  'Sample Code': string;
  'Date': string;
  'Longitude': number;
  'Latitude': number;
  'Elevation': number;
  'Avg Temperature': number;
  'Departure': number;
  'pH': number;
  'General hardness (calcium carbonate)': number;
  'Total alkalinity ': number;  // Note the space at the end
  'Carbonate ': number;  // Note the space at the end
  'Phosphate': number;
  'Nitrate  ': number;  // Note the spaces at the end
  'Nitrite ': number;  // Note the space at the end
  'Free chlorine': number;
  'Radioactivity above background': string;  // Changed to string since it's "Yes"/"No"
  'Shannon diversity index': number;
  "Simpson's index": number;
  "Inverse Simpson's index": number;
  'Berger Parker index': number;
  'Effective number of species': number;
  "Fisher's alpha": number;
  "Pielou's evenness": number;
  'Richness': number;
  'Soil Type': string;
  'Specific soil type name': string;
  'Rock Type': string;
  'Esri Symbology (Rock Age)': string;
  'Ecoregion': string;
}

export interface ProcessedData {
  metadata: {
    sampleCodes: string[];
    dates: string[];
    locations: { lat: number[]; long: number[] };
  };
  environmentalFactors: {
    temperature: number[];
    departure: number[];
    ph: number[];
    elevation: number[];
    hardness: number[];
    alkalinity: number[];
    carbonate: number[];
    phosphate: number[];
    nitrate: number[];
    nitrite: number[];
    chlorine: number[];
    radioactivity: number[];  // Will store 1 for Yes, 0 for No
    longitude: number[];
    latitude: number[];
  };
  diversityIndices: {
    shannon: number[];
    simpson: number[];
    inverseSimpson: number[];
    bergerParker: number[];
    effectiveSpecies: number[];
    fishersAlpha: number[];
    pielouEvenness: number[];
    richness: number[];
  };
}

export async function processExcelFile(file: File): Promise<ProcessedData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as ExcelRow[];

        // Log the column names from the first row
        if (jsonData.length > 0) {
          console.log('Available columns in Excel file:', Object.keys(jsonData[0]));
        }
        
        // Create the processed data object
        const processed: ProcessedData = {
          metadata: {
            sampleCodes: jsonData.map(row => {
              if (!row['Sample Code']) console.warn('Missing Sample Code in row:', row);
              return row['Sample Code'];
            }),
            dates: jsonData.map(row => {
              if (!row['Date']) console.warn('Missing Date in row:', row);
              return row['Date'];
            }),
            locations: {
              lat: jsonData.map(row => {
                if (typeof row['Latitude'] !== 'number') console.warn('Invalid Latitude in row:', row);
                return row['Latitude'];
              }),
              long: jsonData.map(row => {
                if (typeof row['Longitude'] !== 'number') console.warn('Invalid Longitude in row:', row);
                return row['Longitude'];
              }),
            },
          },
          environmentalFactors: {
            temperature: jsonData.map(row => {
              if (typeof row['Avg Temperature'] !== 'number') console.warn('Invalid Temperature in row:', row);
              return row['Avg Temperature'];
            }),
            departure: jsonData.map(row => {
              if (typeof row['Departure'] !== 'number') console.warn('Invalid Departure in row:', row);
              return row['Departure'];
            }),
            ph: jsonData.map(row => {
              if (typeof row['pH'] !== 'number') console.warn('Invalid pH in row:', row);
              return row['pH'];
            }),
            elevation: jsonData.map(row => {
              if (typeof row['Elevation'] !== 'number') console.warn('Invalid Elevation in row:', row);
              return row['Elevation'];
            }),
            hardness: jsonData.map(row => {
              if (typeof row['General hardness (calcium carbonate)'] !== 'number') 
                console.warn('Invalid Hardness in row:', row);
              return row['General hardness (calcium carbonate)'];
            }),
            alkalinity: jsonData.map(row => {
              if (typeof row['Total alkalinity '] !== 'number') console.warn('Invalid Alkalinity in row:', row);
              return row['Total alkalinity '];
            }),
            carbonate: jsonData.map(row => {
              if (typeof row['Carbonate '] !== 'number') console.warn('Invalid Carbonate in row:', row);
              return row['Carbonate '];
            }),
            phosphate: jsonData.map(row => {
              if (typeof row['Phosphate'] !== 'number') console.warn('Invalid Phosphate in row:', row);
              return row['Phosphate'];
            }),
            nitrate: jsonData.map(row => {
              if (typeof row['Nitrate  '] !== 'number') console.warn('Invalid Nitrate in row:', row);
              return row['Nitrate  '];
            }),
            nitrite: jsonData.map(row => {
              if (typeof row['Nitrite '] !== 'number') console.warn('Invalid Nitrite in row:', row);
              return row['Nitrite '];
            }),
            chlorine: jsonData.map(row => {
              if (typeof row['Free chlorine'] !== 'number') console.warn('Invalid Chlorine in row:', row);
              return row['Free chlorine'];
            }),
            radioactivity: jsonData.map(row => {
              const value = row['Radioactivity above background'];
              if (typeof value !== 'string') {
                console.warn('Invalid Radioactivity in row:', row);
                return 0;
              }
              return value.toLowerCase() === 'yes' ? 1 : 0;
            }),
            longitude: jsonData.map(row => {
              if (typeof row['Longitude'] !== 'number') console.warn('Invalid Longitude in row:', row);
              return row['Longitude'];
            }),
            latitude: jsonData.map(row => {
              if (typeof row['Latitude'] !== 'number') console.warn('Invalid Latitude in row:', row);
              return row['Latitude'];
            }),
          },
          diversityIndices: {
            shannon: jsonData.map(row => {
              if (typeof row['Shannon diversity index'] !== 'number') 
                console.warn('Invalid Shannon index in row:', row);
              return row['Shannon diversity index'];
            }),
            simpson: jsonData.map(row => {
              if (typeof row["Simpson's index"] !== 'number') 
                console.warn('Invalid Simpson index in row:', row);
              return row["Simpson's index"];
            }),
            inverseSimpson: jsonData.map(row => {
              if (typeof row["Inverse Simpson's index"] !== 'number') 
                console.warn('Invalid Inverse Simpson index in row:', row);
              return row["Inverse Simpson's index"];
            }),
            bergerParker: jsonData.map(row => {
              if (typeof row['Berger Parker index'] !== 'number') 
                console.warn('Invalid Berger-Parker index in row:', row);
              return row['Berger Parker index'];
            }),
            effectiveSpecies: jsonData.map(row => {
              if (typeof row['Effective number of species'] !== 'number') 
                console.warn('Invalid Effective species in row:', row);
              return row['Effective number of species'];
            }),
            fishersAlpha: jsonData.map(row => {
              if (typeof row["Fisher's alpha"] !== 'number') 
                console.warn("Invalid Fisher's alpha in row:", row);
              return row["Fisher's alpha"];
            }),
            pielouEvenness: jsonData.map(row => {
              if (typeof row["Pielou's evenness"] !== 'number') 
                console.warn("Invalid Pielou's evenness in row:", row);
              return row["Pielou's evenness"];
            }),
            richness: jsonData.map(row => {
              if (typeof row['Richness'] !== 'number') console.warn('Invalid Richness in row:', row);
              return row['Richness'];
            }),
          },
        };
        
        resolve(processed);
      } catch (error) {
        console.error('Error processing Excel file:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
} 