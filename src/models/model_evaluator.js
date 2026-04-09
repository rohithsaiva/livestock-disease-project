// Model Evaluator
// Orchestrates running all 4 models and producing the Ensemble Verdict

import { predictLR } from './logistic_regression';
import { predictSVM } from './svm';
import { predictRF } from './random_forest';
import { predictDNN } from './deep_neural_network';

export const runAllModels = (inputs) => {
  const lrResult = predictLR(inputs);
  const svmResult = predictSVM(inputs);
  const rfResult = predictRF(inputs);
  const dnnResult = predictDNN(inputs);

  const results = [lrResult, svmResult, rfResult, dnnResult];

  // Calculate ensemble verdict - weighted highly towards Random Forest as per specs
  const predictions = {};
  results.forEach(res => {
    // 2x weight for RF
    const weight = res.model === 'Random Forest' ? 2 : 1;
    predictions[res.prediction] = (predictions[res.prediction] || 0) + weight;
  });

  // Find majority predicted disease
  let ensemblePrediction = 'Healthy';
  let maxWeight = 0;
  Object.entries(predictions).forEach(([pred, weight]) => {
    if (weight > maxWeight) {
      maxWeight = weight;
      ensemblePrediction = pred;
    }
  });

  // Calculate average confidence for the ensemble
  const matchingConfidences = results.filter(r => r.prediction === ensemblePrediction).map(r => r.confidence);
  let ensembleConfidence = (matchingConfidences.reduce((a, b) => a + b, 0) / matchingConfidences.length) || 90;
  
  if (ensemblePrediction !== 'Healthy') {
    ensembleConfidence = Math.min(99.6, ensembleConfidence + 2.5); // Boost confidence on consensus
  }

  return {
    individual: results,
    ensemble: {
      prediction: ensemblePrediction,
      confidence: parseFloat(ensembleConfidence.toFixed(2))
    }
  };
};
