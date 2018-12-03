const userQueries = require("../db/queries.users");
const passport = require("passport");
const sgMail = require('@sendgrid/mail');
const wikiQueries = require("../db/queries.wikis.js");
const User = require("../db/models/").User;
const Wiki = require("../db/models/").Wiki;

module.exports = {
	signUp(req, res, next){
		res.render("users/signup");
	},
	create(req, res, next){
		let newUser = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword
		};

		userQueries.createUser(newUser, (err, user) => {
			if(err){
				req.flash("error", err);
				res.redirect("/users/signup");
			} else {
				passport.authenticate("local")(req, res, function() {
					req.flash("notice", "You have successfully signed in!");
					// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
					// const msg = {
     //        			to: user.email,
     //        			from: 'jed@blocipedia.com',
     //        			subject: 'Welcome to Blocipedia!',
     //        			text: `Welcome to Blocipedia ${user.name}!`,
     //        			html: `<strong>Welcome to Blocipedia ${user.name}!</strong>`,
          			// };
          			//sgMail.send(msg);
					res.redirect("/");
				})
			}
		});
	},
	signInForm(req, res, next){
		res.render("users/signin")
	},
	signIn(req, res, next){
  		passport.authenticate("local", function (err, user, info) {
    		if (err) {
      			next(err);
    		}
    		if (!user) {
      			req.flash("notice", "Error: The email or password you entered is incorrect.")
      			res.redirect("/users/signin");
    		}
    		req.logIn(user, function (err) {
      			if (err) {
        			next(err);
     			}
      			req.flash("notice", "You've successfully signed in!");
      			res.redirect("/");
    		});
  		})(req, res, next);
	},
	signOut(req, res, next){
		req.logout();
		req.flash("notice", "You have successfully signed out");
		res.redirect("/");
	},
	payments(req, res, next){
		res.render("users/payments");
	},
	showUser(req, res, next){
		userQueries.getUser(req.params.id, (err, user) => {
			if(err || user === null){
				req.flash("notice", "User not found");
				res.redirect("/");
			} else {
				res.render("users/show", {user});
			}
		});
	},
	upgrade(req, res, next){
		var stripe = require("stripe")("sk_test_I7KgdU5GEzymh0JzChOW3siS");

		const charge = stripe.charges.create({
  			amount: 1500,
  			currency: 'usd',
  			source: 'tok_visa',
  			receipt_email: 'jenny.rosen@example.com',
		});

		userQueries.updateUserRole(req.params.id, 1, (err, user) => {
			if(err || user === null){
				req.flash("notice", "User not found");
				res.redirect(404, `/users/${req.params.id}`);
			} else {
				req.flash("notice", "Account has been upgraded!");
				res.redirect(`/users/${req.params.id}`);
			}
		})
	},
	downgrade(req, res, next){
		User.findById(req.params.id)
		.then(user => {
				user.update({ role: 0});

				Wiki.update({    
   					private: false
				}, {
   					where: { 
      					userId: user.id 
   					}
				});

				req.flash("notice", "Account has been downgraded");
				res.redirect(`/users/${req.params.id}`);
		})
		.catch((err) => {
			console.log(err);
		})
	}



}