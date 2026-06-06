const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const consentRoutes = require("./routes/consent");
const adminRoutes = require("./routes/admin");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use("/api/consent", consentRoutes);
app.use("/api/admin", adminRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", app: "WWFC consent backend" });
});

module.exports = app;