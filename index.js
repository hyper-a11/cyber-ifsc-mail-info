const express = require('express');
const axios = require('axios');
const { DateTime } = require('luxon');

const app = express();
const OWNER_NAME = "ZEXX_CYBER";

// 🔑 Keys Database
const KEYS_DB = {
  "ZEXX@_VIP": { expiry: "2026-12-31" },
  "OWNER_TEST": { expiry: "2035-12-30" },
  "ZEXX_@TRY": { expiry: "2026-04-15" },
  "ZEXX_P@ID": { expiry: "2026-07-01" }
};

app.use(express.json());

app.get('/search', async (req, res) => {
  const { key, type, value } = req.query;

  // 🔐 Key Check
  if (!key || !KEYS_DB[key]) {
    return res.status(401).json({
      success: false,
      type: "error",
      error: "Invalid Key!",
      owner: OWNER_NAME
    });
  }

  // 📅 Expiry Check
  const today = DateTime.local();
  const expiryDate = DateTime.fromISO(KEYS_DB[key].expiry);

  if (today > expiryDate) {
    return res.status(403).json({
      success: false,
      type: "error",
      error: "Key Expired! hogya hai pls dm owner",
      owner: OWNER_NAME
    });
  }

  // 🔎 Type & Value Check
  if (!type || !value) {
    return res.status(400).json({
      success: false,
      type: "error",
      error: "Type and value parameter required",
      owner: OWNER_NAME
    });
  }

  try {
    let apiURL = "";

    // 🔥 IFSC API
    if (type === "ifsc") {
      apiURL = "https://abbas-apis.vercel.app/api/ifsc";
    }

    // 🔥 Email API
    else if (type === "email") {
      apiURL = "https://abbas-apis.vercel.app/api/email";
    }

    else {
      return res.status(400).json({
        success: false,
        type: "error",
        error: "Invalid type! Use 'ifsc' or 'email'",
        owner: OWNER_NAME
      });
    }

    // 📡 External API Call
    const response = await axios.get(apiURL, {
      params: type === "ifsc"
        ? { ifsc: value }
        : { mail: value },
      timeout: 10000
    });

    return res.json({
      success: true,
      type: "success",
      owner: OWNER_NAME,
      data: response.data || {}
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      type: "error",
      error: error.message,
      owner: OWNER_NAME
    });
  }
});

// 🏠 Home
app.get('/', (req, res) => {
  res.json({
    success: true,
    type: "success",
    message: "API Running Successfully 🚀",
    owner: OWNER_NAME
  });
});

module.exports = app;
