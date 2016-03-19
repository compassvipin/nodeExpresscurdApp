var utils    = require( '../utils' );
var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var Users =  require('../app/model/users.js');

router.index =  function(req,res,next){
  res.render( 'index', {
          title : 'Blog Example'
      });
};

router.users =  function(req,res,next){
	var user_id = req.cookies ?
    req.cookies.user_id : undefined;
  Users.
    find({},{"user_id" : 1,"name" : 1,"email" : 1}).
    sort({"updated_at": 1} ).
    exec( function ( err, users ){
      if( err ) return next( err );
      res.render( 'blogHome', {
          title : 'Blog Example',
          users : users
      });
    });

};

router.loadCreate  =  function(req,res,next){
		res.render( 'users', {
		  title : 'Blog Example'
		});
};

router.create  = function(req,res,next){
    
    if(req.body.passwordsignup == req.body.passwordsignup_confirm){
          var password = req.body.passwordsignup;
    }else{
          var password = null;
          res.send('password Doesnt match  together');
    }
    if(req.body.emailsignup){
      var name = req.body.emailsignup.split("@"); 
      if(req.body.passwordsignup == req.body.passwordsignup_confirm){
          var password = req.body.passwordsignup;
      }
      new Users({
      name:name[0],
      email:req.body.emailsignup,
      password:password,
      updated_at : Date.now()
      }).save( function ( err, todo, count ){
      if( err ) return next( err );
         res.redirect( '/users' );
      });
   }
};

router.edit =  function (req,res,next) {
    var o_id = new mongo.ObjectID(req.params.id);
    Users.findOne({'_id':o_id}).
         sort( '-updated_at' ).
         exec( function ( err, user ){
                if( err ) return next( err );
                //
          res.render( 'edit', {
              title   : 'Edit User',
              todos   : JSON.parse(JSON.stringify(user)),
              current : req.params.id
          });
        });

};
router.update = function(req,res,next){
  
  var o_id = new mongo.ObjectID(req.params.id)
  Users.findById(req.params.id, function ( err, user ){
      user.name    = req.body.name;
      user.email  = req.body.emailsignup;
      user.save( function ( err, todo){
      if( err ) return next( err );

      res.redirect( '/users' );
      });
  });
 
};

router.delete = function(req,res,next){
    Users.findById(req.params.id, function(err, user){
        if( err ) return next( err );
        user.remove(function(err,user){
          if( err ) return next( err );

          res.redirect( '/users' );

        });  
    })
}

router.current_user =  function(req,res,next){
	var user_id = req.cookies ?
	req.cookies.user_id : undefined;

	if(!user_id ){
		res.cookie( 'user_id', utils.uid( 32 ));
	}

	next();
};
 
module.exports = router;
