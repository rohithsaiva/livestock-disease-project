// Deep Neural Network (Mock Model)

export const predictDNN = (inputs) => {
  // Deep pattern simulation
  let confidence = 85 + Math.random() * 10; // 85-95%
  let prediction = 'Healthy';
  
  if (inputs.fever === 'Yes' || parseFloat(inputs.temperature) > 39.5) {
    if (inputs.vaccination !== 'Up to date') {
      prediction = 'Foot & Mouth Disease';
      confidence += 2;
    } else {
      prediction = 'Lumpy Skin Disease';
    }
  }

  return {
    model: 'Deep Neural Network',
    prediction,
    confidence: parseFloat(confidence.toFixed(2))
  };
};
