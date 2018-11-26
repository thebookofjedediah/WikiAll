const request = require("request");
const base = "http://localhost:3000/wikis/";
const sequelize = require("../../src/db/models/index").sequelize;
const server = require("../../src/server");
const Wiki = require("../../src/db/models").Wiki;
const User = require("../../src/db/models").User;

describe("routes : wikis", () => {
	beforeEach((done) => {
		this.wiki;
		this.user;

		sequelize.sync({force: true}).then((res) => {
			User.create({
				name: "Jed Arnold",
				email: "jed@blocipedia.com",
				password: "1111111111"
			})
			.then((user) => {
				this.user = user;

				Wiki.create({
					title: "Roundnet Sport",
					body: "The worlds greatest sport. Most popular brand is Spikeball.",
					private: false,
					userId: this.user.id
				})
				.then((wiki) => {
					this.wiki = wiki;
					done();
				})
			})
		});
	});

	describe("GET /wikis", () => {
		it("should return a status code 200 and a list of all the wikis", (done) => {
			request.get(base, (err, res, body) => {
				expect(res.statusCode).toBe(200);
				expect(err).toBeNull();
				expect(body).toContain("Wikis");
				expect(body).toContain("Roundnet Sport");
				done();
			});
		});
	});

	describe("GET /wikis/new", () => {
		it("should render a form for creating new wikis", (done) => {
			request.get(`${base}new`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("New Wiki");
				done();
			});
		});
	});

	describe("POST /wikis/create", () => {
		const options = {
			url: `${base}create`,
			form: {
				title: "Spikeball",
				body: "The all American sport",
				userId: this.user.id
			}
		};
		it("should create a new wiki and redirect", (done) => {
			request.post(options, (err, res, body) => {
				console.log(res.statusMessage);
				Wiki.findOne({where: {title: "Spikeball"}})
				.then((wiki) => {
					expect(this.wiki.title).toBe("Spikeball");
					expect(this.wiki.body).toBe("The all American sport");
					done();
				})
				.catch((err) => {
					console.log(err);
					done();
				});
			});
		});
	});

	describe("GET /wikis/:id", () => {
		it("should render a view with the selected wiki", (done) => {
			request.get(`${base}${this.wiki.id}`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Roundnet Sport");
				done();
			});
		});
	});

	describe("POST /wikis/:id/destroy", () => {
		it("should delete the selected wiki", (done) => {
			Wiki.all()
			.then((wikis) => {
				const wikiCountBeforeDelete = wikis.length;

				expect(wikiCountBeforeDelete).toBe(1);

				request.post(`${base}${this.wiki.id}/destroy`, (err, res, body) => {
					Wiki.all()
					.then((wikis) => {
						expect(err).toBeNull();
						expect(wikis.length).toBe(wikiCountBeforeDelete -1);
						done();
					});
				});
			});
		});
	});

	describe("GET /wikis/:id/edit", () => {
		it("should render a view with the wiki form selected in an editable form", (done) => {
			request.get(`${base}${this.wiki.id}/edit`, (err, res, body) => {
				expect(err).toBeNull();
				expect(body).toContain("Edit Wiki");
				expect(body).toContain("Roundnet Sport");
				done();
			})
		});
	});

	describe("POST /wikis/:id/update", () => {
		it("should update the current wiki with new given values", (done) => {
			request.post({
				url: `${base}${this.wiki.id}/update`,
				form: {
					title: "Roundnet Sport",
					body: "the illest and realist ever",
					userId: "this.user.id"
				}
			}, (err, res, body) => {
				expect(err).toBeNull();
				Wiki.findOne({
					where: {id:1}
				})
				.then((wiki) => {
					expect(wiki.title).toBe("Roundnet Sport");
					done();
				});
			});
		});
	});
});

