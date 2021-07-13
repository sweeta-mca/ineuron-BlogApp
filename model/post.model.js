const { v4: uuidv4 } = require('uuid');
const {readFile, writeFile} = require('../helper/file.helper');
const path = require('path');
const _ = require('lodash');

const DATA_PATH = path.join(__dirname,'..','data','post.data.json');

const SERVER_UPLOAD_URL = "http://localhost:3000/"

//Function : To return all posts 
var findAll = async function(){
    var postObj =await readFile(DATA_PATH);
    var posts = Object.keys(postObj).map((postKey)=>{
        return {
            ... postObj[postKey],
            id:postKey
        };
    });
    return posts;
}

//Function : To return all posts of particular user
var findAllByUser = async function(author){
    var postObj =await readFile(DATA_PATH);
    var posts = Object.keys(postObj).map(postKey=>{
        return{
            ...postObj[postKey],
            id:postKey
        };
    }).filter(obj => {return obj.author == author })
    return posts;
}

//Function : To return a post by id 
var findById = async function (id){
    var posts = await readFile(DATA_PATH)
    console.log(posts[id])
    return {...posts[id],id:id}
}

//Function : To create new post 
var create = async function(title,description,author,filname){
    var data = {
        title:title,
        description:description,
        author:author.toLowerCase(),
        createdAt:new Date().toISOString(),
        imageUrl:`${SERVER_UPLOAD_URL}uploads/${filname}`
    }
    var posts = await readFile(DATA_PATH)
    var id = uuidv4();
    posts[id]=data;
    console.log(posts);
    return await writeFile(DATA_PATH,posts);
}

//Function : To update a post by id 
var update = async function(id,title, description){
    var posts = await readFile(DATA_PATH);
    posts[id] = {...posts[id],title,description};
    return await writeFile(DATA_PATH, posts);
}

//Function : To remove a post by id
var remove = async function(id){
    var posts = await readFile(DATA_PATH);
    var newPosts = _.omit(posts,id);
    return await writeFile(DATA_PATH,newPosts);
}

module.exports={
        findAll,
        findAllByUser,
        findById,
        create,
        update,
        remove    
}