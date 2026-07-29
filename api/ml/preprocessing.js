import fs from 'fs';

// Constants for categorical encoding
export const ANIMAL_MAP = { 'Cow': 0, 'Sheep': 1, 'Buffalo': 2, 'Goat': 3 };
export const YES_NO_MAP = { 'Yes': 1, 'No': 0 };
export const VACCINE_MAP = { 'Up to date': 1, 'Not Vaccinated': 0 };
export const DISEASE_MAP = { 
    'Healthy': 0, 
    'Infection': 1, 
    'Minor Illness': 2, 
    'FMD': 3, 
    'Lumpy Skin Disease': 4 
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
        const age = parseFloat(row.Age !== undefined ? row.Age : row.Age_years);
        const temp = parseFloat(row.Temp !== undefined ? row.Temp : row.Core_Temperature_C);
        const hum = parseFloat(row.Humidity !== undefined ? row.Humidity : row['Surrounding_Humidity_%']);
        
        if (!isNaN(age)) {
            if (age < normalizationStats.age.min) normalizationStats.age.min = age;
            if (age > normalizationStats.age.max) normalizationStats.age.max = age;
        }
        
        if (!isNaN(temp)) {
            if (temp < normalizationStats.temp.min) normalizationStats.temp.min = temp;
            if (temp > normalizationStats.temp.max) normalizationStats.temp.max = temp;
        }
        
        if (!isNaN(hum)) {
            if (hum < normalizationStats.humidity.min) normalizationStats.humidity.min = hum;
            if (hum > normalizationStats.humidity.max) normalizationStats.humidity.max = hum;
        }
    });
}

export function normalize(value, min, max) {
    if (max === min) return 0;
    return (value - min) / (max - min);
}

export function preprocessRow(row) {
    const rawAnimal = row.Animal !== undefined ? row.Animal : row.Animal_Type;
    const rawFever = row.Fever !== undefined ? row.Fever : row.Fever_Detected;
    const rawAppetite = row.AppetiteLoss !== undefined ? row.AppetiteLoss : row.Appetite_Loss;
    const rawWeakness = row.Weakness !== undefined ? row.Weakness : row.Physical_Weakness;
    const rawVaccine = row.Vaccination !== undefined ? row.Vaccination : row.Vaccination_Status;

    const animal = ANIMAL_MAP[rawAnimal] !== undefined ? ANIMAL_MAP[rawAnimal] : 0;
    const fever = YES_NO_MAP[rawFever] !== undefined ? YES_NO_MAP[rawFever] : 0;
    const appetite = YES_NO_MAP[rawAppetite] !== undefined ? YES_NO_MAP[rawAppetite] : 0;
    const weakness = YES_NO_MAP[rawWeakness] !== undefined ? YES_NO_MAP[rawWeakness] : 0;
    const vaccine = VACCINE_MAP[rawVaccine] !== undefined ? VACCINE_MAP[rawVaccine] : 0;
    
    const rawAge = parseFloat(row.Age !== undefined ? row.Age : row.Age_years);
    const rawTemp = parseFloat(row.Temp !== undefined ? row.Temp : row.Core_Temperature_C);
    const rawHum = parseFloat(row.Humidity !== undefined ? row.Humidity : row['Surrounding_Humidity_%']);

    const age = normalize(rawAge, normalizationStats.age.min, normalizationStats.age.max);
    const temp = normalize(rawTemp, normalizationStats.temp.min, normalizationStats.temp.max);
    const humidity = normalize(rawHum, normalizationStats.humidity.min, normalizationStats.humidity.max);

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
