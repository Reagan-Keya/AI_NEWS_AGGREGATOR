const Parser = require("rss-parser");
const parser = new Parser();

async function fetchKenyanRSSNews(url) {
  try {
    const feed = await parser.parseURL(url);

    const articles = feed.items.map((item) => {
      // Extract image from content or media:content
      let image = null;

      // Try content field
      if (item.content) {
        const match = item.content.match(/<img[^>]+src="([^">]+)"/);
        if (match) image = match[1];
      }

      // Try enclosure (common for media)
      if (!image && item.enclosure && item.enclosure.url) {
        image = item.enclosure.url;
      }

      return {
        title: item.title,
        description: item.contentSnippet || "",
        source: item.source?.title || "Google News",
        url: item.link,
        publishedAt: item.pubDate,
        image: image, // will be null if nothing found
      };
    });

    return articles;
  } catch (error) {
    console.error("RSS Error:", error.message);
    return [];
  }
}

module.exports = fetchKenyanRSSNews;