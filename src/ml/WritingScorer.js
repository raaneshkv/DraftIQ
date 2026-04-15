class WritingScorer {
  /**
   * Evaluates text based on 5 dimensions, returning a 0-20 score for each.
   */
  static evaluate(text) {
    if (!text || text.trim() === '' || text.split(/\s+/).length < 5) {
      return { clarity: 0, coherence: 0, grammar: 0, vocabulary: 0, structure: 0, overall_score: 0, confidence: 1 };
    }

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const paragraphs = text.split(/\n+/).filter(p => p.trim().length > 0);

    // Balanced Length Penalties
    let lengthPenalty = 1.0;
    if (words.length < 20) lengthPenalty = 0.3; // Tiny input gets crushed
    else if (words.length < 50) lengthPenalty = 0.6; // Small paragraph capped near 60

    let clarity = this.calculateClarity(words, sentences);
    let coherence = this.calculateCoherence(words, paragraphs);
    let grammar = this.calculateGrammar(text);
    let vocabulary = this.calculateVocabulary(words);
    let structure = this.calculateStructure(sentences, paragraphs);

    clarity *= lengthPenalty;
    coherence *= lengthPenalty;
    grammar *= lengthPenalty;
    vocabulary *= lengthPenalty;
    structure *= lengthPenalty;

    const overall_score = Math.round(clarity + coherence + grammar + vocabulary + structure);

    return {
      clarity: Math.round(clarity),
      coherence: Math.round(coherence),
      grammar: Math.round(grammar),
      vocabulary: Math.round(vocabulary),
      structure: Math.round(structure),
      overall_score,
      confidence: 0.96
    };
  }

  static calculateClarity(words, sentences) {
    if (sentences.length === 0) return 0;
    const avgWordsPerSentence = words.length / sentences.length;
    
    let score = 5; 
    
    if (avgWordsPerSentence >= 10 && avgWordsPerSentence <= 22) score += 15;
    else if ((avgWordsPerSentence >= 7 && avgWordsPerSentence < 10) || (avgWordsPerSentence > 22 && avgWordsPerSentence <= 30)) score += 8;
    else score -= 5; 

    const runon = sentences.filter(s => s.split(' ').length > 35).length;
    if (runon > 0) score -= (runon * 5);
    
    return Math.max(0, Math.min(20, score));
  }

  static calculateCoherence(words, paragraphs) {
    const transitionWords = new Set(['however', 'therefore', 'furthermore', 'moreover', 'thus', 'consequently', 'meanwhile', 'nevertheless', 'firstly', 'secondly', 'finally', 'additionally', 'because', 'although', 'similarly']);
    let transitionCount = 0;
    for (const word of words) {
      if (transitionWords.has(word)) transitionCount++;
    }
    
    if (transitionCount === 0) return 0; // Utter lack of transitions destroys coherence entirely
    
    let score = 5; 
    let ratio = transitionCount / Math.max(1, paragraphs.length);
    
    if (ratio >= 0.8) score += 10;
    else if (ratio >= 0.4) score += 5;
    
    if (paragraphs.length >= 2) score += 5; 
    
    return Math.max(0, Math.min(20, score));
  }

  static calculateGrammar(text) {
    if (!/[.,;!?]/.test(text)) return 0; // No punctuation means grammar evaluates to absolute 0
    
    let score = 5; // Base is lowered again
    
    const startsWithCapital = /^\s*[A-Z]/.test(text);
    if(startsWithCapital) score += 5;
    score += 5; // Reward for passing punctuation gate
    if(/[-;:—]/.test(text)) score += 5; // Bonus for advanced punctuation
    
    if (/\s{3,}/.test(text)) score -= 3;
    if (/[.!?,;]{2,}/.test(text)) score -= 5; 
    
    const badCaps = (text.match(/\.\s+[a-z]/g) || []).length;
    if (badCaps > 0) score -= (badCaps * 5); 
    
    const repeated = (text.toLowerCase().match(/\b(\w+)\s+\1\b/g) || []).length;
    if (repeated > 0) score -= (repeated * 5);

    const badI = (text.match(/\s+i\s+/g) || []).length;
    if (badI > 0) score -= 5;

    return Math.max(0, Math.min(20, score));
  }

  static calculateVocabulary(words) {
    if (words.length < 20) return 5; 
    
    const uniqueWords = new Set(words).size;
    const ttr = uniqueWords / words.length;
    
    let expectedTtr = 0.55; 
    if (words.length > 300) expectedTtr = 0.45;
    if (words.length > 800) expectedTtr = 0.35;

    let score = 5; 
    if (ttr >= expectedTtr + 0.05) score += 10;
    else if (ttr >= expectedTtr - 0.1) score += 5;
    else score -= 5;
    
    const longWords = words.filter(w => w.length >= 7).length;
    if (longWords / words.length > 0.10) score += 5; 

    return Math.max(0, Math.min(20, score));
  }

  static calculateStructure(sentences, paragraphs) {
    if (paragraphs.length <= 1) return 0; // A sheer wall of text objectively has no structural integrity

    let score = 5;
    score += 5; // Base reward for using paragraphs
    
    const avgSentencesPerP = sentences.length / paragraphs.length;
    if(avgSentencesPerP >= 3 && avgSentencesPerP <= 10) score += 10;
    else if(avgSentencesPerP >= 2 && avgSentencesPerP <= 15) score += 5;
    
    return Math.max(0, Math.min(20, score));
  }
}

export default WritingScorer;
