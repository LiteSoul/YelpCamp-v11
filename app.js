const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
mongoose.Promise = Promise
//models require
const Campground = require('./models/campground')
const Comment = require('./models/comment')
//user model for auth
const User = require('./models/user')
//add seeds.js and execute seed function to destroy and create new sample data on db
const seedDB = require('./seeds')
//seedDB() //Seed the DataBase
//for user authentication
const passport = require('passport')
const flash = require('connect-flash')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const methodOverride = require('method-override')
//Routes:
const campgroundRoutes = require('./routes/campgrounds')
const commentsRoutes = require('./routes/comments')
const indexRoutes = require('./routes/index')

//-------------------CONNECT TO DB--------------
// Using `mongoose.connect`...
mongoose.connect('mongodb://admin:admin@ds255797.mlab.com:55797/yelp-v10', {
	useMongoClient: true
	/* other options */
})

//---------------APP CONFIG-----------------
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
// official is this, but path not defined:
//app.use(express.static(path.join(__dirname, "public")))
app.use(express.static(__dirname + '/public'))
app.use(methodOverride('_method'))

//---------------PASSPORT CONFIG-----------------
app.use(
	session({
		secret: 'pasaporte falso',
		resave: false,
		saveUninitialized: false
	})
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
//use localstrategy and give it a method (User.authenticate)from local-mongoose plugin
passport.use(new LocalStrategy(User.authenticate()))
// use static serialize and deserialize of model for passport session support
//serializeUser and deserializeUser methods taken from local-mongoose, it's easier
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//creates middleware to pass user data (check if logged in) for EVERY route
app.use((req, res, next) => {
	res.locals.currentUser = req.user
	next()
})

//Use routes
app.use(indexRoutes)
app.use(campgroundRoutes)
app.use(commentsRoutes)

//-------------404 PAGE-----------------
app.get('*', (req, res) => {
	res.send('404 NOTHING TO SEE HERE...')
})
//-------------APP LISTEN 3000---------------
// process.env.PORT lets the port be set by Heroku, on localhost or codeanywhere is 3000
let port = process.env.PORT || 3000
//check connection through express
app.listen(port, function() {
	console.log(`Our app is running on http://localhost:${port}`)
})
