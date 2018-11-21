const userQueries = require("../db/queries.users");
const passport = require("passport");
//const sgMail = require('@sendgrid/mail');

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
				passport.authenticate("local")(req, res, () => {
					req.flash("notice", "You have successfully signed in!");
					// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
					// const msg = {
     //        			to: user.email,
     //        			from: 'jed@blocipedia.com',
     //        			subject: 'Welcome to Blocipedia!',
     //        			text: `Welcome to Blocipedia ${user.name}!`,
     //        			html: `<strong>Welcome to Blocipedia ${user.name}!</strong>`,
     //      			};
     //      			sgMail.send(msg);
					res.redirect("/");
				})
			}
		});
	}
}