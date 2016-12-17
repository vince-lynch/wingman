var router = require('express').Router();
var jwt = require('jsonwebtoken');
var usersController = require('../controllers/users.server.controller');
var authenticationController = require('../controllers/authentication');
var secret = require('../../config/tokens').secret;
var multer  = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log("got this far")
        cb(null, './public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname+ '-' + Date.now()+'.jpg')
    }
});
 var upload = multer({storage: storage}).single('file');





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

router.post('/upload',secureRoute, function(req, res) {
    upload(req,res,function(err){
        if(err){
             res.json({error_code:1,err_desc:err});
             return;
        }

        // need access to the file name here so can add the uploaded profile picture to user profile
         console.log("res.files", res.files) // cant find the .[dot].notation to access the filename property


         // logic for adding it to the user record.


         res.json({error_code:0,err_desc:null});
    })
});



router.route('/users')
  .get(secureRoute,usersController.index);

router.route('/users/:id')
  .get(secureRoute,usersController.show)
  .put(secureRoute, usersController.update)
  .patch(secureRoute, usersController.update)
  .delete(secureRoute, usersController.delete);


router.post('/auth/register', authenticationController.register);
router.post('/auth/login', authenticationController.login);


// socket controller needs making but for now






module.exports = router;