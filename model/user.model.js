const {readFile, writeFile} = require('../helper/file.helper');
const path = require('path');


const FILE_PATH = path.join(__dirname,'..','data','user.data.json');

//Function : To return all users 
var findAll = function(){
    return readFile(FILE_PATH);
}

//Function : To return a user by username
var findByUsername = async function(username){
    var users = await readFile(FILE_PATH);
    
    if(users[username.toLowerCase()])
    {
        return users[username];
    }
}

//Function : To check given username is already present
var isValidUsername = async function(username){
    var users = await readFile(FILE_PATH);
    if(users[username.toLowerCase()]){
        return true;
    }
    return false;
}

//Function : To create a new user
var create = async function(user){
    var users = await readFile(FILE_PATH);
    users[user.username] = user ;
    return await writeFile(FILE_PATH,users);    
}


module.exports = {findAll,findByUsername,isValidUsername,create};