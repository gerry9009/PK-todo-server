// fileSystem könyvtár
const fs = require("fs");

const getAll = (req, res) => {
  fs.readFile("./api/db.json", (err, data) => {
    // ha szerver hiba van -> error
    if (err) {
      res.status(500);
      res.send([{ error: "Data not found" }]);
    } else {
      // beolvassuk az adatokat a json file-ból és visszaadjuk a felhasználónak
      const list = JSON.parse(data);

      // sorrendbe rendezzük az elemeket id szerint
      const orderedList = list.sort((a, b) => a.id - b.id);

      res.send(orderedList);
    }
  });
};

module.exports = getAll;
