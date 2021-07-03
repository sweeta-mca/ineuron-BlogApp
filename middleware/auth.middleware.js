

function authMiddleware(req,res,next){
    if(!req.session.username){
        return res.redirect('/signin');
    }
    else{
        next();
    }
}

module.exports = authMiddleware;