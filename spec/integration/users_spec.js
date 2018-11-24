const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/users/";
const User = require("../../src/db/models").User;
const sequelize = require("../../src/db/models/index").sequelize;

describe("routes : users", () => {
	beforeEach((done) => {
		sequelize.sync({force: true})
		.then(() => {
			done();
		})
		.catch((err) => {
			console.log(err);
			done();
		});
	});

	describe("GET /users/signup", () => {
		it("should render a new view with a user sign-up form", (done) => {
			request.get(`${base}signup`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Sign Up");
				done();
			});
		});
	});

	describe("POST /users/signup", () => {
		it("should create a new user and redirect", (done) => {
			const options = {
				url: base + "signup",
				form: {
					name: "Test User",
					email: "test@example.com",
					password: "1111111111",
					confirmPassword: "1111111111"
				}
			}

			request.post(options, (err, res, body) => {
				console.log(body);
				User.findOne({where: {email: "test@example.com"}})
				.then((user) => {
					expect(user).not.toBeNull();
					expect(user.email).toBe("test@example.com");
					expect(user.id).toBe(1);
					done();
				})
				.catch((err) => {
					console.log(err);
					done();
				});
			})
		});

		it("should not create a new user with invalid attributes and redirect", (done) => {
         	request.post(
         		{
               		url: base + "signup",
               		form: {
                  		name: "whoever",
                  		email:"email",
                  		password:"1111111111",
                  		confirmPassword: "1111111111"
               		}
				},
            	(err, res, body) => {
               		User.findOne({where: {email: "email"}})
               		.then((user) => {
                  		expect(user).toBeNull();
                  		done();
               		})
               		.catch((err) => {
                  		console.log(err);
                  		done();
               		});
         		}
         	)
      	});	
	});

	describe("GET /users/signin", () => {
		it("should render a new view with a user sign-in form", (done) => {
			request.get(`${base}signin`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Sign In");
				done();
			});
		});
	});
});