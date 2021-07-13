const router = require("express").Router();
const UserModel = require("../model/user.model");
const postModel = require("../model/post.model");
const { body, validationResult } = require("express-validator");

router.use((req, res, next) => {
  var username = req.session && req.session.username;
  if (!username) {
    res.locals.username = "";
  } else {
    res.locals.username = username;
  }

  next();
});

router.get("/", function (req, res) {
  //res.render('pages/home'); // path inside views folder. ./views/pages/home.ejs
  postModel
    .findAll()
    .then((posts) => {
      return res.render("pages/home", { posts: posts });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/about", function (req, res) {
  res.render("pages/about");
});

router.get("/signin", function (req, res) {
  res.render("pages/signin", {
    user: null,
    password: null,
    error: null,
  }); // path inside views folder. ./views/pages/home.ejs
});

router.get("/signup", function (req, res) {
  res.render("pages/signup", {
    user: null,
    email: null,
    password: null,
    error: null,
  });
});

router.post(
  "/signin",
  [
    body("username").not().isEmpty().withMessage("Please Enter Username"),
    body("password").not().notEmpty().withMessage("Please Enter Password"),
  ],
  async (req, res) => {
    var { username, password } = req.body;

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("pages/signin", {
        user: null,
        password: null,
        error: errors.array().reduce((acc, val) => {
          return acc + val.msg + "\n";
        }, ""),
      });
    }

    var user = await UserModel.findByUsername(username);

    if (user && user.password == password) {
      // store data in the session
      req.session.username = username;
      res.locals.username = username;
      postModel
        .findAll()
        .then((posts) => {
          res.render("pages/home", { posts: posts });
        })
        .catch((err) => console.log(err));
    } else {
      //TODO : username and password is incorrect
      res.render("pages/signin", {
        user: username,
        password: password,
        error: "Username or Password invalid",
      });
    }
  }
);

router.post(
  "/signup",
  [    
    body("username")
      .not()
      .isEmpty()
      .withMessage("Username is required")
      .custom(function (val) {
        return new Promise((resolve, reject) => {
          UserModel.isValidUsername(val)
          .then(isPresent => {
            if (isPresent) {
                return reject('Username is already present');
            }
            resolve();
          })
          
        });
      }),
    body("password").not().isEmpty().withMessage("Password is required"),
    body("email").not().isEmpty().withMessage("Email is required"),
  ],
  async (req, res) => {
    const { username, mobile, email, password } = req.body;

    var errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render("pages/signup", {
        user: null,
        email: null,
        password: null,
        error: errors.array().reduce((acc, val) => {
          return acc + val.msg + "\n";
        }, ""),
      });
    }

    await UserModel.create(req.body);
    req.session.username = username;
    res.locals.username = username;
    postModel
      .findAll()
      .then((posts) => {
        res.render("pages/home", { posts: posts });
      })
      .catch((err) => console.log(err));
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/signin");
});
module.exports = router;
