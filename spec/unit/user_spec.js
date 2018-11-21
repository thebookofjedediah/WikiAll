const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../../src/db/models").User;

describe("User", () => {
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

	describe("#create()", () => {
		it("should create a new User object with a email and password", (done) => {
         	User.create({
            	name: "Test User",
            	email: "test@example.com",
            	password: "1111111111"
         	})
         	.then((user) => {
            	expect(user.email).toBe("test@example.com");
            	expect(user.id).toBe(1);
            	done();
         	})
         	.catch((err) => {
            	console.log(err);
            	done();
         	});
      	});
      
      	it("should not create a user with an invalid email or password", (done) => {
         	User.create({
            	name: "Other Test",
            	email: "Test Email",
            	password: "2222222222"
         	})
         	.then((user) => {
            	done();
         	})
         	.catch((err) => {
            	expect(err.message).toContain("Validation error: must be a valid email");
            	done();
         	});
      	});

      	it("should not create a user with an email already taken", (done) => {
         	User.create({
            	name: "Test User",
            	email: "test@example.com",
            	password: "1111111111"
         	})
         	.then((user) => {
            	User.create({
               		name: "Test Copy",
               		email: "test@example.com",
               		password: "2222222222"
            	})
            	.then((user) => {
            		//this doesn't make a difference
               		done();
            	})
            	.catch((err) => {
               		done();
            	})
         	})
         	.catch((err) => {
            	console.log(err);
            	done();
         	});
      	});

    });
});