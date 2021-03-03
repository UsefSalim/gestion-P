require('dotenv').config({ path: './config/.env' });
 
 // packages
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;
const ejsLayout = require('express-ejs-layouts');
const flash = require('connect-flash');
const session = require('express-session');
const path = require('path');
const staticRoute = require('./routes/static.routes')  
 //  Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
process.env.NODE_ENV === 'developpement' && app.use(morgan('tiny'));

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(ejsLayout);
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  next();
});
 // Db Connexion
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Mongo Db Connected'))
  .catch((err) => console.log(`error connection to the DataBase : ${err}`));
 
 // Routes

app.use(staticRoute);
 // app express
app.listen(PORT, () => {
  console.log(`app listning : localhost:${PORT}`);
});
