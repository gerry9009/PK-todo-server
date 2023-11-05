const express = require("express");
const app = express();

// szükséges cors, hogy külső oldalról is lehessen kéréseket küldeni
// az oldalra
const cors = require("cors");

// bodyParser -> http POST request-ek kezelése miatt szükséges
const bodyParser = require("body-parser");

const port = 8008;

// middleweare
app.use(bodyParser.json());
app.use(cors());

// betöltjük az alútvonalakat
const routes = require("./routes/routes");

// megadjuk az express routernek,
// hogy milyen útvonalon milyen alútvonalakat használjon
app.use("/api/", routes);

// Ha nem megfelelő az URL hibát küldünk vissza
app.get("*", (req, res) => {
  res.send([{ error: "URL not found" }]);
});

// elindítjuk a szerver működését
app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
