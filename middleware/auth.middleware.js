

function authMiddleware(req,res,next){
    if(!req.session.username){
        res.redirect('/signin');
    }
    else{
        next();
    }
}

module.exports = authMiddleware;