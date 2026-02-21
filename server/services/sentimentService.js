// server/services/sentimentService.js
const Sentiment = require("sentiment");
const sentiment = new Sentiment();

function analyzeSentiment(text) {
  const result = sentiment.analyze(text);

  if (result.score >= 2) return "Positive";
  if (result.score <= -2) return "Negative";
  return "Neutral";
}

module.exports = analyzeSentiment;