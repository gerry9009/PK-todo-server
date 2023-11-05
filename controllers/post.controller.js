// fileSystem könyvtár
const fs = require("fs");
// random id segédfüggvény betöltése
const getRandomId = require("../modules/randomId.module");
const timeTemplate = require("../modules/timeTemplate.module");

const postByID = (req, res) => {
  const reqItem = req.body;

  // Validáljuk az adatokat
  let error = false;
  // Leellenőrizzük, hogy megfelelő kulcs érték került-e beküldésre
  if ("task" in reqItem || "done" in reqItem || "deadline" in reqItem) {
    // Validáljuk az egyes kulcsok értékeit

    // Ha nem létezik a task kulcsszó alatti érték, vagy nem megfelelő formátumú -> error
    if (
      !("task" in reqItem) ||
      typeof reqItem.task !== "string" ||
      reqItem.task.length < 1
    ) {
      error = true;
    }

    // Ha létezik a done kulcsszó alatti érték, ellenőrizzük a formátumát -> error
    if ("done" in reqItem) {
      if (typeof reqItem.done !== "boolean") error = true;
    }

    // Ha létezik a deadline kulcsszó alatti érték, ellenőrizzük a formátumát -> error
    if ("deadline" in reqItem) {
      if (typeof reqItem.deadline !== "string") error = true;
    }

    // ha nem megfelelő a kulcs -> error
  } else {
    error = true;
  }

  if (error) {
    // ha bármi hiba van a beküldött adattal -> error
    res.status(400);
    res.send([{ error: "Inappropriate item" }]);
  } else {
    // beolvassuk az adatbázist
    fs.readFile("./api/db.json", (err, data) => {
      if (err) {
        // ha szerver hiba van -> error
        res.status(500);
        res.send([{ error: "Data not found" }]);
      } else {
        // átalakitjuk a json-t js elemmé
        const list = JSON.parse(data);
        // létrehozzuk az új elemet a megadott adatok alapján, id-t rendelünk hozzá
        const newItem = { id: getRandomId(list), ...reqItem };

        // ha a done key nem lett megadva, false-ra állítjuk
        if (!("done" in newItem)) {
          newItem["done"] = false;
        }
        // Ha nincs megadva deadline, none-ra állítjuk
        if (!("deadline" in newItem)) {
          newItem.deadline = "none";
        }

        // Dátum hozzáadása
        newItem.added = timeTemplate();

        // hozzáadjuk az új elemet az adatbázishoz
        list.push(newItem);

        // felülírjuk az adatbázist
        fs.writeFile("./api/db.json", JSON.stringify(list), () => {
          res.send([newItem]);
        });
      }
    });
  }
};

module.exports = postByID;
