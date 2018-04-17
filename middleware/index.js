const Campground = require('../models/campground')
const Comment = require('../models/comment')

let middlewareObj = {}

//checks if is logged in before doing the next step
middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next()
	}
	req.flash('error', 'You are not logged in, please login first')
	res.redirect('/login')
}

//checks if the current user is the owner (author) of the current campground
middlewareObj.checkCampOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCamp) => {
			if (err) {
				req.flash('error', 'Campground not found or DB error')
				res.redirect('back')
			} else {
				//	//does user own campground?
				//mongoose stores authorid as an mongoose object, not string so to compare them
				// we use mongoose method equals()
				if (foundCamp.author.id.equals(req.user._id)) next()
				else {
					req.flash('error', 'You do not have permission to do that')
					res.redirect('back')
				}
			}
		})
	} else {
		req.flash('error', 'Secret page! You need to be logged in to do that ;)')
		res.redirect('back')
	} //takes the user to the 'previous' page
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) res.redirect('back')
			else {
				if (foundComment.author.id.equals(req.user._id)) next()
				else res.redirect('back')
			}
		})
	} else res.redirect('back')
}

module.exports = middlewareObj
