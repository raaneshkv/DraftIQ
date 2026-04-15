class IntentAligner {
  static extractTone(text) {
    const formalTokens = ['furthermore', 'nevertheless', 'accordingly', 'implemented', 'significant', 'analysis'];
    const persuasiveTokens = ['essential', 'must', 'crucial', 'undoubtedly', 'clear', 'impact'];
    const technicalTokens = ['data', 'parameter', 'algorithm', 'methodology', 'framework', 'variable'];
    
    let fCount = 0, pCount = 0, tCount = 0;
    const words = text.toLowerCase().match(/\\b\\w+\\b/g) || [];
    
    words.forEach(w => {
      if(formalTokens.includes(w)) fCount++;
      if(persuasiveTokens.includes(w)) pCount++;
      if(technicalTokens.includes(w)) tCount++;
    });

    const max = Math.max(fCount, pCount, tCount);
    if(max === 0) return 'General';
    if(max === fCount) return 'Formal';
    if(max === pCount) return 'Persuasive';
    return 'Technical';
  }

  static evaluate(text, domain) {
    const toneTarget = this.extractTone(text);
    
    let tone_score = 18; 
    let d = (domain || "").toLowerCase();
    if(d.includes('essay') && toneTarget === 'Persuasive') tone_score = 25;
    else if(d.includes('report') && toneTarget === 'Formal') tone_score = 25;
    else if(d.includes('research') && toneTarget === 'Technical') tone_score = 25;
    else if(toneTarget !== 'General') tone_score = 22;
    
    const paragraphs = text.split(/\\n\\s*\\n/).filter(p => p.trim().length > 0);
    const numP = paragraphs.length || 1;
    const avgLen = paragraphs.reduce((a, b) => a + b.length, 0) / numP;
    let structure_score = 25 - Math.floor(Math.min(10, Math.abs(avgLen - 300) / 100));
    
    const uniqueWords = new Set(text.toLowerCase().match(/\\b\\w+\\b/g));
    const relevance_score = Math.min(25, 12 + Math.floor(uniqueWords.size / 15));

    let purpose_score = 16;
    if(text.includes('?')) purpose_score += 2; 
    if(text.match(/\\d+/)) purpose_score += 3;
    if(text.includes('In conclusion')) purpose_score += 4;
    purpose_score = Math.min(25, purpose_score);

    return {
      tone_score: Math.round(tone_score),
      structure_score: Math.round(structure_score),
      relevance_score: Math.round(relevance_score),
      purpose_score: Math.round(purpose_score),
      alignment_score: Math.round(tone_score + structure_score + relevance_score + purpose_score)
    };
  }
}
export default IntentAligner;
