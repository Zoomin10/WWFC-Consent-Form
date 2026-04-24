const express = require("express");
const cors = require("cors");
const consentRoutes = require("./routes/consent");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/consent", consentRoutes);
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "WWFC consent backend" });
});

module.exports = app;

