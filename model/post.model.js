const { v4: uuidv4 } = require('uuid');
const {readFile, writeFile} = require('../helper/file.helper');
const path = require('path');


const DATA_PATH = path.join(__dirname,'..','data','post.data.json');

const SERVER_UPLOAD_URL = "http://localhost:3000/"

var getAllPosts = async function(){
    var postObj =await readFile(DATA_PATH);
    var posts = Object.keys(postObj).map((postKey)=>{
        return {
            ... postObj[postKey],
            id:postKey
        };
    });
    return posts;
}

var getAllPostsByUser = async function(author){
    var postObj =await readFile(DATA_PATH);
    var posts = Object.keys(postObj).map(postKey=>{
        return{
            ...postObj[postKey],
            id:postKey
        };
    }).filter(obj => {return obj.author == author })
    return posts;
}

var createPost = async function(title,description,author,filname){
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

var editPost = function(){

}

module.exports={
        getAllPosts,
        getAllPostsByUser,
        createPost,
        editPost        
}