const express = require('express');
const app = express();
const session = require('express-session');
const routes = require('./routes/users.js');
const hashedSecret = require('./crypto/config.js')


const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use(
    session({
      secret: `${hashedSecret}`,
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
  );

routes.paths(app);

app.listen(3000, () => {
    console.log(`Express está escuchando en http://localhost:${PORT}`);
})