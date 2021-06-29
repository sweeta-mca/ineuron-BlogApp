const express = require('express');
const app =express();
const path = require('path');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const postRoutes = require('./routes/post.routes');
const publicRoutes = require('./routes/public.routes');
const { urlencoded } = require('express');

// set view engine to ejs
app.set('view engine','ejs');

// serve static files 
app.use('/static',express.static(path.join(__dirname, 'public')))

app.use(session({
    secret:'secret@1234',
    resave:true,
    saveUninitialized:true,
    store: new FileStore({
        retries:0
})
}));

app.use(express.json());
app.use(urlencoded({extended:false}))

app.use('/posts',postRoutes);
app.use('/',publicRoutes);

app.get('/favicon.ico', function(req, res) { 
    res.sendStatus(204); 
});


app.listen(3000, ()=>{
    console.log("server started successfully")
});