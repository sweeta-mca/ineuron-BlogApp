const router = require('express').Router();
const authMiddleware =require('../middleware/auth.middleware');
const multer = require('multer');
const postModel = require('../model/post.model');
const { readFile } = require('../helper/file.helper');
const postAuthorization = require('../middleware/postAuthorization.middleware')


// for upload files with form enctype="multipart/formData" using multer library
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
    },
    filename: function (req, file, cb) {
        var originalname = file.originalname;
        var extension = originalname.split('.').splice(-1)[0];
        var fieldname = `${file.fieldname}-${Date.now()}.${extension}`;
      cb(null, fieldname)
    }
  })

var upload = multer({storage:storage});

router.use(authMiddleware);

router.get('/', (req,res)=>{
  postModel.findAllByUser(req.session.username).then(posts => {
    res.render('pages/posts',{posts:posts});
  })
  .catch(err => {
    console.log(err)
  });
  
});

router.get('/create',(req,res)=>{
    res.render('pages/createPost',{username:req.session.username});
});

// upload.single('image') -> image should be same name used in multi part form
router.post('/create',upload.single('image'),async (req,res)=>{
    var {title,description} = req.body;
    var filename = req.file.filename;
    var author = req.session.username;
    await postModel.create(title,description,author,filename) ;  
    res.redirect("/posts");
});

router.get('/edit/:id',(req,res) => {
  var {id} = req.params;
  postModel.findById(id)
  .then(post => {
    return res.render("pages/editPost",{
      post : post
    })
  })
});


router.post('/edit/:id' , postAuthorization, (req,res) => {
  var {title,description} = req.body;
  var {id} = req.params;

  postModel.update(id,title,description)
  .then(_ => res.redirect('/posts'))
  .catch(err => console.log(err))
});

router.get('/delete/:id',postAuthorization, (req,res)=>{
  var {id} =req.params;
  postModel.remove(id)
  .then(_ => res.redirect('/posts'))
  .catch(err => console.log(err))
});

module.exports =router;