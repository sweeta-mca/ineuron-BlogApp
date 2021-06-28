const {readFile, writeFile} = require('../helper/file.helper');
const path = require('path');


const FILE_PATH = path.join(__dirname,'..','data','user.data.json');

var findAll = function(){
    return readFile(FILE_PATH);
}

var findByUsername = async function(username){
    var users = await readFile(FILE_PATH);
    
    if(users[username.toLowerCase()])
    {
        return users[username];
    }
}

var isValidUsername = async function(username){
    var users = await readFile(FILE_PATH);
    if(users[username.toLowerCase()]){
        return true;
    }
    return false;
}

var create = async function(user){
    var users = await readFile(FILE_PATH);
    users[user.username] = user ;
    return await writeFile(FILE_PATH,users);    
}


module.exports = {findAll,findByUsername,isValidUsername,create};