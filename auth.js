const User = require('./models/User');

const auth = async (req, res, next) => {
  const token = req.get('Token');

  if (!token) {
    return res.status(401).send({error: 'No token present!'});
  }

  const user = await User.findOne({token: token});

  if (!user) {
    return res.status(401).send({error: 'User not found!'});
  }

  req.user = user;

  next();

};

module.exports = auth;