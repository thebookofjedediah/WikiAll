const wikiQueries = require("../db/queries.wikis.js");
const Authorizer = require("../policies/wiki");
const markdown = require("markdown").markdown;

module.exports = {
  index(req, res, next) {
    if (req.user) {
      let userWikis = [];
      wikiQueries.getAllWikis((err, wikis) => {
        if (err) {
          res.redirect(500, "static/index");
        } else {
          wikis.forEach(wiki => {
            if (wiki.private) {
              if (wiki.collaborators.length !== 0) {
                wiki.collaborators.forEach(collaborator => {
                  if (
                    (collaborator.userId == req.user.id &&
                      wiki.id == collaborator.wikiId) ||
                    req.user.role == 2 ||
                    req.user.id == wiki.userId
                  ) {
                    userWikis.push(wiki);
                  }
                });
              } else {
                if (req.user.role == 2 || req.user.id == wiki.userId) {
                  userWikis.push(wiki);
                }
              }
            } else {
              userWikis.push(wiki);
            }
          });
          res.render("wikis/index", { userWikis });
        }
      });
    } else {
      let userWikis = [];
      wikiQueries.getPublicWikis((err, wikis) => {
        if (err) {
          res.redirect(500, "static/index");
        } else {
          userWikis = wikis;
          res.render("wikis/index", { userWikis });
        }
      });
    }
  },

  new(req, res, next) {
    const authorized = new Authorizer(req.user).new();
    if (authorized) {
      res.render("wikis/new");
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  create(req, res, next) {
    const authorized = new Authorizer(req.user).create();
    if (authorized) {
      let newWiki = {
        title: req.body.title,
        body: req.body.body,
        private: req.body.private,
        userId: parseInt(req.user.id)
      };
      wikiQueries.addWiki(newWiki, (err, wiki) => {
        if (err) {
          res.redirect(500, "/wikis/new");
        } else {
          res.redirect(303, `/wikis/${wiki.id}`);
        }
      });
    } else {
      req.flash("notice", "You are not authorized to do that.");
      res.redirect("/wikis");
    }
  },
  show(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        wiki.title = markdown.toHTML(wiki.title);
        wiki.body = markdown.toHTML(wiki.body);
        res.render("wikis/show", { wiki });
      }
    });
  },
  edit(req, res, next) {
    wikiQueries.getWiki(req.params.id, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, "/");
      } else {
        const authorized = new Authorizer(req.user, wiki).edit();
        if (authorized) {
          res.render("wikis/edit", { wiki });
        } else {
          req.flash("notice", "You are not authorized to do that.");
          res.redirect(`/wikis/${req.params.id}`);
        }
      }
    });
  },
  destroy(req, res, next) {
    wikiQueries.deleteWiki(req, (err, wiki) => {
      if (err) {
        res.redirect(err, `/wikis/${req.params.id}`);
      } else {
        res.redirect(303, "/wikis");
      }
    });
  },
  update(req, res, next) {
    wikiQueries.updateWiki(req, req.body, (err, wiki) => {
      if (err || wiki == null) {
        res.redirect(404, `/wikis/${req.params.id}/edit`);
      } else {
        res.redirect(`/wikis/${wiki.id}`);
      }
    });
  },
  makePrivate(req, res, next) {
    if (req.user.role == 1 || req.user.role == 2) {
      wikiQueries.updateWikiPrivate(req, true, (err, wiki) => {
        if (err || wiki == null) {
          res.redirect(404, `/wikis/${wiki.id}`);
        } else {
          const authorized = new Authorizer(req.user, wiki).edit();
          if (authorized) {
            req.flash(
              "notice",
              "You have made this wiki private and only viewable to you, admins, and your collaborators"
            );
            res.redirect(`/wikis/${wiki.id}`);
          }
        }
      });
    } else {
      req.flash(
        "notice",
        "You are not authorized to do that. Upgrage to a premium account to make private wikis"
      );
      res.redirect(`/wikis/${req.params.id}`);
    }
  },
  makePublic(req, res, next) {
    if (req.user.role == 1 || req.user.role == 2) {
      wikiQueries.updateWikiPrivate(req, false, (err, wiki) => {
        if (err || wiki == null) {
          res.redirect(404, `/wikis/${wiki.id}`);
        } else {
          const authorized = new Authorizer(req.user, wiki).edit();
          if (authorized) {
            req.flash(
              "notice",
              "You have made this wiki public and is viewable to anyone"
            );
            res.redirect(`/wikis/${wiki.id}`);
          }
        }
      });
    } else {
      req.flash(
        "notice",
        "You are not authorized to do that. Upgrage to a premium account to make private wikis"
      );
      res.redirect(`/wikis/${req.params.id}`);
    }
  }
};
