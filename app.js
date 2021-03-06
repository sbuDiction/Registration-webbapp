/* eslint-disable no-console */
/* eslint-disable camelcase */
const express = require('express');

const app = express();
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash');

const PORT = process.env.PORT || 5000;
const exphbs = require('express-handlebars');
const pg = require('pg');

const { Pool } = pg;

let useSSL = false;
const local = process.env.LOCAL || false;
if (process.env.DATABASE_URL && !local) {
  useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://diction:19970823@localhost:5432/reg_numbers';

const pool = new Pool({
  connectionString,
  ssl: useSSL,
});
// view engine setup
const bodyParser = require('body-parser');
const indexRouter = require('./routes/reg-number-routes');
const reg_manager = require('./reg-numbers-manager/reg-function');

const Instance_for_reg = reg_manager(pool);
const routes = indexRouter(Instance_for_reg);

app.use(cookieParser('secret'));
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
  }),
);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const handlebarSetup = exphbs({
  partialsDir: './views/partials',
  viewPath: './views',
  layoutsDir: './views/layouts',
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

app.use(flash());

app.get('/', routes.index_route);
app.post('/add', routes.add_route);
app.post('/add_town', routes.town);
app.post('/filter', routes.filter);
app.get('/delete', routes.delete);
app.get('/delete_towns', routes.delete_towns);


app.listen(PORT, () => {
  console.log('App started at port:', PORT);
});
