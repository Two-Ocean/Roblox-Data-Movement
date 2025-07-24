// index.js on Replit

const express = require("express");
const app = express();
app.use(express.json({ limit: "50mb" }));

let allData = {};

const checkApiKey = (req, res, next) => {
  const apiKey = req.get("x-api-key");
  // Note: Replit injects secrets into process.env
  if (!process.env.API_KEY || apiKey !== process.env.API_KEY) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

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

app.get("/get", checkApiKey, (req, res) => {
  console.log("Sending all data to the new game.");
  res.json(allData);
});

// Route to clear the data
app.post("/clear", checkApiKey, (req, res) => {
  allData = {};
  console.log("Server data has been cleared.");
  res.status(200).send("Data cleared.");
});

app.listen(3000, () => {
  console.log("Server is running.");
});
