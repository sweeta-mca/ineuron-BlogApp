const postModel = require('../model/post.model');

function checkForAuthorization(req,res,next){
    var {id}  = req.params;
    var author = req.session.username;
    
    postModel.findById(id)
    .then(post =>{
        if(post && post.author == author)
        {
            return next();            
        }
        return res.status(401).json("Unauthorized");
    })
    .catch(err => {
        console.log(err);
    })
}

module.exports = checkForAuthorization;