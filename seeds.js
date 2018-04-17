//This seed is no longer relevant since it doesn't have an 'author'
//Besides mlab mongodb since yelp-v10 populated mannually without any seeds
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require('./models/comment')

var data = [
	{
		name: 'Rosario del Tala',
		image: 'https://farm4.staticflickr.com/3062/2984119099_82336dfc3b.jpg',
		description:
			"This campground is great for campfires and tents, but don't be tempted...ha. Here's a bunch of numbers. They may look random but they're my phone number. I'm no hero. I just put my bra on."
	},
	{
		name: 'Victoria',
		image: 'https://farm7.staticflickr.com/6103/6333668591_90e7c2bc72.jpg',
		description:
			"This campground is great for campfires and tents, but don't be tempted...ha. Here's a bunch of numbers. They may look random but they're my phone number. I'm no hero. I just put my bra on."
	},
	{
		name: 'Colastiné',
		image: 'https://farm4.staticflickr.com/3393/3510641019_bc91eb6818.jpg',
		description:
			"This campground is great for campfires and tents, but don't be tempted...ha. Here's a bunch of numbers. They may look random but they're my phone number. I'm no hero. I just put my bra on."
	},
	{
		name: 'Extreme Camping',
		image:
			'https://upload.wikimedia.org/wikipedia/commons/e/e2/Boy_Scout_camp_in_the_snow.jpg',
		description:
			'Only the breavest and well prepared should come here, as this is a dangerous but rewarding place. We welcome you with all the basic tools for survival so as to camp safely as possible, with emergency services operating 24/7 from the town 2kms away.'
	}
]

function seedDB() {
	// Clear/remove db Campground content
	// ----> but so far comments are not removed! eg. Comment.remove({})but only works like this:
	Comment.remove({}, function() {
		// if no error, your comments are removed
		console.log('Comments removed')
	})
	Campground.remove({}, err => {
		if (err) {
			console.log(err)
		}
		console.log('Campgrounds removed')
		// Add a few campgrounds right after removing them, in this callback
		data.forEach(function(seed) {
			Campground.create(seed, function(err, campground) {
				if (err) {
					console.log(err)
				} else {
					console.log('Campground added')
					// add a comment
					Comment.create(
						{
							text:
								'I went there, it was great! Just very cold on winter! xoxo',
							author: 'Piñón Fijo'
						},
						function(err, comment) {
							if (err) {
								console.log(err)
							} else {
								campground.comments.push(comment)
								campground.save()
								console.log('New comment created')
							}
						}
					)
					// add another comment
					Comment.create(
						{
							text: "I'm here right now...waiting for ya! xoxo",
							author: 'Vicky the beautiful'
						},
						function(err, comment) {
							if (err) {
								console.log(err)
							} else {
								campground.comments.push(comment)
								campground.save()
								console.log('New comment created')
							}
						}
					)
				}
			})
		})
	})
}

module.exports = seedDB
