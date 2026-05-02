const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.get("/stats", (req, res) => {
  res.json({
    trips: 2382,
    drivers: 64,
    earnings: 21300,
    customers: 14212
  });
});

app.listen(5000, () => {
  console.log("Backend çalışıyor: 5000");
});
