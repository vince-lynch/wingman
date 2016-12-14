var router = require('express').Router();
var jwt = require('jsonwebtoken');
var usersController = require('../controllers/users.server.controller');
var authenticationController = require('../controllers/authentication');
var secret = require('../../config/tokens').secret;

// custom JWT middleware
function secureRoute(req, res, next) {
  if(!req.headers.authorization) return res.status(401).json({ message: 'Unauthorized' });

  var token = req.headers.authorization.replace('Bearer ', '');

  jwt.verify(token, secret, function(err, user) {
    if(!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
}


router.post('/auth/facebook',authenticationController.facebook);

router.route('/users')
  .get(secureRoute,usersController.index);

router.route('/users/:id')
  .get(secureRoute,usersController.show)
  .put(secureRoute, usersController.update)
  .patch(secureRoute, usersController.update)
  .delete(secureRoute, usersController.delete);


router.post('/auth/register', authenticationController.register);
router.post('/auth/login', authenticationController.login);

module.exports = router;