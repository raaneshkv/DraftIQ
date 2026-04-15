class PatternAnalyzer {
  static evaluate(text) {
    const patterns = [];
    let weakArea = "General Flow";
    let tip = "Continue refining your drafts for structural consistency.";
    
    // Check passive voice density
    const passiveMatches = text.match(/\\b(am|is|are|was|were|be|been|being)\\s+([a-z]+ed)\\b/gi) || [];
    if(passiveMatches.length > 3) {
      patterns.push(`Heavy reliance on passive voice (${passiveMatches.length} instances)`);
      weakArea = "Voice Activeness";
      tip = "Shift your verbs to active voice to make the text far more engaging.";
    }

    // Check weak modifications
    const weakAdverbs = text.match(/\\b(very|really|just|quite|maybe|perhaps)\\b/gi) || [];
    if(weakAdverbs.length > 4) {
      patterns.push(`Overutilization of weak modifying adverbs`);
      weakArea = "Vocabulary Precision";
      tip = "Delete words like 'very' or 'really' and choose stronger root verbs.";
    }

    // Check run on sentences
    const longSentences = text.split(/[.!?]+/).filter(s => (s.match(/\\b\\w+\\b/g) || []).length > 30);
    if(longSentences.length > 2) {
      patterns.push(`Tendency to write run-on, meandering sentences`);
      if(!weakArea.includes("Voice")) {
         weakArea = "Sentence Pacing";
         tip = "Break your longest sentences in half to give the reader's cadence a rest.";
      }
    }

    // Default if text is great
    if(patterns.length === 0) {
      patterns.push("Consistent, active structural flow");
      weakArea = "Perfecting Transitions";
      tip = "Your voice is strong. Focus entirely on smoothing the textual bridges between paragraphs.";
    }

    return {
      weakArea,
      pattern: patterns[0], 
      tip
    };
  }
}
export default PatternAnalyzer;
