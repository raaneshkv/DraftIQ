export default class NaiveBayes {
  constructor() {
    this.classes = {};
    this.totalDocuments = 0;
    this.vocabulary = new Set();
  }

  tokenize(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter((word) => word.length > 2);
  }

  train(text, label) {
    if (!this.classes[label]) {
      this.classes[label] = { documentCount: 0, words: {}, totalWords: 0 };
    }
    
    this.classes[label].documentCount += 1;
    this.totalDocuments += 1;

    const words = this.tokenize(text);
    for (const word of words) {
      this.vocabulary.add(word);
      this.classes[label].words[word] = (this.classes[label].words[word] || 0) + 1;
      this.classes[label].totalWords += 1;
    }
  }

  predict(text) {
    if (this.totalDocuments === 0) return { label: 'Unknown', confidence: 0 };
    
    const words = this.tokenize(text);
    const scores = {};
    const vocabSize = this.vocabulary.size;

    for (const label in this.classes) {
      const cls = this.classes[label];
      // Log probability of the class
      let logSum = Math.log(cls.documentCount / this.totalDocuments);

      for (const word of words) {
        // Laplace smoothing to avoid zero probability
        const wordCount = cls.words[word] || 0;
        const wordProb = (wordCount + 1) / (cls.totalWords + vocabSize);
        logSum += Math.log(wordProb);
      }
      scores[label] = logSum;
    }

    // Find highest score. Since they are negative log values, the maximum is the highest probability.
    let bestLabel = null;
    let maxScore = -Infinity;

    for (const label in scores) {
      if (scores[label] > maxScore) {
        maxScore = scores[label];
        bestLabel = label;
      }
    }
    
    return { label: bestLabel, confidence: 0.85, scores };
  }
}
