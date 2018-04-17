const express = require('express')
const router = express.Router()
//models require
const Campground = require('../models/campground')
//user model for auth
const User = require('../models/user')
//for user authentication
const passport = require('passport')

//---------------APP ROUTING----------------
router.get('/', function(req, res) {
	res.render('landing')
})
//FIRST USE OF A FAT ARROW YAY!!
//INDEX route - show all campgrounds
router.get('/campgrounds', (req, res) => {
	//console.log(req.user) to check for user loggedin data or undefined
	//get all (all is {}) campgrounds from db:
	Campground.find({}, (err, all_campings) => {
		if (err) {
			console.log(err)
		} else {
			//render it:
			res.render('campgrounds/index', {
				campgrounds: all_campings
			})
		}
	})
})

//-------------AUTH ROUTES-----------------
router.get('/signup', (req, res) => {
	res.render('auth/signup')
})

router.post('/signup', (req, res) => {
	let newUser = new User({ username: req.body.username })
	User.register(newUser, req.body.password, (err, user) => {
		if (err) {
			console.log(err)
			return res.render('auth/signup')
		}
		passport.authenticate('local')(req, res, () => {
			res.redirect('/campgrounds')
		})
	})
})

router.get('/login', (req, res) => {
	res.render('auth/login', { message: req.flash('error') })
})

//app.post(login route, middleware, callback)
router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}),
	(req, res) => {}
)

router.get('/logout', (req, res) => {
	req.logout() //this method comes with the pkg we installed
	res.redirect('/campgrounds')
})

module.exports = router
