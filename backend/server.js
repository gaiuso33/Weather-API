import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());

app.get("/weather", async (req, res) => {
  const location = req.query.location;

  if (!location) {
    return res.status(400).json({ error: "Location is required" });
  }

  try {
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${process.env.WEATHER_API_KEY}&q=${location}&days=3&aqi=no&alerts=no`
    );

    if (!response.ok) {
      return res.status(404).json({ error: "Location not found" });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});