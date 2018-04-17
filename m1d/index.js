const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const moment = require('moment');
const session = require('express-session');

const app = express();

// Configuração do nunjucks
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

// Definição da extensão dos templates e caminho das views
app.set('view engine', 'njk');
app.set('views', path.join(__dirname, 'views'));

// Configurações globais
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
  secret: 'desafio01',
  cookie: { maxAge: 15000 },
  resave: false,
  saveUninitialized: false,
}));

// GETs
app.get('/', (req, res) => {
  req.session.destroy();
  res.render('main');
});

app.get('/major', (req, res) => {
  res.render(req.session.name && req.session.age >= 18 ? 'major' : 'main', {
    name: req.session.name,
  });
});

app.get('/minor', (req, res) => {
  res.render(req.session.name && req.session.age < 18 ? 'minor' : 'main', {
    name: req.session.name,
  });
});

// POSTs
app.post('/check', (req, res) => {
  const { name, birthDate } = req.body;
  const age = moment().diff(birthDate, 'years');

  // Armazena dados na sessão
  req.session.name = name;
  req.session.age = age;

  // Redireciona para rotas conforme a idade
  res.redirect(age >= 18 ? '/major' : '/minor');
});

app.listen(3000);
