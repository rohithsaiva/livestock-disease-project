// Very basic Decision Tree and Random Forest Implementation

class DecisionTree {
    constructor(maxDepth) {
        this.maxDepth = maxDepth;
        this.tree = null;
    }

    // Gini impurity
    calculateGini(groups, classes) {
        let totalInstances = groups[0].length + groups[1].length;
        let gini = 0.0;
        
        for (let group of groups) {
            let size = group.length;
            if (size === 0) continue;
            
            let score = 0.0;
            for (let c of classes) {
                let p = group.filter(row => row[row.length - 1] === c).length / size;
                score += p * p;
            }
            gini += (1.0 - score) * (size / totalInstances);
        }
        return gini;
    }

    testSplit(index, value, dataset) {
        let left = [];
        let right = [];
        for (let row of dataset) {
            if (row[index] < value) left.push(row);
            else right.push(row);
        }
        return [left, right];
    }

    getSplit(dataset, nFeatures) {
        let classes = Array.from(new Set(dataset.map(row => row[row.length - 1])));
        let bestIndex = 999, bestValue = 999, bestScore = 999, bestGroups = null;
        
        let features = [];
        while (features.length < nFeatures) {
            let index = Math.floor(Math.random() * (dataset[0].length - 1));
            if (!features.includes(index)) features.push(index);
        }

        for (let index of features) {
            for (let row of dataset) {
                let groups = this.testSplit(index, row[index], dataset);
                let gini = this.calculateGini(groups, classes);
                if (gini < bestScore) {
                    bestIndex = index;
                    bestValue = row[index];
                    bestScore = gini;
                    bestGroups = groups;
                }
            }
        }
        return { index: bestIndex, value: bestValue, groups: bestGroups };
    }

    toTerminal(group) {
        let outcomes = group.map(row => row[row.length - 1]);
        let counts = {};
        let maxCount = 0;
        let maxClass = outcomes[0];
        
        for (let o of outcomes) {
            counts[o] = (counts[o] || 0) + 1;
            if (counts[o] > maxCount) {
                maxCount = counts[o];
                maxClass = o;
            }
        }
        return maxClass;
    }

    split(node, maxDepth, minSize, nFeatures, depth) {
        let left = node.groups[0];
        let right = node.groups[1];
        delete node.groups;

        if (!left.length || !right.length) {
            node.left = node.right = this.toTerminal(left.concat(right));
            return;
        }

        if (depth >= maxDepth) {
            node.left = this.toTerminal(left);
            node.right = this.toTerminal(right);
            return;
        }

        if (left.length <= minSize) {
            node.left = this.toTerminal(left);
        } else {
            node.left = this.getSplit(left, nFeatures);
            this.split(node.left, maxDepth, minSize, nFeatures, depth + 1);
        }

        if (right.length <= minSize) {
            node.right = this.toTerminal(right);
        } else {
            node.right = this.getSplit(right, nFeatures);
            this.split(node.right, maxDepth, minSize, nFeatures, depth + 1);
        }
    }

    train(dataset, nFeatures) {
        let root = this.getSplit(dataset, nFeatures);
        this.split(root, this.maxDepth, 1, nFeatures, 1);
        this.tree = root;
    }

    predictNode(node, row) {
        if (row[node.index] < node.value) {
            if (node.left instanceof Object && node.left.index !== undefined) {
                return this.predictNode(node.left, row);
            } else {
                return node.left;
            }
        } else {
            if (node.right instanceof Object && node.right.index !== undefined) {
                return this.predictNode(node.right, row);
            } else {
                return node.right;
            }
        }
    }

    predict(row) {
        return this.predictNode(this.tree, row);
    }
}

export class RandomForest {
    constructor(nTrees = 10, maxDepth = 10, sampleRatio = 1.0) {
        this.nTrees = nTrees;
        this.maxDepth = maxDepth;
        this.sampleRatio = sampleRatio;
        this.trees = [];
    }

    getSubsample(dataset) {
        let nSample = Math.round(dataset.length * this.sampleRatio);
        let sample = [];
        for (let i = 0; i < nSample; i++) {
            let index = Math.floor(Math.random() * dataset.length);
            sample.push(dataset[index]);
        }
        return sample;
    }

    train(X, Y) {
        // Merge X and Y for easy array manipulation
        let dataset = X.map((x, i) => [...x, Y[i]]);
        let nFeatures = Math.round(Math.sqrt(X[0].length));

        this.trees = [];
        for (let i = 0; i < this.nTrees; i++) {
            let sample = this.getSubsample(dataset);
            let tree = new DecisionTree(this.maxDepth);
            tree.train(sample, nFeatures);
            this.trees.push(tree);
        }
    }

    predict(x) {
        let predictions = this.trees.map(tree => tree.predict(x));
        
        let counts = {};
        let maxCount = 0;
        let bestClass = predictions[0];
        
        for (let p of predictions) {
            counts[p] = (counts[p] || 0) + 1;
            if (counts[p] > maxCount) {
                maxCount = counts[p];
                bestClass = p;
            }
        }
        return bestClass;
    }
}
