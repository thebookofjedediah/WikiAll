module.exports = {
	validateNewUsers(req, res, next){
    	if(req.method === "POST"){
      		req.checkBody("name", "must be at least 2 characters in length").isLength({min: 2});
      		req.checkBody("email", "must be valid").isEmail();
      		req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
      		req.checkBody("confirmPassword", "must match password provided").optional().matches(req.body.password);
    	}

    	const errors = req.validationErrors();
    	if(errors){
      		req.flash("error", errors);
      		return res.redirect(req.headers.referer);
    	} else {
      		return next();
    	}	
	},
  validateExistingUsers(req, res, next){
    if(req.method === "POST"){
      req.checkBody("email", "must be a valid email").isEmail();
      req.checkBody("password", "must be at least 6 characters in length").isLength({min: 6});
    }
    const errors = req.validationErrors();
    if(errors){
      req.flash("error", errors);
      return res.redirect(req.headers.referer);
    } else {
      return next();
    } 
  }
}