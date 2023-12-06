# Express

## Inizializziamo una repo vuota

- creiamo una nuova cartella
- lanciamo `npm init`
- rispondiamo alle domande che vengono poste dal wizard
- `npm install express`
- ci assicuriamo che il nostro `.gitignore` includa `node_modules`
- creiamo una directory `src` dentro la quale inseriamo il nostro `index.js` (questa è una convenzione, dettata dal fatto che se in un secondo momento aggiungessimo una fase di build, è comodo avere tutti i nostri file dentro una sola cartella)
- infine, creiamo uno script che ci permette di lanciare il nostro server, generalmente lo script si chiama `dev` o `start`

  - installiamo come dipendenza di sviluppo `nodemon` che ci consente di rilanciare lo script del server ad ogni salvataggio
  - dentro il nostro `package.json`:
    - `"dev": "nodemon src/index.js"`

- prima di lanciare il server ricorda di aggiungere al package.json `"type" : "module"`
- lanciamo il nostro server:

```js
server.listen(port, () => {
  console.log("Server listening at port: ", port);
});
```

## COSE UTILI PER IL ROUTING:

Questo comando analizza automaticamente i corpi delle richieste in arrivo nel formato JSON:

```js const apiRouter = express.Router();
apiRouter.use(express.json());
```

Questo è un esempio di richiesta GET all'URL .../api/ che manda al client del codice html:

```js
apiRouter.get("/", (req, res) => {
  res.status(200).send(/*html*/ `
    <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <title>Bootstrap demo</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
    </head>
    <body>
      <h2 style="color: red">Il get all'indirizzo .../api/ sta funzionando corretamente</h2>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    </body>
  </html>
    `);
});

export default apiRouter;
```

Un altro esempio di risposta ad una richiesta GET:

- Quando viene effettuata una richiesta GET all'URL '/api/test', il server risponderà con un oggetto JSON contenente il messaggio specificato:

```JS
apiRouter.get("/test", (req, res) => {
  res.json({ message: "Hello, world!" });
});
```

Un esempio di richiesta POST:

- In questo caso, la funzione di gestione stampa sul server `console.log` il corpo della richiesta `req.body`, che contiene i dati inviati nel corpo della richiesta POST. Dopo aver stampato il corpo della richiesta, il server risponderà con uno stato HTTP 200 (OK) utilizzando res.status(200).send(). Questo indica che la richiesta è stata gestita correttamente.

```js
apiRouter.post("/body", (req, res) => {
  console.log(req.body);

  res.status(200).send();
});
```

La stringa `server.use("/api", apiRouter);` è una dichiarazione in Express.js che indica l'utilizzo di un router specifico (apiRouter) per gestire tutte le richieste dirette alle rotte che iniziano con '/api'. In altre parole, quando una richiesta arriva all'URL che inizia con '/api', Express instradereà la gestione di quella richiesta al router apiRouter.

Inoltre è importante ricordarsi di importare i vari router:

```js
import apiRouter from "./apiRouter.js";
```

## TENERE TRACCIA DELLE ROTTE

Per tenere traccia delle varie rotte è possibile installare `npm install express-list-endpoints`. Una volta importato come `import list from "express-list-endpoints"` è possibile fare ciò che segue:

```js
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(port, () => {
      console.log("🍇 Server listening to port:", port);
      console.log(list(server)); //questo è il passaggio fondamentale
    });
  })
  .catch(() => {
    console.log("Errore nella connessione al DB", process.env.MONGO_URL);
  });
```

Così facendo a terminale si avrà la lista di tutte le rotte definite in Express, e verranno mostrate informazioni come i percorsi delle rotte e i metodi HTTP associati. Dal terminale:

```bash
 Server listening to port: 3030
[
  {
    path: '/api/users/test',
    methods: [ 'GET' ],
    middlewares: [ 'anonymous' ]
  }
]
```

## MIDDLEWARES

In Express, un middleware è una funzione che ha accesso agli oggetti di richiesta (request), risposta (response), e successivo middleware nella catena delle richieste. Esso può eseguire operazioni su tali oggetti, modificare la richiesta e la risposta, o terminare la catena delle richieste. I middleware sono utilizzati per aggiungere funzionalità, gestire richieste e risposte, nonché per eseguire azioni specifiche durante il ciclo di vita di una richiesta HTTP.

### Esempio middleware di autenticazione:

```js
//FILE checkAuth.js (dove definisco il middleware)
import dotenv from "dotenv";
dotenv.config();

export const checkAuth = (req, res, next) => {
  //per passare questo mdw devo avere tra gli header l'authorization
  if (req.headers.authorization === process.env.PSSW) {
    next(); //serve per passare al middleware successivo
  } else {
    res.status(401).json({ error: "password sbagliata" });
  }
};

//FILE userRouter.js (dove applico il middleware)
import express from "express";
import { User } from "../models/users.js";
import mongoose from "mongoose";
import { checkAuth } from "../middlewares/checkAuth.js";

const userRouter = express.Router();

userRouter.use(express.json());
userRouter.use(checkAuth);
//tutte le richieste sotto questa riga dovranno avere nell'header l'Authorization
```

Il codice qui sopra definisce un MIDDLEWARE DI AUTENTICAZIONE chiamato checkAuth che verifica se l'header "Authorization" nella richiesta contiene una password corrispondente a quella definita nel file di configurazione .env. Se tutto è apposto la funzione next() fa si che si passi al prossimo middleware, in caso contrario viene restituito 401 Unauthorized.

Interessante è il fatto che posso applicare il middleware (o più!) direttamente ad una richiesta specifica oltre che ad un'intera ruote:

```js
userRouter.get("/", checkAuth, checkAuth2, checkAuth3 async (req, res, next) => {
  //CODICE
});
```

### Esempio middleware di errore:

```js
//FILE genericError.js
export const genericError = (err, req, res, next) => {
  console.log(err);

  res.status(err.statusCode || 500).send(err.message);
};

//FILE index.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import list from "express-list-endpoints";
import apiRouter from "./Routes/apiRouter.js";
import { genericError } from "./middlewares/genericError.js";

dotenv.config();

const server = express();
const port = 3030;

server.use("/api", apiRouter);
server.use(genericError);
```

Il middleware di errore genericError.js è una funzione che gestisce gli errori durante l'esecuzione dell'applicazione Express. Riceve quattro parametri: err (l'errore), req (la richiesta), res (la risposta), e next (funzione per passare al middleware successivo).

La funzione logga l'errore sulla console, imposta lo stato della risposta in base al codice di stato dell'errore o a 500, e invia il messaggio di errore come risposta.

Nel file principale index.js, il middleware di errore è applicato con server.use(genericError);. Questo assicura che gestisca gli errori in tutta l'applicazione, intervenendo se nessun altro middleware o route li gestisce precedentemente.

Quando si verifica un errore in un middleware o in una route di Express, può essere passato al successivo utilizzando `next(errore)`. `Express cerca automaticamente il primo middleware con quattro parametri` (errore, richiesta, risposta, prossimo) e lo esegue, fungendo da gestore globale di errori. È importante posizionare questo middleware alla fine della catena dei middleware per garantire una gestione uniforme degli errori in tutta l'applicazione.

È una pratica comune avere una catena di middleware prima del middleware di errore per eseguire operazioni specifiche della richiesta, e il middleware di errore viene utilizzato per gestire errori imprevisti durante queste operazioni

### Try and catch e next(error)

#### Qual è la differenza tra queste due porzioni di codice?

```js
// Esempio userRouter.post
userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

// Esempio userRouter.put
userRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});
```

- Prima di rispondere supponiamo che il gestore di errori sia il seguente:

```js
//GESTORE DI ERRORI
export const genericError = (err, req, res, next) => {
  console.log(err);

  res.status(err.statusCode || 500).send(err.message);
};
```

- La prima porzione di codice, in caso di errore, imposta `error.statusCode = 400`. Successivamente grazie alla chiamata di next(err), l'errore viene passato al primo middleware di gestione di errore che trova (ovvero il primo ad avare quattro parametri). Dato che `error.statusCode` è stato settato, il gestore di errori restituirà lo stato 400. Ricordo che la riga `err.statusCode || 500` restituisce il valore di `err.statusCode` se tale valore è truthy (diverso da zero, null, undefined, false, o una stringa vuota), altrimenti restituisce 500.

- La seconda porzione di codice non attribuisce un valore ad `error.statusCode`, il quale di fatto rimarrà undefinded. Come nel caso precedende l'errore viene comunque inoltrato al primo middleware di gestione di errori. Tuttavia dato che lo statusCode non è definito, verrà restituito il codice di errore generico 500.

### Middleware di errore più complesso con spunti interessanti

```js
// File: errorMiddleware.js
export const errorMiddleware = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Errore interno del server😒";

  if (err.name === "ValidationError") {
    // Gestione degli errori di validazione del modello Mongoose
    statusCode = 400;
    message = "Errore di validazione";
  }

  if (err.name === "UnauthorizedError") {
    // Gestione degli errori di autenticazione JWT
    statusCode = 401;
    message = "Non autorizzato";
  }

  if (err.name === "CustomError") {
    // Gestione di un errore personalizzato con un codice di stato specifico
    statusCode = err.statusCode || 500;
    message = err.message || "Errore personalizzato";
  }

  // Log dell'errore (puoi implementare il tuo sistema di logging)
  console.error(err);

  // Risposta al client con il codice di stato e il messaggio appropriati
  res.status(statusCode).json({ error: message });
};
```

- In questo esempio il middleware accetta un errore (err) insieme a req, res, e next.
- Imposta un codice di stato e un messaggio predefiniti, ma li modifica se l'errore specifico ha informazioni più dettagliate.
- Gestisce errori specifici come quelli di validazione Mongoose, errori di autenticazione JWT e un errore personalizzato chiamato 'CustomError'.
- Logga l'errore per eventuali azioni di troubleshooting o logging personalizzate.
- Invia una risposta JSON al client con il codice di stato e il messaggio appropriati.

# MongoDB Atlas

- creazione di un'utenza
- creazione di un cluster
- creazione di un DB
- creazione di una o piu collezioni
- creazione di multipli documenti

# Mongoose

Come leggere MongoDB tramite Mongoose dentro la nostra applicazione scritta con Express?

- `npm install mongoose`
- ci colleghiamo tramite mongoose al nostro DB con il nostro URI

  - ```js
    mongoose.connect(URI); // promise(!), quindi gestibile con .then/.catch
    ```

- definiamo lo schema dei nostri documenti

  - ```js
    const UserSchema = new Schema({
      /* qui la definizione della struttura dati */
    });
    ```

- esportiamo un modello che ci consente di interagire con il DB

  - ```js
    const User = mongoose.model(NOME_COLLEZIONE, SCHEMA); // esportando questo oggetto riusciamo a collegarci e interagire con il DB
    ```

- dentro la route, usiamo il modello con gli appositi metodi per recuperare i dati da DB
  - ```js
    const users = await User.find({}); // restituisce tutti i documenti
    // ...
    const user = await User.findById(ID_RICERCATO); // restituisce il doc con tale id o null
    // ...
    const newUser = new User(data); // crea un nuovo documento
    await newUser.save(); // salva il documento in modo persistente su DB
    ```

## ALCUNI ESEMPI:

- Nell'esempio sottostante ad una chiamata GET all'URL `...api/users/` il server (MongoDB) riponderà con un array (poichè uso la funzione map su un array di oggetti) contenente il nome di tutti gli utenti.

```js
import express from "express";
import { User } from "../models/users.js";

const userRouter = express.Router();
userRouter.use(express.json());

userRouter.get("/", async (req, res, next) => {
  try {
    const users = await User.find({}, "name"); //cerco in particolare il nome degli utenti
    const name = users.map((user) => user.name);
    res.json(name);
  } catch (error) {
    next(error);
  }
});
/*NB: async viene utilizzato perchè User.find() è una funzione asincrona
next serve a far si che l'applicazione non si blocchi  in caso di errore
*/
export default userRouter;
```

- In quest'altro esempio la route è configurata per rispondere a richieste GET su un percorso che include un parametro dinamico :id. Ad esempio, se l'URL è "/api/users/123", il valore di id sarà "123".

```js
userRouter.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params; //rappresenta l'ultima parte

    if (!mongoose.Types.ObjectId.isValid(id)) {
      //questo serve ad evitare l'errore 500 per un id non consono
      return res.status(400).json({ error: "Invalid ObjectId" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).send(); //se l'id è consono ma non esiste nel database: 404
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});
```

- In questo esempio vado a creare un nuovo utente tramite una richiesta POST:

```js
userRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new User(req.body);

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    error.statusCode = 400;
    next(error);
  }
});

export default userRouter;
```

- In questo esempio modifico gli attributi di un utente:

```js
userRouter.put("/:id", async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
});
```

- In questo esempio elimino un utente:

```js
userRouter.delete("/:id", async (req, res, next) => {
  try {
    const deletedDocument = await User.findByIdAndDelete(req.params.id);

    if (!deletedDocument) {
      res.status(404).send();
    } else {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});
```

- questo codice definisce uno <b>schema Mongoose</b> per un modello chiamato Author, che rappresenta gli autori in un'applicazione. Gli autori sono rappresentati come documenti in una collezione chiamata "authors", e ogni autore ha campi come name, lastname, age, email, birthday, e avatar. Il modello Mongoose Author fornisce un'interfaccia per effettuare operazioni CRUD (Create, Read, Update, Delete) sulla collezione di autori nel database MongoDB:

```js
import mongoose, { Schema } from "mongoose";

const AuthorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  birthday: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    required: true,
  },
});

export const Author = mongoose.model("authors", AuthorSchema);
// La stringa "authors" è il nome della collezione nel DB!!
```

- se voglio utilizare variabili d'ambiente è utile scaricare il pacchetto `dotenv` che andrà importato all'inizio del mio file principale nel seguente modo:

```js
import dotenv from "dotenv";
dotenv.config();
```

- una volta importato posso richiamare le variabili di ambiente dal file `.env` usando la scrittura `process.env.VAR_NAME`, dove `VAR_NAME` rappresenta il nome della variabile.

# ALTRO

## Risposte del server

- `200 OK` ➡️ la richiesta è stata eseguita con successo.
- `201 Created` ➡️ la richiesta è stata eseguita con successo, e una nuova risorsa è stato creato come risultato.
- `204 No Content` ➡️ la richiesta è stata eseguita con successo, ma non c'è contenuto da restituire.
- `400 Bad Request` ➡️ la richiesta è errata o malformata. Il server non può comprendere o processare la richiesta.
- `401 Unauthorized` ➡️ il client deve autenticarsi per ottenere la risorsa richiesta. L'autenticazione non è riuscita o mancante.
- `403 Forbidden` ➡️ il server ha capito la richiesta, ma rifiuta di eseguirla. Il client non ha i diritti d'accesso necessari.
- `404 Not Found` ➡️ la risorsa richiesta non è stata trovata sul server.
- `500 Internal Server Error` ➡️ si è verificato un errore interno del server, e la richiesta non può essere completata.
- `502 Bad Gateway` ➡️ il server, mentre funzionante come gateway o proxy, ha ricevuto una risposta non valida dal server upstream.
- `503 Service Unavailable` ➡️ il server non è disponibile al momento. Solitamente temporaneo, il server può essere sovraccarico o in manutenzione.
- `504 Gateway Timeout` ➡️ il server, mentre funzionante come gateway o proxy, non ha ricevuto una risposta tempestiva dal server upstream.
