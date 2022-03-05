if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const {clubSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');

const res = require('express/lib/response');
const { nextTick } = require('process');
const userRoutes = require('./routes/users');
const clubsRoutes = require('./routes/clubs');
const reviewsRoutes = require('./routes/reviews');
const MongoDBStore = require("connect-mongo")(session);

//const dbUrl = 
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/comedy-app';

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("database connected");
})

const app = express();


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(mongoSanitize());

const secret = process.env.SECRET || "thisshouldbeabettersecret";

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
})

store.on("error", function (e) {
    console.log("session store error", e)
})

const sessionConfig = {
    store,
    name: "ses",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
       httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    //console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/clubs', clubsRoutes);
app.use('/clubs/:id/reviews', reviewsRoutes);


app.get('/', (req, res) => {
    res.render('home')
});



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'oh no, something went wrong'
   res.status(statusCode).render('error', { err });
 
})
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`SERVING ON PORT ${port}`)
})