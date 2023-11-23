const { selectsAllUsers, selectsAUser } = require("../models/user-model");

exports.getsUsers = (req, res, next) => {
  selectsAllUsers().then((retrievedUsers) => {
    res.status(200).send({ users: retrievedUsers });
  });
};
exports.getUserInfo = (req, res, next) => {
  const { username } = req.params;
  selectsAllUsers()
    .then((validUsers) => {
      return allUserNames = validUsers.map((user) => {
        return user.username;
      });
    })
    .then((activeMembers) => {
      selectsAUser(username, activeMembers).then((userInfo) => {
        res.status(200).send({ user: userInfo });
      }).catch(next)
    })
};
