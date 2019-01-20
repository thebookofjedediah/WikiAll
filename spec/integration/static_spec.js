const request = require("request");
const server = require("../../src/server");
const base = "http://localhost:3000/";

describe("routes : static", () => {
  describe("GET /", () => {
    it("should return code 200 and have Welcome to WikiAll", done => {
      request.get(base, (err, res, body) => {
        expect(res.statusCode).toBe(200);
        expect(res.body).toContain("Welcome to WikiAll");
        done();
      });
    });
  });
});
