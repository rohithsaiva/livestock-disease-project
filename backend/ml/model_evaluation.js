import { loadAndPreprocessDataset, DISEASE_MAP } from './preprocessing.js';
import { LogisticRegression } from './logistic_regression.js';
import { RandomForest } from './random_forest.js';
import { NeuralNetwork } from './deep_neural_network.js';
import { fileURLToPath } from 'url';
import path from 'path';

export let trainedModels = {};

function calculateMetrics(yTrue, yPred, numClasses) {
    let accuracy = 0;
    for (let i = 0; i < yTrue.length; i++) {
        if (yTrue[i] === yPred[i]) accuracy++;
    }
    accuracy = (accuracy / yTrue.length) * 100;

    // Macro precision and recall
    let macroPrecision = 0;
    let macroRecall = 0;

    for (let c = 0; c < numClasses; c++) {
        let tp = 0, fp = 0, fn = 0;
        for (let i = 0; i < yTrue.length; i++) {
            if (yTrue[i] === c && yPred[i] === c) tp++;
            if (yTrue[i] !== c && yPred[i] === c) fp++;
            if (yTrue[i] === c && yPred[i] !== c) fn++;
        }
        let precision = (tp + fp) === 0 ? 0 : tp / (tp + fp);
        let recall = (tp + fn) === 0 ? 0 : tp / (tp + fn);
        macroPrecision += precision;
        macroRecall += recall;
    }
    macroPrecision = (macroPrecision / numClasses) * 100;
    macroRecall = (macroRecall / numClasses) * 100;

    return { accuracy, precision: macroPrecision, recall: macroRecall };
}

export function trainAndEvaluate() {
    console.log("Loading dataset...");
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const datasetPath = path.join(__dirname, 'livestock_health_dataset_1000.csv');
    const data = loadAndPreprocessDataset(datasetPath);
    
    // Shuffle data
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]];
    }

    const splitIdx = Math.floor(data.length * 0.8);
    const trainData = data.slice(0, splitIdx);
    const testData = data.slice(splitIdx);

    const XTrain = trainData.map(d => d.features);
    const YTrain = trainData.map(d => d.label);
    const XTest = testData.map(d => d.features);
    const YTest = testData.map(d => d.label);

    const numFeatures = XTrain[0].length;
    const numClasses = Object.keys(DISEASE_MAP).length;

    console.log(`Training on ${XTrain.length} instances, testing on ${XTest.length}...`);

    // 1. Logistic Regression
    const lr = new LogisticRegression(numFeatures, numClasses, 0.1, 500);
    lr.train(XTrain, YTrain);
    const lrPreds = XTest.map(x => lr.predict(x));
    const lrMetrics = calculateMetrics(YTest, lrPreds, numClasses);
    console.log(`Logistic Regression Accuracy: ${lrMetrics.accuracy.toFixed(2)}% | Precision: ${lrMetrics.precision.toFixed(2)}% | Recall: ${lrMetrics.recall.toFixed(2)}%`);

    // 2. Random Forest
    const rf = new RandomForest(5, 5, 0.8);
    rf.train(XTrain, YTrain);
    const rfPreds = XTest.map(x => rf.predict(x));
    const rfMetrics = calculateMetrics(YTest, rfPreds, numClasses);
    console.log(`Random Forest Accuracy: ${rfMetrics.accuracy.toFixed(2)}% | Precision: ${rfMetrics.precision.toFixed(2)}% | Recall: ${rfMetrics.recall.toFixed(2)}%`);

    // 3. Neural Network
    const nn = new NeuralNetwork(numFeatures, 8, numClasses, 0.1);
    nn.train(XTrain, YTrain, 500);
    const nnPreds = XTest.map(x => nn.predict(x));
    const nnMetrics = calculateMetrics(YTest, nnPreds, numClasses);
    console.log(`Neural Network Accuracy: ${nnMetrics.accuracy.toFixed(2)}% | Precision: ${nnMetrics.precision.toFixed(2)}% | Recall: ${nnMetrics.recall.toFixed(2)}%`);

    // Export trained models
    trainedModels = {
        logisticRegression: lr,
        randomForest: rf,
        neuralNetwork: nn,
        bestModel: 'randomForest' // Required by user instruction "run through best model (Random Forest)"
    };
    
    console.log("Model training complete.");
}
