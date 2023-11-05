const express = require("express");
const app = express();

// szükséges cors, hogy külső oldalról is lehessen kéréseket küldeni
// az oldalra
const cors = require("cors");

// fileSystem könyvtár
const fs = require("fs");

const bodyParser = require("body-parser");

const getRandomId = require("./modules");

const port = 3000;

// middlewears
app.use(bodyParser.json());
app.use(cors());

// az összes elem visszaadása
app.get("/api/", (req, res) => {
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
});

// egy elem visszaadása ID alapján
app.get("/api/:id", (req, res) => {
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
});

// új elem hozzáadása a listához
app.post("/api/", (req, res) => {
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
      if (typeof reqItem.done !== "string") error = true;
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

        // hozzáadjuk az új elemet az adatbázishoz
        list.push(newItem);

        // felülírjuk az adatbázist
        fs.writeFile("./api/db.json", JSON.stringify(list), () => {
          res.send([newItem]);
        });
      }
    });
  }
});

// meglévő elem felülírása
app.patch("/api/:id", (req, res) => {
  const id = Number(req.params.id);
  const reqItem = req.body;

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
});

// elem törlése
app.delete("/api/:id", (req, res) => {
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
});

app.get("*", (req, res) => {
  res.send([{ error: "URL not found" }]);
});

// elindítjuk a szerver működését
app.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on ${port}`);
});
