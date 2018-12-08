const ApplicationPolicy = require("./application");

module.exports = class TopicPolicy extends ApplicationPolicy {

  create() {
    return this.new();
  }

  edit() {
    return this._isAdmin() || this._isOwner() || this._isPremium() || this._isCollaborator();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}