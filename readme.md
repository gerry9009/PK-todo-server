# TODO API

Ez egy egyszerű Rest API, `Programozás Karrier` tanulóinak gyakorlás céljából.

A gépdre mindenképpen szükséges feltelepíteni a következőket:

- [Git](https://github.com/git-guides/install-git)
- [NodeJS](https://nodejs.org/en)
- Illetve szükséges [Github](https://www.freecodecamp.org/news/introduction-to-git-and-github/) profil is

## Hogyan telepítsd a gépedre?

```shell
git clone https://github.com/gerry9009/PK-todo-server.git
cd PK-todo-server
npm install
```

## Hogyan futtasd a programot?

A CLI-ben a szerver mappáját megnyitva futtasd a következő parancssort:

```shell
npm run dev
```

Ekkor a szerver a `http://localhost:8008/` port-on fog futni.

Az API-t a `http://localhost:8008/api/` url-en érhető el.

## HTTP metódusok

A következő HTTP metódusokat támogatja az alkalmazás:

- `get` - Adatok lekérdezése
- `post` - Új elem hozzáadása
- `patch` - Meglévő elem módosítása
- `delete` - Elem törlése

## Adatmodell

A szerver felé beküldött adatoknak `JSON` formátumban kell lenniük és az alábbi kulcsokat támogatják:

`id`: Az elem egyedi azonosítója (`number`) - / ezt nem lehet módosítani /
`task`: Feladat leírása (`string`) - / kötelező megadni `POST` metódusnál /
`done`: Feladat státusza (`true` vagy `false`, alapértelmezett: `false`) - / nem szükséges megadni `POST` metódusnál /
`deadline`: Feladat határideje (`string`, pl.: "2023-12-31") - / nem szükséges megadni `POST` metódusnál /

## Endpointok

### Összes elem lekérdezése

_URL_ : `/api/`
_METÓDUS_ : `GET`

`PÉLDA`:

```JS
 fetch(`http://localhost:8008/api/`)
      .then((resp) => resp.json())
      .then((taskList) => console.log(taskList));
```

`VÁLASZ` :

```JS
[
    {
        "id": 1,
        "task": "Learn JS",
        "done": true,
        "deadline": "2023-12-02",
        "added": "2023-11-02 11:56:23"
    },
    {
        "id": 2,
        "task": "Learn React",
        "done": false,
        "deadline": "2023-12-02",
        "added": "2023-11-04 7:33:05"
    },
    {
        "id": 3,
        "task": "Learn CSS",
        "done": true,
        "deadline": "2023-12-02",
        "added": "2023-11-01 11:11:07"
    }
]
```

### Egy elem lekérdezése ID alapján

_URL_ : `/api/:id`
_METÓDUS_ : `GET`

`PÉLDA`:

```JS
const lekérdezniKívántElemID = 2
 fetch(`http://localhost:8008/api/${lekérdezniKívántElemID}`)
      .then((resp) => resp.json())
      .then((taskList) => console.log(taskList));
```

`VÁLASZ` :

```JS
[
    {
        "id": 2,
        "task": "Learn React",
        "done": false,
        "deadline": "2023-12-02",
        "added": "2023-11-04 7:33:05"
    }
]
```

### Új elem hozzáadása

_URL_ : `/api/`
_METÓDUS_ : `POST`

`PÉLDA`:

```JS

const újFeladat = {task: 'Learn NodeJS', deadline: '2024-02-01'}

const header = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(újFeladat)
 }

 fetch(`http://localhost:8008/api/`, header)
      .then((resp) => resp.json())
      .then((taskList) => console.log(taskList));
```

`VÁLASZ` :

```JS
[
    {
        "id": 4,
        "task": "Learn NodeJS",
        "done": false,
        "deadline": "2024-02-01",
        "added": "2023-11-05 13:33:05"
    }
]
```

### Meglévő elem módosítása ID alapján

_URL_ : `/api/:id`
_METÓDUS_ : `PATCH`

`PÉLDA`:

```JS

const módosítottFeladatID = 4
const módosítottAdat = {done: true}

const header = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(módosítottAdat)
 }

 fetch(`http://localhost:8008/api/${módosítottFeladatID}`, header)
      .then((resp) => resp.json())
      .then((taskList) => console.log(taskList));
```

`VÁLASZ` :

```JS
[
    {
        "id": 4,
        "task": "Learn NodeJS",
        "done": true,
        "deadline": "2024-02-01",
        "added": "2023-11-05 13:33:05"
    }
]
```

### Elem törlése ID alapján

_URL_ : `/api/:id`
_METÓDUS_ : `DELETE`

`PÉLDA`:

```JS
const törölniKívántElemID = 4

const header = {
    method: 'DELETE',
    body: JSON.stringify(módosítottAdat)
 }

 fetch(`http://localhost:8008/api/${törölniKívántElemID}`, header)
      .then((resp) => resp.json())
      .then((taskList) => console.log(taskList));
```

`VÁLASZ` :

```JS
[
    {
        "id": 4,
        "task": "Learn NodeJS",
        "done": true,
        "deadline": "2024-02-01",
        "added": "2023-11-05 13:33:05"
    }
]
```

### Nem létező endpoint

_URL_ : `*`
_METÓDUS_ : `GET`

`PÉLDA`:

```JS
 fetch(`http://localhost:8008/`)
      .then((resp) => resp.json())
      .then((data) => console.log(data));
```

`VÁLASZ` :

```JS
[
    {
        "error": "URL not found"
    }
]
```
