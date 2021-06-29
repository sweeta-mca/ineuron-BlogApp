const router = require('express').Router();
const UserModel  = require('../model/user.model');

router.get('/', function(req,res){
    
    res.render('pages/home',{username:req.session.username}); // path inside views folder. ./views/pages/home.ejs
});

router.get('/about', function(req,res){
    res.render('pages/about',{username:req.session.username});
});

router.get('/signin', function(req,res){
    res.render('pages/signin',{username:req.session.username}); // path inside views folder. ./views/pages/home.ejs
});

router.get('/signup', function(req,res){
    res.render('pages/signup',{username:req.session.username});
});

router.post('/signin', async (req,res)=>{
    var {username,password} = req.body;
    
    // TODO: validate username and password
    var user = await UserModel.findByUsername(username);
    
    if(user && user.password == password)
    {
        // store data in the session
    req.session.username = req.body.username;
    res.render('pages/home',{username:req.session.username});
    }
    //TODO : username and password is incorrect
    //res.send("Invalid user")
});

router.post('/signup', async (req,res) => {
    const {username,mobile,email,password} = req.body;
    //TODO : validate the data
    //TODO : check user name is present already
    var isPresent = await UserModel.isValidUsername(username);
    if(isPresent)
    {
        //TODO : Notify user that username is present
        res.send("Username available");
    } 
    //TODO: register the user 
    await UserModel.create({...req.body,username:username.toLowerCase()});
    //TODO: Start session
    req.session.username = username;
    // redirect the user to home page  
    res.render('pages/home',{username:req.session.username});
});


router.get('/logout', (req,res) => {
    req.session.destroy();
    res.redirect('/signin');
})
module.exports = router;