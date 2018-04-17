const Campground = require('../models/campground')
const Comment = require('../models/comment')

let middlewareObj = {}

//checks if is logged in before doing the next step
middlewareObj.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next()
	}
	res.redirect('/login')
}

//checks if the current user is the owner (author) of the current campground
middlewareObj.checkCampOwnership = (req, res, next) => {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, (err, foundCamp) => {
			if (err) res.redirect('back')
			else {
				//	//does user own campground?
				//mongoose stores authorid as an mongoose object, not string so to compare them
				// we use mongoose method equals()
				if (foundCamp.author.id.equals(req.user._id)) next()
				else res.redirect('back')
			}
		})
	} else res.redirect('back') //takes the user to the 'previous' page
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
