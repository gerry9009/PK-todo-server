// fileSystem könyvtár
const fs = require("fs");

const patchByID = (req, res) => {
  const id = Number(req.params.id);
  const reqItem = req.body;

  console.log(id, reqItem);
  // Data value validation
  let error = false;
  // Leellenőrizzük, hogy megfelelő kulcs érték került-e beküldésre
  if ("task" in reqItem || "done" in reqItem || "deadline" in reqItem) {
    // Validáljuk az egyes kulcsok értékeit ha léteznek
    if ("task" in reqItem) {
      if (typeof reqItem.task !== "string" || reqItem.task.length < 1)
        error = true;
    }

    if ("done" in reqItem) {
      if (typeof reqItem.done !== "boolean") error = true;
    }

    if ("deadline" in reqItem) {
      if (typeof reqItem.deadline !== "string") error = true;
    }
    // ha nem megfelelő a kulcs -> error
  } else {
    error = true;
  }

  // ha hiba van a beküldött adattal -> error
  if (error) {
    res.status(400);
    res.send([{ error: "Inappropriate item" }]);
    // ha minden rendben, módosítjuk az adatbázist
  } else {
    fs.readFile("./api/db.json", (err, data) => {
      // ha szerver hiba van -> error
      if (err) {
        res.status(500);
        res.send([{ error: "Data not found" }]);
      } else {
        const list = JSON.parse(data);
        const item = list.filter((item) => item.id === id);

        // ha az elem létezik az adatbázisban, akkor módosítjuk
        if (item.length) {
          // módosítjuk a meglévő elem adatait
          const newItem = { ...item[0], ...reqItem };

          // új listát hozunk létre, felülírva a módosítani kívánt elemet
          const newList = list.map((item) => {
            if (item.id === id) {
              return newItem;
            } else {
              return item;
            }
          });

          // felülírjuk az adatbázist
          fs.writeFile("./api/db.json", JSON.stringify(newList), () => {
            res.send([newItem]);
          });

          // ha nem létezik az adatbázisban, akkor hibát dobunk vissza
        } else {
          res.status(404);
          res.send([{ error: `${id} id not exist` }]);
        }
      }
    });
  }
};

module.exports = patchByID;
