// index.js on Replit or Render

const express = require("express");
const app = express();
// Increased limit just in case, though Roblox's request limit is the real constraint (~1MB)
app.use(express.json({ limit: "50mb" }));

let allData = {};

// Your API Key middleware (no changes needed here)
const checkApiKey = (req, res, next) => {
  const apiKey = req.get("x-api-key");
  if (!process.env.API_KEY || apiKey !== process.env.API_KEY) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

// ✨ NEW: Route to handle batched data
app.post("/add-batch", checkApiKey, (req, res) => {
  const { dataStoreName, entries } = req.body;

  if (!dataStoreName || !entries || !Array.isArray(entries)) {
    return res.status(400).send("Missing or invalid dataStoreName or entries array.");
  }

  if (!allData[dataStoreName]) {
    allData[dataStoreName] = {};
  }

  // Loop through the array of entries and add them to the data
  for (const entry of entries) {
    if (entry.key) {
      allData[dataStoreName][entry.key] = entry.value;
    }
  }

  console.log(`Received batch of ${entries.length} keys for DataStore: ${dataStoreName}`);
  res.status(200).send("Batch received.");
});

// Old route for single entries (can be kept for testing or removed)
app.post("/add", checkApiKey, (req, res) => {
  const { dataStoreName, key, value } = req.body;
  if (!dataStoreName || !key) {
    return res.status(400).send("Missing dataStoreName or key.");
  }
  if (!allData[dataStoreName]) {
    allData[dataStoreName] = {};
  }
  allData[dataStoreName][key] = value;
  console.log(`Received key: ${key} for DataStore: ${dataStoreName}`);
  res.status(200).send("Data received.");
});


// Route to get all data (no changes needed)
app.get("/get", checkApiKey, (req, res) => {
  console.log("Sending all data to the new game.");
  res.json(allData);
});

// Route to clear the data (no changes needed)
app.post("/clear", checkApiKey, (req, res) => {
  allData = {};
  console.log("Server data has been cleared.");
  res.status(200).send("Data cleared.");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000.");
});