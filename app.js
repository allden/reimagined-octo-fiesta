require('dotenv').config();
const express = require('express');
const app = express();
const routes = require('./routes');
const PORT = process.env.PORT || 5000;

// mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI, ({useNewUrlParser: true, useUnifiedTopology: true}));
let db = mongoose.connection;
db.on('error', err => console.error(err));

// passport
const passport = require('passport');
const jwtStrategy = require('./strategies/jwtStrategy');

passport.use(jwtStrategy);

// forms and json
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`);
});