import React, { useEffect, useState } from "react";
import { fetchNews } from "./services/api";
import NewsCard from "./components/NewsCard";

const categories = [
  { label: "All", value: "" },
  { label: "Politics", value: "politics" },
  { label: "Business", value: "business" },
  { label: "Sports", value: "sports" },
  { label: "Technology", value: "technology" },
  { label: "Health", value: "health" },
];

const sentiments = [
  { label: "All", value: "" },
  { label: "Positive", value: "POSITIVE" },
  { label: "Neutral", value: "NEUTRAL" },
  { label: "Negative", value: "NEGATIVE" },
];

function App() {
  const [news, setNews] = useState([]);
  const [category, setCategory] = useState("");
  const [sentimentFilter, setSentimentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Fetch news when category changes
  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchNews(category);
      // Sort by most recent first
      const sorted = data.sort(
        (a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)
      );
      setNews(sorted);
      setCurrentPage(1);
    };
    loadNews();
  }, [category]);

  // Apply sentiment filter
  const filteredNews = sentimentFilter
    ? news.filter(
        (article) =>
          article.sentiment &&
          article.sentiment.toUpperCase() === sentimentFilter
      )
    : news;

  // Pagination
  const indexOfLast = currentPage * articlesPerPage;
  const indexOfFirst = indexOfLast - articlesPerPage;
  const currentArticles = filteredNews.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Header */}
      <div className="bg-gray-900 shadow p-6 text-center">
        <h1 className="text-3xl font-bold text-white">
          AI Kenyan News Aggregator
        </h1>
      </div>

      {/* Categories Tabs */}
      <div className="flex overflow-x-auto gap-4 py-4 px-4 bg-gray-800">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setCategory(cat.value)}
            className={`px-4 py-2 rounded-full font-medium transition flex-shrink-0 ${
              category === cat.value
                ? "bg-red-600 text-white"
                : "bg-gray-700 hover:bg-gray-600 text-gray-200"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Sentiment Dropdown */}
      <div className="flex justify-end px-6 py-2">
        <select
          value={sentimentFilter}
          onChange={(e) => setSentimentFilter(e.target.value)}
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none"
        >
          {sentiments.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label} Sentiment
            </option>
          ))}
        </select>
      </div>

      {/* News Grid */}
      <div className="p-6 grid md:grid-cols-3 gap-6">
        {currentArticles.length > 0 ? (
          currentArticles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))
        ) : (
          <p className="text-center col-span-3 text-gray-500">
            No news available for the selected category and sentiment.
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-6 pb-8">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          ◀ Previous
        </button>
        <span className="font-semibold">
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
}

export default App;