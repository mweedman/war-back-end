const LoginService = require('../login/login-services');

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';
  let basicToken;

  if (!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: 'Missing basic token'});
  } else {
    basicToken = authToken.slice(7, authToken.length);
  }

  const [tokenUserName, tokenPassword] = LoginService.parseBasicToken(basicToken);

  if (!tokenUserName || !tokenPassword) {
    return res.status(401).json({error: 'Unauthorized request'});
  }

  LoginService.getUserWithUserName(
    req.app.get('db'),
    tokenUserName
  )
    .then(user => {
      if (!user) {
        return res.status(401).json({error: 'Unauthorized request'});
      }
      return LoginService.comparePasswords(tokenPassword, user.password)
        .then(passwordsMatch => {
          if (!passwordsMatch) {
            return res.status(401).json({error: 'Unauthorized request'});
          }
          req.user = user;
          next();
        });
    })
    .catch(next);
}

module.exports = {
  requireAuth
};