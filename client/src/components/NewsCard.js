import React from "react";

// Function to color sentiment indicator
const getSentimentColor = (sentiment) => {
  if (!sentiment) return "bg-gray-400";
  const s = sentiment.toUpperCase();
  if (s === "POSITIVE") return "bg-green-500";
  if (s === "NEGATIVE") return "bg-red-500";
  if (s === "NEUTRAL") return "bg-yellow-400";
  return "bg-gray-400";
};

// Function to color category badges
const getCategoryColor = (category) => {
  switch (category?.toLowerCase()) {
    case "politics":
      return "bg-blue-600";
    case "business":
      return "bg-green-600";
    case "sports":
      return "bg-red-600";
    case "technology":
      return "bg-purple-600";
    case "health":
      return "bg-pink-600";
    default:
      return "bg-gray-600";
  }
};

const NewsCard = ({ article }) => {
  return (
    <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:scale-105 transform transition duration-300 flex flex-col relative">
      
      {/* Category badge */}
      {article.category && (
        <div
          className={`absolute mt-2 ml-2 px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(
            article.category
          )}`}
        >
          {article.category.toUpperCase()}
        </div>
      )}

      {/* Image Section */}
      {article.image && article.image.startsWith("http") ? (
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-700" />
      )}

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">

        {/* Title */}
        <h2 className="text-lg font-bold text-white mb-2 line-clamp-2">
          {article.title}
        </h2>

        {/* Description */}
        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
          {article.description}
        </p>

        {/* Source + Date + Sentiment */}
        <div className="flex justify-between items-center mt-auto text-xs text-gray-400">
          <span>{article.source}</span>
          <span>{new Date(article.publishedAt).toLocaleString()}</span>
          <div className="flex items-center gap-1">
            <div
              className={`w-3 h-3 rounded-full ${getSentimentColor(
                article.sentiment
              )}`}
            ></div>
            <span>{article.sentiment || "NEUTRAL"}</span>
          </div>
        </div>

        {/* Read more button */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 bg-red-600 hover:bg-red-700 text-white text-center py-2 rounded-lg transition duration-300"
        >
          Read Full Article
        </a>
      </div>
    </div>
  );
};

export default NewsCard;