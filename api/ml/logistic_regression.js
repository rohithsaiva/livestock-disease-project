// Multinomial Logistic Regression (One-vs-Rest)
export class LogisticRegression {
    constructor(numFeatures, numClasses, learningRate = 0.01, iterations = 1000) {
        this.numFeatures = numFeatures;
        this.numClasses = numClasses;
        this.learningRate = learningRate;
        this.iterations = iterations;
        
        // Weights and bias for each class
        this.weights = Array.from({ length: numClasses }, () => Array(numFeatures).fill(0));
        this.biases = Array(numClasses).fill(0);
    }

    sigmoid(z) {
        // Prevent overflow
        if (z < -20) return 0;
        if (z > 20) return 1;
        return 1 / (1 + Math.exp(-z));
    }

    train(X, Y) {
        // Train a separate binary classifier for each class (One-vs-Rest)
        for (let c = 0; c < this.numClasses; c++) {
            // Label mapping for current class: 1 if matches current class, else 0
            const binaryY = Y.map(y => y === c ? 1 : 0);

            for (let iter = 0; iter < this.iterations; iter++) {
                let weightGradients = Array(this.numFeatures).fill(0);
                let biasGradient = 0;

                for (let i = 0; i < X.length; i++) {
                    // Compute linear combination
                    let z = this.biases[c];
                    for (let j = 0; j < this.numFeatures; j++) {
                        z += this.weights[c][j] * X[i][j];
                    }

                    // Predict
                    let prediction = this.sigmoid(z);

                    // Error
                    let error = prediction - binaryY[i];

                    // Gradients
                    for (let j = 0; j < this.numFeatures; j++) {
                        weightGradients[j] += error * X[i][j];
                    }
                    biasGradient += error;
                }

                // Update Weights
                for (let j = 0; j < this.numFeatures; j++) {
                    this.weights[c][j] -= this.learningRate * (weightGradients[j] / X.length);
                }
                this.biases[c] -= this.learningRate * (biasGradient / X.length);
            }
        }
    }

    predict(x) {
        let maxProb = -1;
        let bestClass = 0;

        for (let c = 0; c < this.numClasses; c++) {
            let z = this.biases[c];
            for (let j = 0; j < this.numFeatures; j++) {
                z += this.weights[c][j] * x[j];
            }
            let prob = this.sigmoid(z);
            if (prob > maxProb) {
                maxProb = prob;
                bestClass = c;
            }
        }
        return bestClass;
    }
}
