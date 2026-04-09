// Random Forest (Mock Model)
// Highest accuracy model as per About page

export const predictRF = (inputs) => {
  // Simulated high accuracy mapping
  let confidence = 92 + Math.random() * 7; // 92-99%
  let prediction = 'Healthy';
  
  const temp = parseFloat(inputs.temperature);
  const humidity = parseFloat(inputs.humidity);
  
  if (inputs.fever === 'Yes') {
    if (inputs.appetiteLoss === 'Yes' && inputs.weakness === 'Yes') {
      prediction = 'Foot & Mouth Disease';
    } else if (temp > 40.0) {
      prediction = 'Bovine Respiratory Disease';
    } else {
      prediction = 'Lumpy Skin Disease';
    }
  } else if (inputs.appetiteLoss === 'Yes' && humidity > 70) {
    prediction = 'Internal Parasites';
  }

  return {
    model: 'Random Forest',
    prediction,
    confidence: parseFloat(confidence.toFixed(2))
  };
};
