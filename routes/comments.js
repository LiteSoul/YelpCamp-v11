const express = require('express')
const router = express.Router()
//models require
const Campground = require('../models/campground')
const Comment = require('../models/comment')
const middleware = require('../middleware')

//Comments new
router.get(
	'/campgrounds/:id/comments/new',
	middleware.isLoggedIn,
	(req, res) => {
		//see SHOW campground route for method
		Campground.findById(req.params.id, (err, foundCamp) => {
			if (err) {
				console.log(err)
			} else {
				res.render('comments/new', { campground: foundCamp })
			}
		})
	}
)

//Comments create
router.post('/campgrounds/:id/comments', middleware.isLoggedIn, (req, res) => {
	//Create a new comment and save it to DB:
	Campground.findById(req.params.id, (err, foundCamp) => {
		if (err) {
			console.log(err)
			res.redirect('/campgrounds')
		} else {
			// get data from form and add to campground comments
			//but instead of these 3 sentences:
			//var author = req.body.comment.author
			//var text = req.body.comment.text
			//var newComment = {author, text}
			//we just use comment[array] sent from new.ejs
			Comment.create(req.body.comment, (err, new_comm) => {
				if (err) {
					req.flash('error', 'Something went wrong')
				} else {
					//add username and id to comment
					new_comm.author.id = req.user._id
					new_comm.author.username = req.user.username
					//save comment
					new_comm.save()
					//push it into the comments
					foundCamp.comments.push(new_comm)
					foundCamp.save()
					req.flash('success', 'Comment successfully added')
					// redirect back to campground, default is GET campground:
					res.redirect('/campgrounds/' + foundCamp._id)
				}
			})
		}
	})
})
//Edit comment route
router.get(
	'/campgrounds/:id/comments/:comment_id/edit',
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findById(req.params.comment_id, (err, foundComment) => {
			if (err) res.redirect('back')
			else
				res.render('comments/edit', {
					comment: foundComment,
					campground_id: req.params.id
				})
		})
	}
)
//Update comment route
router.put(
	'/campgrounds/:id/comments/:comment_id',
	middleware.checkCommentOwnership,
	(req, res) => {
		Comment.findByIdAndUpdate(
			req.params.comment_id,
			req.body.comment,
			(err, updatedComment) => {
				if (err) res.redirect('back')
				else res.redirect(`/campgrounds/${req.params.id}`)
			}
		)
	}
)
// Destroy comment route
router.delete(
	'/campgrounds/:id/comments/:comment_id',
	middleware.checkCommentOwnership,
	(req, res) => {
		// res.send('YOU ARE TRYING TO ERASE ME!!! :()')
		Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
			req.flash('success', 'Comment deleted')
			res.redirect(`/campgrounds/${req.params.id}`)
		})
	}
)

module.exports = router
