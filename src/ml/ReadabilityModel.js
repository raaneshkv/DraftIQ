class ReadabilityModel {
  static countSyllables(word) {
    word = word.toLowerCase();
    if(word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
    word = word.replace(/^y/, '');
    const match = word.match(/[aeiouy]{1,2}/g);
    return match ? match.length : 1;
  }

  static evaluate(text, audienceGoal) {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = text.match(/\b[-?a-zA-Z]+\b/g) || [];
    
    const numSentences = Math.max(1, sentences.length);
    const numWords = Math.max(1, words.length);
    const numSyllables = words.reduce((acc, word) => acc + this.countSyllables(word), 0);

    const rawGrade = 0.39 * (numWords / numSentences) + 11.8 * (numSyllables / numWords) - 15.59;
    const grade_level = Math.round(Math.max(1, rawGrade));
    const readability_score = Math.max(0, Math.min(100, Math.round(206.835 - 1.015 * (numWords / numSentences) - 84.6 * (numSyllables / numWords))));

    const audienceLevels = {
      'General User': 8,
      'School': 8,
      'College': 13,
      'Professional': 14,
      'Research': 16
    };

    // Attempt to map audience string if it exists
    let targetGrade = 10; 
    Object.keys(audienceLevels).forEach(key => {
      if(audienceGoal && audienceGoal.includes(key)) {
        targetGrade = audienceLevels[key];
      }
    });

    const difficulty_gap = grade_level - targetGrade;
    const audience_match = Math.abs(difficulty_gap) <= 2;

    let feedback = "";
    if (difficulty_gap > 2) feedback = `Content reads at grade ${grade_level}, significantly more complex than the target audience (grade ${targetGrade}).`;
    else if (difficulty_gap < -2) feedback = `Content reads at grade ${grade_level}, finding itself overly simplistic for the target audience (grade ${targetGrade}).`;
    else feedback = `Draft reads exactly at target grade level (${grade_level}), achieving perfect audience alignment.`;

    const features = [];
    if (numWords / numSentences > 20) features.push("High average sentence length detected");
    else if (numWords / numSentences < 8) features.push("Very choppy, short sentence flow");
    
    if (numSyllables / numWords > 1.6) features.push("Complex vocabulary density");
    else if (numSyllables / numWords < 1.3) features.push("Highly accessible, common vocabulary");

    return {
      grade_level,
      readability_score,
      audience_match,
      difficulty_gap,
      feedback,
      features
    };
  }
}
export default ReadabilityModel;
