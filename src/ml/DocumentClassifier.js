import NaiveBayes from './NaiveBayes';
import { typeData, domainData, audienceData } from './trainingData';

class DocumentClassifier {
  constructor() {
    this.typeModel = new NaiveBayes();
    this.domainModel = new NaiveBayes();
    this.audienceModel = new NaiveBayes();
    this.isTrained = false;
  }

  train() {
    if (this.isTrained) return;

    for (const item of typeData) this.typeModel.train(item.text, item.label);
    for (const item of domainData) this.domainModel.train(item.text, item.label);
    for (const item of audienceData) this.audienceModel.train(item.text, item.label);
    
    this.isTrained = true;
    console.log("Local ML Document Classifier initialized and trained successfully.");
  }

  classify(text) {
    if (!this.isTrained) this.train();
    
    // Default fallback if text is too small or untokenizable
    if (!text || text.length < 20) {
      return {
        document_type: 'General Document',
        domain: 'General',
        audience: 'General',
        confidence: 0.5
      };
    }

    const typeResult = this.typeModel.predict(text);
    const domainResult = this.domainModel.predict(text);
    const audienceResult = this.audienceModel.predict(text);

    return {
      document_type: typeResult.label,
      domain: domainResult.label,
      audience: audienceResult.label,
      confidence: ((typeResult.confidence + domainResult.confidence + audienceResult.confidence) / 3).toFixed(2)
    };
  }
}

// Export a singleton instance so it only trains once
export default new DocumentClassifier();
