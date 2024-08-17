const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
const secretKey = "your_secret_key";
const tokenFilePath = "./tokens.txt";
const appLink = "/app/0bfb3081-e3c9-4d25-8d79-7b1fdfb1353f";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

app.post("/gettingNewToken", (req, res) => {
  const { email, password } = req.body;
  // Check if email is valid
  if (!isValidEmail(email)) {
    return res.status(500).json({ error: "Invalid email address" });
  }
  const uniqueId = uuidv4(); // Generate a UUID
  const expiresIn = 9999 * 365 * 24 * 60 * 60; // 9999 years
  // Generate the token with email and password
  const token = jwt.sign({ email, password }, secretKey, {
    expiresIn: expiresIn,
    algorithm: "HS256",
  });

  // Save token to file
  fs.writeFile(tokenFilePath, `${token}${appLink}`, (err) => {
    if (err) {
      console.error("Error saving token to file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    res.json({ token: `${token}${appLink}`, email: email, password: password });
  });
});

// Route for getting email and password from a token
app.get("/token", (req, res) => {
  // Read tokens from file
  fs.readFile(tokenFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading token file:", err);
      return res.status(500).json({ error: "Internal server error" });
    }

    let extractedTokens;
    try {
      const decoded = jwt.verify(data.split(appLink)[0], secretKey);
      const { email, password } = decoded;
      extractedTokens = { email, password, token: data };
    } catch (err) {
      console.error("Error decoding token:", err);
      extractedTokens = { error: "Invalid token" };
    }

    res.json(extractedTokens);
  });
});

app.use(
  express.static(path.join(__dirname, "../Frontend(angular)/angular-app/dist/angular-app"))
);

// Handle all other routes and return the "index.html" file
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../Frontend(angular)/angular-app/dist/angular-app/index.html")
  );
});

app.listen(80, () => {
  console.log("Server is running on port 80");
});
