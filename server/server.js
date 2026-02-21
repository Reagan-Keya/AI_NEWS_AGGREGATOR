const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const analyzeSentiment = require("./services/sentimentService");
const fetchKenyanRSSNews = require("./services/rssService");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("AI Kenyan News Aggregator Backend is Running - Google RSS Version ✅");
});

// Map categories to Google News RSS URLs
const CATEGORY_FEEDS = {
  politics: "https://news.google.com/rss/search?q=Kenya+politics&hl=en-KE&gl=KE&ceid=KE:en",
  business: "https://news.google.com/rss/search?q=Kenya+business&hl=en-KE&gl=KE&ceid=KE:en",
  sports: "https://news.google.com/rss/search?q=Kenya+sports&hl=en-KE&gl=KE&ceid=KE:en",
  technology: "https://news.google.com/rss/search?q=Kenya+technology&hl=en-KE&gl=KE&ceid=KE:en",
  health: "https://news.google.com/rss/search?q=Kenya+health&hl=en-KE&gl=KE&ceid=KE:en",
};

// =============================
// FETCH ALL NEWS (ALL CATEGORIES)
// =============================
app.get("/api/news", async (req, res) => {
  try {
    const categoryKeys = Object.keys(CATEGORY_FEEDS);

    // Fetch all categories in parallel
    const results = await Promise.all(
      categoryKeys.map(async (key) => {
        const articles = await fetchKenyanRSSNews(CATEGORY_FEEDS[key]);

        return articles.map((article) => ({
          ...article,
          category: key.charAt(0).toUpperCase() + key.slice(1),
          sentiment: analyzeSentiment(
            (article.title || "") + " " + (article.description || "")
          ),
        }));
      })
    );

    // Combine all results
    let combinedNews = results.flat();

    // Remove duplicate articles (based on URL)
    const uniqueNews = combinedNews.filter(
      (article, index, self) =>
        index === self.findIndex((a) => a.url === article.url)
    );

    // Sort latest first
    uniqueNews.sort(
      (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
    );

    res.json(uniqueNews);
  } catch (error) {
    console.error("Error in /api/news:", error.message);
    res.status(500).json({ error: "Failed to fetch all Kenyan news" });
  }
});

// =============================
// FETCH CATEGORY-SPECIFIC NEWS
// =============================
app.get("/api/news/:category", async (req, res) => {
  try {
    const categoryKey = req.params.category.toLowerCase();

    // If category not found, return empty array instead of defaulting to politics
    if (!CATEGORY_FEEDS[categoryKey]) {
      return res.json([]);
    }

    const articles = await fetchKenyanRSSNews(
      CATEGORY_FEEDS[categoryKey]
    );

    const analyzedNews = articles
      .map((article) => ({
        ...article,
        category:
          categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1),
        sentiment: analyzeSentiment(
          (article.title || "") + " " + (article.description || "")
        ),
      }))
      .sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );

    res.json(analyzedNews);
  } catch (error) {
    console.error("Error in /api/news/:category:", error.message);
    res.status(500).json({ error: "Failed to fetch category news" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} ✅`);
});