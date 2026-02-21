import axios from "axios";
const BASE_URL = "http://localhost:5000/api/news";

export const fetchNews = async (category = "") => {
  try {
    const url = category ? `${BASE_URL}/${category}` : BASE_URL;
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};