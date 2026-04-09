// Support Vector Machine (Mock Model)
const SVM_DISEASES = ['Lumpy Skin Disease', 'Foot & Mouth Disease', 'Healthy', 'Blackleg'];

export const predictSVM = (inputs) => {
  // Simple heuristic simulation
  let confidence = 80 + Math.random() * 12; // 80-92%
  let prediction = 'Healthy';
  
  if (inputs.fever === 'Yes' && inputs.appetiteLoss === 'Yes') {
    prediction = 'Foot & Mouth Disease';
    confidence += 3;
  }
  
  if (inputs.weakness === 'Yes' && parseFloat(inputs.temperature) > 39.0) {
    prediction = 'Lumpy Skin Disease';
  }

  return {
    model: 'Support Vector Machine',
    prediction,
    confidence: parseFloat(confidence.toFixed(2))
  };
};
