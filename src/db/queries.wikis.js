const Wiki = require("./models").Wiki;
const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
   getAllWikis(callback) {
      return Wiki.all({
         include: [{
            model: Collaborator,
            as: "collaborators"
         }]
      })
      .then((wikis) => {
         callback(null, wikis);
      })
      .catch((err) => {
         callback(err);
      });
   },
   getPublicWikis(callback) {
      return Wiki.all({
         where: { private: false},
         include: [{
            model: Collaborator, 
            as: "collaborators", 
         }],
      })
      .then((wikis) => {
         callback(null, wikis);
      })
      .catch((err) => {
         callback(err);
      });
   },
	// getAllWikis(callback){
	// 	return Wiki.all()
	// 	.then((wikis) => {
	// 		callback(null, wikis);
	// 	});
	// },
   // getCollabWikis(callback){
   //    return Wiki.all({
   //       include: [{
   //          model: Collaborator,
   //          as: "collaborators",
   //          attributes: ["userId"]
   //       },
   //    ]})
   //    .then((wikis) => {
   //       callback(null, wikis);
   //    });
   // },
   // getPublicWikis(callback){
   //    return Wiki.all({
   //       include: [{
   //          model: Collaborator, 
   //          as: "collaborators", 
   //          attributes: ["userId"]
   //          }
   //       ],
   //       where: {
   //          private: false, 
   //       },
   //    })
   //    .then((wikis) => {
   //       callback(null, wikis);
   //    })
   //    .catch((err) => {
   //       callback(err);
   //    });
   // },
	addWiki(newWiki, callback) {
      	return Wiki.create(newWiki)
      	.then((wiki) => {
         	callback(null, wiki);
      	})
      	.catch((err) => {
         	callback(err);
      	});
   	},
   	getWiki(id, callback) {
         return Wiki.findById(id,{
            include: [
            {model: Collaborator, as: "collaborators", include: [
            {model: User}
            ]},
         ]})
      	.then((wiki) => {
         	callback(null, wiki);
      	})
      	.catch((err) => {
         	callback(err);
      	});
   	},
   	deleteWiki(id, callback) {
      	return Wiki.destroy({
         	where: {id}
      	})
      	.then((wiki) => {
         	callback(null, wiki);
      	})
      	.catch((err) => {
         	callback(err);
      	});
   	},
      updateWiki(req, updatedWiki, callback) {
         return Wiki.findById(req.params.id)
         .then((wiki) => {
            if(!wiki){
               return callback("Wiki not found");
            }
            wiki.update(updatedWiki, {
               fields: Object.keys(updatedWiki)
            })
            .then(() => {
               callback(null, wiki);
            })
            .catch((err) => {
               callback(err);
            });
         })
      },
   	updateWikiPrivate(req, updatedPrivate, callback) {
         return Wiki.findById(req.params.id)
         .then((wiki) => {
            if(!wiki){
               return callback("Wiki not found");
            }
            return wiki.update({private: updatedPrivate}, {fields:['private']})
            .then(() => {
               callback(null, wiki);
            })
            .catch((err) => {
               callback(err);
            });
         })
   	}

}