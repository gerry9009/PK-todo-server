// fileSystem könyvtár
const fs = require("fs");

const deleteByID = (req, res) => {
  const id = Number(req.params.id);

  fs.readFile("./api/db.json", (err, data) => {
    if (err) {
      res.status(500);
      res.send([{ error: "Data not found" }]);
    } else {
      // átalakítjuk az adatbázis elemeit JS által olvasható adattá
      const list = JSON.parse(data);
      // megkeressük a törölni kívánt elemet ID alapján
      const deletedItem = list.filter((item) => item.id === id);

      // ha létezik a törölni kívánt elem töröljük
      if (deletedItem.length) {
        // töröljük az adatbázis listájából a törölni kívánt elemet
        const newList = list.filter((item) => item.id !== id);

        // felülírjuk az adatbázist
        fs.writeFile("./api/db.json", JSON.stringify(newList), () => {
          // visszaküldjük a törölt elemet a felhasználónak
          res.send(deletedItem);
        });

        // ha nem létezik az elem, hibát küldünk vissza
      } else {
        res.status(404);
        res.send([{ error: `${id} id not exist` }]);
      }
    }
  });
};

module.exports = deleteByID;
