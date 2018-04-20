const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const bodyParser = require('body-parser');
const moment = require('moment');

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

// GETs
app.get('/', (req, res) => {
  res.render('main');
});

app.get('/major', (req, res) => {
  res.render(req.query.name && req.query.age >= 18 ? 'major' : 'main', {
    name: req.query.name,
  });
});

app.get('/minor', (req, res) => {
  res.render(req.query.name && req.query.age < 18 ? 'minor' : 'main', {
    name: req.query.name,
  });
});

// POSTs
app.post('/check', (req, res) => {
  const { name, birthDate } = req.body;
  const age = moment().diff(birthDate, 'years');

  // Redireciona para rotas conforme a idade
  res.redirect(age >= 18 ? `/major?name=${name}&age=${age}` : `/minor?name=${name}&age=${age}`);
});

app.listen(3000);
