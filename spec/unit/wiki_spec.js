const sequelize = require("../../src/db/models/index").sequelize;
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("Wiki", () => {
	beforeEach((done) => {
		this.wiki;
		this.user;

		sequelize.sync({force: true}).then((res) => {
			User.create({
				name: "test user",
				email: "test@example.com",
				password: "1111111111"
			})
			.then((user) => {
				this.user = user;
				Wiki.create({
					title: "Roundnet Sport",
					body: "An all American way to play",
					private: false,
					userId: this.user.id
				})
				.then((wiki) => {
					this.wiki = wiki;
					done();
				})
				.catch((err) => {
					console.log(err);
				});
			})
		});
	});

	describe("#create()", () => {
		it("should create a new wiki", (done) => {
			Wiki.create({
				title: "Spikeball",
				body: "The best brand of Roundnet",
				private: false,
				userId: this.user.id
			})
			.then((wiki) => {
				expect(wiki.title).toBe("Spikeball");
				expect(wiki.body).toBe("The best brand of Roundnet");
				done();
			})
			.catch((err) => {
				console.log(err);
				done();
			});
		});

		it("should not create a wiki missing any of the parameters", (done) => {
			Wiki.create({
				title: "Nothing"
			})
			.then((wiki) => {
				//doesn't matter
				done();
			})
			.catch((err) => {
				expect(err.message).toContain("Wiki.body cannot be null");
            	expect(err.message).toContain("Wiki.userId cannot be null");
            	done();
			});
		});
	});

	describe("#setUser()", () => {
		it("sould associate a wiki and a user", (done) => {
			User.create({
				name: "Jedediah",
				email: "jed@blocipedia.com",
				password: "2222222222"
			})
			.then((newUser) => {
				expect(this.wiki.userId).toBe(this.user.id);
				this.wiki.setUser(newUser)
				.then((wiki) => {
					expect(this.wiki.userId).toBe(newUser.id);
					done();
				})
			})
		});
	});

	describe("#getUser()", () => {
		it("should return the associated wiki", (done) => {
			this.wiki.getUser()
			.then((associatedUser) => {
				expect(associatedUser.email).toBe("test@example.com");
				done();
			})
		});
	});

});























