module.exports = class ApplicationPolicy {

 // #1
  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

 // #2
  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isPremium() {
    return this.user && this.user.role == 1;
  }

  _isAdmin() {
    return this.user && this.user.role == 2;
  }

  _isCollaborator() {
    return (
      this.record.collaborators[0] && this.record.collaborators.find(collaborator => {
        return this.user.id == collaborator.userId;
      })
    );
  }

  _isPrivate() {
    return this.record && this.record.private == true;
  }

  _isPublic() {
    return this.record && this.record.private == false;
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  edit() {
    return this.new() &&
      this.record && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}