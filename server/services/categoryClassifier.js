function classifyCategory(text) {
  const content = text.toLowerCase();

  const categories = {
    politics: ["government", "president", "parliament", "senate", "election", "mp", "governor"],
    business: ["market", "economy", "bank", "investment", "company", "stock", "finance"],
    sports: ["match", "football", "athlete", "tournament", "league", "goal", "coach"],
    technology: ["tech", "ai", "software", "startup", "internet", "cyber", "digital"],
    health: ["hospital", "doctor", "health", "disease", "vaccine", "medical", "covid"]
  };

  let scores = {};

  for (let category in categories) {
    scores[category] = 0;

    categories[category].forEach(keyword => {
      if (content.includes(keyword)) {
        scores[category] += 1;
      }
    });
  }

  // Find category with highest score
  let bestCategory = "general";
  let maxScore = 0;

  for (let category in scores) {
    if (scores[category] > maxScore) {
      maxScore = scores[category];
      bestCategory = category;
    }
  }

  return bestCategory;
}

module.exports = classifyCategory;