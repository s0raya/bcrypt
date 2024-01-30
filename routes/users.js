const middlewares = require('../middlewares/authMiddleware.js');
const users = require('../data/users.js')

const paths = (app) => {
  app.get('/', middlewares.isAuthenticated, (req,res) => {
    res.send(`
      <a href="/dashboard">Dashboard</a>
      <form action="/logout" method="post">
        <button type="submit">Cerrar sesion</button>
      </form>
    `)
  })
  
  app.get('/', (req,res) => {
      const loginForm = `
      <form action="/login" method="post">
        <label for="username">Usuario :</label>
        <input type="text" id="username" name="username" required>
        
        <label for="password">Contraseña :</label>
        <input type="password" id="password" name="password" required>
        
        <button type="submit">Iniciar sesión</button>
      </form>
      `;
      res.send(loginForm);
    }
  );
    
    app.post('/login', (req,res) => {
      const { username, password} = req.body;
      const user = users.find((user) => user.username === username && user.password === password)
      if (user) {
        const token = middlewares.generateToken(user);
        req.session.token = token;
        res.redirect('/dashboard');
      } else {
        res.status(401).json({message: 'Credenciales incorrectas'});
      }
    });

    app.get('/dashboard', middlewares.verifyToken, (req,res) => {
      const userId = req.user;
      const user = users.find(user => user.id === userId);
      
      if (user) {
        res.send(`
        <h1>Bienvenido, ${user.name}</h1>
        <p>ID: ${user.id}</p>
        <p>Username: ${user.username}</p>
        <a href="/">Home</a>
        `)
      } else {
        res.status(401).json({message: 'Usuario no encontrado'});
      }
      
    })
    
    app.post('/logout', (req,res) => {
      req.session.destroy();
      res.redirect('/');
    })    
}

  module.exports = {
    paths,
}


/*********************************CLASE ****************************
const express = require('express');
const router = express.Router();


router.get('/', (req, res) => {
  if(req.session.token) {
    res.send(`
      <a href="/dashboard">Dashboard</a>
      <form action="/logout" method="post">
        <button type="submit">Cerrar sesion</button>
      </form>
    `)
  } else {
    res.send(`      
      <form action="/login" method="post">
        <label for="username">Usuario :</label>
        <input type="text" id="username" name="username" required>
        
        <label for="password">Contraseña :</label>
        <input type="password" id="password" name="password" required>
        
        <button type="submit">Iniciar sesión</button>
      </form>
    `);
  }
})

*/












