const Collaborator = require("./models").Collaborator;
const User = require("./models").User;

module.exports = {
	getAllCollaborators(callback){
		return User.all({
			include: [{
				model: Collaborator,
				as: "collaborators"
			}]
		})
		.then((users) => {
			callback(null, users);
		})
		.catch((err) => {
			callback(err);
		});
	},
	addCollaborator(req, collaboratorInfo, callback){
		return Collaborator.findOne({
			where: {
				wikiId: req.params.wikiId,
				userId: req.body.id
			}
		})
		.then((collaborator) => {
			console.log(req.body.id);
			if(!collaborator){
				Collaborator.create({
					wikiId: req.params.wikiId,
					userId: req.body.id
				})
				.then((collaborator) => {
					callback(null, collaborator);
				})
				.catch((err) => {
					callback(err);
				});
			} else {
				console.log("here is an error in adding a collaborator");
				callback("error", "Collab already on this wiki");
			}
		})
	},
	removeCollaborator(req, collaboratorInfo, callback){
		return Collaborator.findOne({
			where: {
				wikiId: req.params.wikiId,
				userId: req.body.id
			}
		})
		.then((collaborator) => {
			console.log(req.body.id);
			if(collaborator){
				console.log(collaborator.id);
				Collaborator.destroy({
					where: {
						id: collaborator.id
					}
				})
				.then((collaborator) => {
					callback(null, collaborator);
				})
				.catch((err) => {
					callback(err);
				});
			} else {
				console.log("Error for removing the collaborator");
				callback("error", "Collaborator is no longer on this wiki");
			}
		})
	}
}
