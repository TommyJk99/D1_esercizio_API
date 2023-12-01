# Express

Inizializziamo una repo vuota

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

COSE UTILI PER IL ROUTING:

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
- se voglio utilizare variabili d'ambiente è utile scaricare il pacchetto `dotenv` che andrà importato all'inizio del mio file principale nel seguente modo:

```js
import dotenv from "dotenv";
dotenv.config();
```

- una volta importato posso richiamare le variabili di ambiente dal file `.env` usando la scrittura `process.env.VAR_NAME`
