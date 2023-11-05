// fileSystem könyvtár
const fs = require("fs");

const getByID = (req, res) => {
  const id = Number(req.params.id);

  fs.readFile("./api/db.json", (err, data) => {
    // ha szerver hiba van -> error
    if (err) {
      res.status(500);
      res.send([{ error: "Data not found" }]);
    } else {
      // beolvassuk az adatokat a json file-ból
      // majd visszaadjuk a felhasználónak a kért id-val rendelkező elemet
      const list = JSON.parse(data);
      const item = list.filter((item) => item.id === id);
      res.send(item);
    }
  });
};

module.exports = getByID;
