// Logistic Regression (Mock Model)
const LR_DISEASES = ['Bovine Viral Diarrhea', 'Foot & Mouth Disease', 'Healthy', 'Mastitis'];

export const predictLR = (inputs) => {
  // Simple heuristic simulation
  let confidence = 75 + Math.random() * 15; // 75-90%
  let prediction = 'Healthy';
  
  if (inputs.fever === 'Yes' && inputs.weakness === 'Yes') {
    prediction = 'Bovine Viral Diarrhea';
    confidence += 5;
  }
  
  if (parseFloat(inputs.temperature) > 39.5) {
    prediction = 'Foot & Mouth Disease';
  }

  return {
    model: 'Logistic Regression',
    prediction,
    confidence: parseFloat(confidence.toFixed(2))
  };
};
