const sendResponse = require("../utils/sendResponse");

function homeRoute(request, response){

    sendResponse(response,200,{
        message:"Welcome to StoryForge AI"
    });

}

module.exports = homeRoute;