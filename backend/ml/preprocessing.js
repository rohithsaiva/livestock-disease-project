import fs from 'fs';

// Constants for categorical encoding
export const ANIMAL_MAP = { 'Cow': 0, 'Sheep': 1, 'Buffalo': 2, 'Goat': 3 };
export const YES_NO_MAP = { 'Yes': 1, 'No': 0 };
export const VACCINE_MAP = { 'Up to date': 1, 'Not Vaccinated': 0 };
export const DISEASE_MAP = { 
    'Healthy': 0, 
    'Mastitis': 1, 
    'Foot and Mouth': 2, 
    'Respiratory Infection': 3, 
    'Heat Stress': 4 
};
export const REVERSE_DISEASE_MAP = Object.keys(DISEASE_MAP).reduce((acc, key) => {
    acc[DISEASE_MAP[key]] = key;
    return acc;
}, {});

// Normalization stats
export const normalizationStats = {
    age: { min: Infinity, max: -Infinity },
    temp: { min: Infinity, max: -Infinity },
    humidity: { min: Infinity, max: -Infinity }
};

export function initNormalizationStats(dataRows) {
    dataRows.forEach(row => {
        const age = parseFloat(row.Age);
        const temp = parseFloat(row.Temp);
        const hum = parseFloat(row.Humidity);
        
        if (age < normalizationStats.age.min) normalizationStats.age.min = age;
        if (age > normalizationStats.age.max) normalizationStats.age.max = age;
        
        if (temp < normalizationStats.temp.min) normalizationStats.temp.min = temp;
        if (temp > normalizationStats.temp.max) normalizationStats.temp.max = temp;
        
        if (hum < normalizationStats.humidity.min) normalizationStats.humidity.min = hum;
        if (hum > normalizationStats.humidity.max) normalizationStats.humidity.max = hum;
    });
}

export function normalize(value, min, max) {
    if (max === min) return 0;
    return (value - min) / (max - min);
}

export function preprocessRow(row) {
    const animal = ANIMAL_MAP[row.Animal] !== undefined ? ANIMAL_MAP[row.Animal] : 0;
    const fever = YES_NO_MAP[row.Fever] !== undefined ? YES_NO_MAP[row.Fever] : 0;
    const appetite = YES_NO_MAP[row.AppetiteLoss] !== undefined ? YES_NO_MAP[row.AppetiteLoss] : 0;
    const weakness = YES_NO_MAP[row.Weakness] !== undefined ? YES_NO_MAP[row.Weakness] : 0;
    const vaccine = VACCINE_MAP[row.Vaccination] !== undefined ? VACCINE_MAP[row.Vaccination] : 0;
    
    const age = normalize(parseFloat(row.Age), normalizationStats.age.min, normalizationStats.age.max);
    const temp = normalize(parseFloat(row.Temp), normalizationStats.temp.min, normalizationStats.temp.max);
    const humidity = normalize(parseFloat(row.Humidity), normalizationStats.humidity.min, normalizationStats.humidity.max);

    let disease = -1;
    if (row.Disease !== undefined) {
        disease = DISEASE_MAP[row.Disease];
    }

    return {
        features: [animal, age, fever, appetite, weakness, vaccine, temp, humidity],
        label: disease
    };
}

export function loadAndPreprocessDataset(filePath) {
    const csvData = fs.readFileSync(filePath, 'utf8');
    const lines = csvData.trim().split('\n');
    const headers = lines[0].split(',');

    const rawRows = [];
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length !== headers.length) continue;
        
        let rowObj = {};
        headers.forEach((header, index) => {
            rowObj[header.trim()] = values[index].trim();
        });
        rawRows.push(rowObj);
    }

    initNormalizationStats(rawRows);

    return rawRows.map(row => preprocessRow(row));
}
