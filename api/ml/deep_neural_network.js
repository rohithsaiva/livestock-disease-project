// Simple Feedforward Neural Network with 1 Hidden Layer
export class NeuralNetwork {
    constructor(inputSize, hiddenSize, outputSize, learningRate = 0.05) {
        this.inputSize = inputSize;
        this.hiddenSize = hiddenSize;
        this.outputSize = outputSize;
        this.learningRate = learningRate;

        // Weights
        this.W1 = Array.from({ length: hiddenSize }, () => Array.from({ length: inputSize }, () => Math.random() * 2 - 1));
        this.W2 = Array.from({ length: outputSize }, () => Array.from({ length: hiddenSize }, () => Math.random() * 2 - 1));

        // Biases
        this.b1 = Array(hiddenSize).fill(0);
        this.b2 = Array(outputSize).fill(0);
    }

    sigmoid(z) {
        if (z < -20) return 0;
        if (z > 20) return 1;
        return 1 / (1 + Math.exp(-z));
    }

    sigmoidDerivative(a) {
        return a * (1 - a);
    }

    forward(x) {
        let hidden = Array(this.hiddenSize).fill(0);
        for (let i = 0; i < this.hiddenSize; i++) {
            let z = this.b1[i];
            for (let j = 0; j < this.inputSize; j++) {
                z += this.W1[i][j] * x[j];
            }
            hidden[i] = this.sigmoid(z);
        }

        let output = Array(this.outputSize).fill(0);
        for (let i = 0; i < this.outputSize; i++) {
            let z = this.b2[i];
            for (let j = 0; j < this.hiddenSize; j++) {
                z += this.W2[i][j] * hidden[j];
            }
            output[i] = this.sigmoid(z);
        }

        return { hidden, output };
    }

    train(X, Y, epochs = 1000) {
        for (let epoch = 0; epoch < epochs; epoch++) {
            for (let i = 0; i < X.length; i++) {
                let x = X[i];
                // One-hot encode label
                let y = Array(this.outputSize).fill(0);
                y[Y[i]] = 1;

                // Forward pass
                let { hidden, output } = this.forward(x);

                // Backward pass
                // Output layer errors
                let outputErrors = Array(this.outputSize).fill(0);
                let outputDeltas = Array(this.outputSize).fill(0);
                for (let j = 0; j < this.outputSize; j++) {
                    outputErrors[j] = y[j] - output[j];
                    outputDeltas[j] = outputErrors[j] * this.sigmoidDerivative(output[j]);
                }

                // Hidden layer errors
                let hiddenErrors = Array(this.hiddenSize).fill(0);
                let hiddenDeltas = Array(this.hiddenSize).fill(0);
                for (let j = 0; j < this.hiddenSize; j++) {
                    let error = 0;
                    for (let k = 0; k < this.outputSize; k++) {
                        error += outputDeltas[k] * this.W2[k][j];
                    }
                    hiddenErrors[j] = error;
                    hiddenDeltas[j] = hiddenErrors[j] * this.sigmoidDerivative(hidden[j]);
                }

                // Update W2 and b2
                for (let j = 0; j < this.outputSize; j++) {
                    for (let k = 0; k < this.hiddenSize; k++) {
                        this.W2[j][k] += this.learningRate * outputDeltas[j] * hidden[k];
                    }
                    this.b2[j] += this.learningRate * outputDeltas[j];
                }

                // Update W1 and b1
                for (let j = 0; j < this.hiddenSize; j++) {
                    for (let k = 0; k < this.inputSize; k++) {
                        this.W1[j][k] += this.learningRate * hiddenDeltas[j] * x[k];
                    }
                    this.b1[j] += this.learningRate * hiddenDeltas[j];
                }
            }
        }
    }

    predict(x) {
        let { output } = this.forward(x);
        let maxProb = -1;
        let bestClass = 0;
        for (let i = 0; i < this.outputSize; i++) {
            if (output[i] > maxProb) {
                maxProb = output[i];
                bestClass = i;
            }
        }
        return bestClass;
    }
}
